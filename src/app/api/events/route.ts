import { NextRequest } from 'next/server';
import { getAllEvents, createEvent } from '@/server/events';
import { response, errorResponse } from '@/utils/response';
import { uploadImage } from '@/utils/uploadImage';

// ─── In-Memory IP-Based Rate Limiter (Sliding Window) ────────────────────────

interface RateLimitEntry {
  timestamps: number[];
}

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 menit

const ipRequestMap = new Map<string, RateLimitEntry>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequestMap.get(ip) ?? { timestamps: [] };

  entry.timestamps = entry.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (entry.timestamps.length >= RATE_LIMIT_MAX) {
    ipRequestMap.set(ip, entry);
    return true;
  }

  entry.timestamps.push(now);
  ipRequestMap.set(ip, entry);
  return false;
}

function rateLimitResponse() {
  // Although errorResponse defaults to returning JSON, we manually add headers if needed.
  // Actually, we can just use errorResponse, but it doesn't allow passing custom headers.
  // So for rate limit, let's just return the standard errorResponse for now.
  return errorResponse(429, 'Too many requests, please try again later.');
}

// ─── Route Handlers ───────────────────────────────────────────────────────────

/**
 * GET /api/events
 * Publik — mengembalikan semua events diurutkan event_date terbaru.
 */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) return rateLimitResponse();

  const { data, error } = await getAllEvents();

  if (error) {
    return errorResponse(500, 'Gagal mengambil data events.');
  }

  return response(200, 'Berhasil mengambil data events.', data);
}

/**
 * POST /api/events
 * Terproteksi middleware (wajib Bearer token).
 * Membuat event baru — field wajib: title, event_date.
 * Field opsional: description, location, is_active, image.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) return rateLimitResponse();

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return errorResponse(400, 'Format form-data tidak valid.');
  }

  const title = formData.get('title') as string | null;
  const event_date = formData.get('event_date') as string | null;
  const description = formData.get('description') as string | null;
  const location = formData.get('location') as string | null;
  const is_active_str = formData.get('is_active') as string | null;
  const image = formData.get('image') as File | null;

  // ── Validasi field wajib ────────────────────────────────────────────────────
  if (!title || title.trim() === '' || !event_date || event_date.trim() === '') {
    return errorResponse(400, 'Field wajib (title, event_date) kosong atau tidak ada.');
  }

  // ── Validasi format event_date (harus ISO 8601 yang valid) ─────────────────
  const eventDateStr = event_date.trim();
  if (isNaN(Date.parse(eventDateStr))) {
    return errorResponse(400, 'Format event_date tidak valid. Gunakan format ISO 8601 (contoh: 2026-10-05T09:00:00+08:00).');
  }

  // ── Proses Upload Gambar ────────────────────────────────────────────────────
  let image_url: string | null = null;
  if (image && typeof image === 'object' && 'name' in image) {
    try {
      image_url = await uploadImage(image);
    } catch (uploadError) {
      return errorResponse(400, uploadError instanceof Error ? uploadError.message : 'Gagal mengunggah gambar.');
    }
  } else if (image && typeof image === 'string') {
    return errorResponse(400, 'Format file gambar tidak valid.');
  }

  const { data, error } = await createEvent({
    title: title.trim(),
    description: description ? description.trim() : null,
    event_date: eventDateStr,
    location: location ? location.trim() : null,
    image_url,
    is_active: is_active_str ? is_active_str === 'true' : true,
  });

  if (error) {
    return errorResponse(500, 'Gagal membuat event baru.');
  }

  return response(201, 'Event berhasil dibuat.', data);
}
