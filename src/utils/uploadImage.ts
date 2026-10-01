import { supabaseAdmin } from '@/lib/supabase';

/**
 * Validasi Keamanan: Mengecek MIME type file (hanya menerima image/jpeg, image/png, image/webp, image/jpg) dan membatasi ukuran maksimal file (2 MB).
 * Penamaan Unik: Secara otomatis mengubah nama file asli menjadi UUID acak menggunakan crypto.randomUUID() untuk menghindari bentrokan nama file (file collision) di dalam bucket Supabase.
 */
export async function uploadImage(file: File): Promise<string> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipe file tidak didukung. Harap unggah gambar (jpeg, png, webp, jpg).');
  }

  const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
  if (file.size > MAX_SIZE) {
    throw new Error('Ukuran file terlalu besar. Maksimal 2 MB.');
  }

  const fileExtension = file.name.split('.').pop() || 'png';
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;

  const { data, error } = await supabaseAdmin.storage
    .from('images') // Ganti dengan nama bucket yang sesuai jika berbeda
    .upload(fileName, file);

  if (error) {
    throw new Error(`Gagal mengunggah gambar: ${error.message}`);
  }

  // Mendapatkan public URL
  const { data: publicUrlData } = supabaseAdmin.storage
    .from('images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function deleteImage(fileName: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from('images')
    .remove([fileName]);

  if (error) {
    throw new Error(`Gagal menghapus gambar: ${error.message}`);
  }
}
