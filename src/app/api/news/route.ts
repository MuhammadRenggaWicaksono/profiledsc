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
  }
}