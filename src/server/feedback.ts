import { supabase } from '@/lib/supabase';

export interface FeedbackInput {
  sender_name?: string;  // Opsional
  sender_email?: string; // Opsional
  message: string;       // Wajib
}

/**
 * Menyimpan feedback baru ke database (Public)
 */
export async function createFeedback(payload: FeedbackInput) {
  // Karena kolom sender_name bernilai NOT NULL pada schema.sql,
  // jika pengirim tidak mengisi nama, otomatis diset menjadi 'Anonymous'.
  const senderName = payload.sender_name?.trim() || 'Anonymous';

  const { data, error } = await supabase
    .from('feedback')
    .insert([
      {
        sender_name: senderName,
        sender_email: payload.sender_email?.trim() || null,
        message: payload.message.trim(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Mengambil semua data feedback dari database (Admin)
 */
export async function getAllFeedbacks() {
  const { data, error } = await supabase
    .from('feedback')
    .select('id, sender_name, sender_email, message, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}