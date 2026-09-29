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