import { NextResponse } from 'next/server';

// Fungsi untuk response BERHASIL
export function response(statusCode: number, message: string, data?: any) {
    return NextResponse.json({
        status: true, // Otomatis true
        message,
        data: data || null // Jika tidak ada data yang dikirim, jadikan null
    }, { status: statusCode });
}

// Fungsi untuk response GAGAL/ERROR
export function errorResponse(statusCode: number, message: string) {
    return NextResponse.json({
        status: false, // Otomatis false
        message,
        data: null
    }, { status: statusCode });
}