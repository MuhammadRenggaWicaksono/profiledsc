import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export async function uploadImage(file: File) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  const MAX_SIZE = 2 * 1024 * 1024 //2 MB ngab

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format gambar tidak didukung");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran gambar maksimal 2 MB!")
  }

  const extension = file.name.split(".").pop();

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from("members")
    .upload(fileName, file);

  console.log(error)
  if (error) {
    throw new Error(error.message);
  }

  return fileName;
}

export async function deleteImage(fileName: string) {
    const { error } = await supabaseAdmin.storage
        .from("members")
        .remove([fileName]);

    if (error) {
        throw new Error(error.message);
    }
}