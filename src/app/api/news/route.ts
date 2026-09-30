import { NextResponse } from 'next/server';
import { getAllNews, createNews } from '@/server/news';

// GET: Publik (Menampilkan semua berita)
export async function GET() {
  const { data, error } = await getAllNews();
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Terproteksi Middleware (Menambah berita baru)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await createNews(body);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Format request tidak valid' }, { status: 400 });
import { NextRequest } from "next/server";
import { getAllNews, createNews } from "@/server/news";
import { response, errorResponse } from "@/utils/response";

export async function GET() {
  try {
    const data = await getAllNews();
    return response(200, "Berhasil mengambil daftar berita", data);
  } catch (error: any) {
    return errorResponse(500, error.message || "Gagal mengambil data berita");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.slug || !body.content) {
      return errorResponse(400, "Judul, slug, dan konten wajib diisi");
    }

    const newNews = await createNews(body);
    return response(201, "Berita berhasil dibuat", newNews);
  } catch (error: any) {
    return errorResponse(500, error.message || "Gagal menambahkan berita");
  }
}