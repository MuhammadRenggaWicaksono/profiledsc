import { supabase } from "@/lib/supabase";

// ambil semua berita
export async function getAllNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// ambil detail berita berdasarkan slug (Tantangan Utama!)
export async function getNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

// tambah berita baru
export async function createNews(payload: {
  title: string;
  slug: string;
  content: string;
  cover_image_url?: string;
}) {
  const { data, error } = await supabase
    .from("news")
    .insert([payload])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// edit berita berdasar slug
export async function updateNewsBySlug(slug: string, payload: any) {
  const { data, error } = await supabase
    .from("news")
    .update(payload)
    .eq("slug", slug)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// hapus berita berdasar slug[cite: 1]
export async function deleteNewsBySlug(slug: string) {
  const { error } = await supabase
    .from("news")
    .delete()
    .eq("slug", slug);

  if (error) throw new Error(error.message);
  return true;
}