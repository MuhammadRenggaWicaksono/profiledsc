// ─── TypeScript Interfaces ───────────────────────────────────────────────────
import { supabaseAdmin } from '@/lib/supabase';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string; // TIMESTAMP WITH TIME ZONE
  location: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export type CreateEventInput = Omit<Event, 'id' | 'created_at'>;

// ─── Return type helper ────────────────────────────────────────────────────────

interface DALResult<T> {
  data: T | null;
  error: Error | null;
}

// ─── Data Access Layer ────────────────────────────────────────────────────────

/**
 * Mengambil semua events, diurutkan berdasarkan event_date terbaru (descending).
 */
export async function getAllEvents(): Promise<DALResult<Event[]>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) throw error;

    return { data: data as Event[], error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error in getAllEvents');
    return { data: null, error };
  }
}

/**
 * Mengambil satu event berdasarkan UUID-nya.
 */
export async function getEventById(id: string): Promise<DALResult<Event>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Event dengan id "${id}" tidak ditemukan.`);

    return { data: data as Event, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error in getEventById');
    return { data: null, error };
  }
}

/**
 * Menambah event baru ke Supabase.
 */
export async function createEvent(input: CreateEventInput): Promise<DALResult<Event>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .insert([input])
      .select()
      .single();

    if (error) throw error;

    return { data: data as Event, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error in createEvent');
    return { data: null, error };
  }
}
