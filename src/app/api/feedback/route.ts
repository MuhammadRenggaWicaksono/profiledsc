import { NextRequest } from 'next/server';
import { createFeedback, getAllFeedbacks } from '@/server/feedback';
import { response, errorResponse } from '@/utils/response';

/**
 * GET /api/feedback
 * Mengambil semua data feedback (Khusus Admin / Protected oleh Middleware)
 */
export async function GET() {
  try {
    const feedbacks = await getAllFeedbacks();
    return response(200, 'Berhasil mengambil data feedback', feedbacks);
  } catch (error: any) {
    return errorResponse(
      500,
      error.message || 'Gagal mengambil data feedback'
    );
  }
}

/**
 * POST /api/feedback
 * Mengirimkan feedback / kritik & saran baru (Public)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validasi: Pesan feedback wajib diisi
    if (!body.message || typeof body.message !== 'string' || !body.message.trim()) {
      return errorResponse(400, 'Pesan feedback (message) wajib diisi');
    }

    const newFeedback = await createFeedback({
      sender_name: body.sender_name || body.name,
      sender_email: body.sender_email || body.email,
      message: body.message,
    });

    return response(201, 'Feedback berhasil dikirimkan', newFeedback);
  } catch (error: any) {
    return errorResponse(
      500,
      error.message || 'Gagal mengirimkan feedback'
    );
  }
}