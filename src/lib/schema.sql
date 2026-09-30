-- 1. Tabel Members (Struktur Anggota & Leaderboard)
-- Catatan: Fitur Leaderboard kita gabung di sini menggunakan kolom 'points'.
CREATE TABLE members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL, -- Jabatan
    photo_url TEXT, -- Link foto profil
    social_links JSONB, -- Menyimpan link IG, LinkedIn, dll dalam format JSON
    points INTEGER DEFAULT 0, -- Untuk keperluan fitur Leaderboard
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel News (Konten Berita)
CREATE TABLE news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- URL ramah SEO, UNIQUE agar tidak ada yang sama
    content TEXT NOT NULL,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Events (Roadmap/List Kegiatan)
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL, -- Tanggal dan waktu acara
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT true, -- Untuk menandai apakah pendaftaran/absen masih dibuka
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Attendance (Absensi)
CREATE TABLE attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE, -- Berelasi dengan tabel events[cite: 3]
    participant_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    institution VARCHAR(255), -- Asal kampus/instansi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Feedback (Kotak Masuk/Saran)
CREATE TABLE feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255),
    message TEXT NOT NULL, -- Isi kritik & saran[cite: 3]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);