import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Tentukan rute pengecualian (Public POST & Protected GET) berdasarkan PRD
  const isFeedbackRoute = pathname.startsWith('/api/feedback');
  const isAttendanceRoute = pathname.startsWith('/api/attendance');

  // 2. Logika Penentuan Akses Publik
  let isPublicAccess = false;

  if (method === 'GET') {
    // Semua GET adalah publik, KECUALI melihat feedback dan attendance (itu hak admin)
    if (!isFeedbackRoute && !isAttendanceRoute) {
      isPublicAccess = true;
    }
  } else if (method === 'POST') {
    // Semua POST wajib token, KECUALI submit feedback dan submit attendance (pengunjung publik)
    if (isFeedbackRoute || isAttendanceRoute) {
      isPublicAccess = true;
    }
  }

  // 3. Jika bukan akses publik, wajibkan pengecekan Bearer Token (Admin)
  if (!isPublicAccess) {
    const authHeader = request.headers.get('authorization');
    const secretKey = process.env.API_SECRET_KEY;

    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized: Akses ditolak dari Middleware' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};