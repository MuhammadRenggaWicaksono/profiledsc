import { NextRequest } from "next/server";
import { getNewsBySlug, updateNewsBySlug, deleteNewsBySlug } from "@/server/news";
import { response, errorResponse } from "@/utils/response";

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const newsItem = await getNewsBySlug(slug);

    if (!newsItem) {
      return errorResponse(404, "Berita tidak ditemukan");
    }

    return response(200, "Berhasil mengambil detail berita", newsItem);
  } catch (error: any) {
    return errorResponse(500, error.message || "Terjadi kesalahan server");
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const body = await req.json();

    const updated = await updateNewsBySlug(slug, body);
    return response(200, "Berita berhasil diperbarui", updated);
  } catch (error: any) {
    return errorResponse(500, error.message || "Gagal memperbarui berita");
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    await deleteNewsBySlug(slug);

    return response(200, "Berita berhasil dihapus", null);
  } catch (error: any) {
    return errorResponse(500, error.message || "Gagal menghapus berita");
  }
}