import { supabaseAdmin } from "@/lib/supabase";

// ─── Konfigurasi Global Bucket Supabase Storage ───────────────────────────────
const STORAGE_BUCKET = "images";

/**
 * Mengunggah file gambar ke Supabase Storage.
 *
 * Validasi Keamanan:
 * - Mengecek MIME type file (hanya menerima image/jpeg, image/png, image/webp, image/jpg)
 * - Membatasi ukuran maksimal file (2 MB)
 *
 * Penamaan Unik:
 * - Secara otomatis mengubah nama file asli menjadi UUID acak menggunakan
 *   crypto.randomUUID() untuk menghindari bentrokan nama file (file collision)
 *   di dalam bucket Supabase.
 *
 * @param file - File gambar yang akan diunggah
 * @returns Nama file baru yang telah di-generate (UUID-based filename)
 */
export async function uploadImage(file: File): Promise<string> {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format gambar tidak didukung. Gunakan jpeg, png, webp, atau jpg.");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran gambar maksimal 2 MB.");
  }

  const extension = file.name.split(".").pop() || "png";
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file);

  if (error) {
    throw new Error(`Gagal mengunggah gambar: ${error.message}`);
  }

  return fileName;
}

/**
 * Menghapus file gambar dari Supabase Storage.
 *
 * @param fileName - Nama file yang akan dihapus (UUID-based filename)
 */
export async function deleteImage(fileName: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([fileName]);

  if (error) {
    throw new Error(`Gagal menghapus gambar: ${error.message}`);
  }
}