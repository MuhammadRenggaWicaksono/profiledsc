# DSC Profile Website - Backend & Frontend Monorepo

Ini adalah repositori untuk website profil Developer Student Club (DSC). Proyek ini dibangun menggunakan **Next.js (App Router)** sebagai *framework full-stack* dan **Supabase** (PostgreSQL) sebagai sistem manajemen *database*.

## 🛠️ Teknologi yang Digunakan

* **Framework:** Next.js 14+ (App Router)
* **Bahasa:** TypeScript
* **Database & Auth:** Supabase
* **Styling:** Tailwind CSS (Opsional/Sesuai konfigurasi)
* **API Testing:** Thunder Client / Postman

---

## ⚙️ Persyaratan Sistem

Sebelum memulai, pastikan komputer Anda sudah terinstal:

* [Node.js](https://www.google.com/search?q=https://nodejs.org/&utm_source=gemini) (Versi 18 atau lebih baru)
* [Git](https://www.google.com/search?q=https://git-scm.com/&utm_source=gemini)
* Akun [Supabase](https://www.google.com/search?q=https://supabase.com/&utm_source=gemini) (Untuk *setup database* lokal/proyek)

---

## 🚀 Cara Instalasi & Menjalankan Proyek Secara Lokal

Karena alasan keamanan, folder `node_modules` dan file konfigurasi rahasia (`.env`) **tidak ikut diunggah** ke GitHub. Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer Anda:

### 1. Clone Repositori

Buka terminal dan jalankan perintah berikut untuk mengunduh kode sumber:

```bash
git clone https://github.com/username-anda/nama-repo-anda.git
cd nama-repo-anda

```

### 2. Install Dependencies

Unduh semua *library* pendukung yang dibutuhkan proyek ini:

```bash
npm install

```

### 3. Konfigurasi Environment Variables (SANGAT PENTING)

Buat file baru bernama `.env` di folder paling luar (*root directory*) proyek. Jangan menamai file ini selain `.env` agar tidak tidak sengaja ter-upload ke GitHub.

*Copy* format di bawah ini dan isi nilainya sesuai dengan kredensial Supabase dari *dashboard* proyek Anda:

```env
# URL dan Kunci Publik Supabase (Untuk Read-Only/Frontend)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=masukkan-anon-key-disini

# Kunci Rahasia Admin Supabase (Hanya untuk Server/Backend)
SUPABASE_SERVICE_ROLE_KEY=masukkan-service-role-key-disini

# Kunci Kustom untuk Mengamankan API POST/PUT/DELETE
API_SECRET_KEY=super-rahasia-dsc-123!

```

### 4. Jalankan Development Server

Setelah *dependencies* dan file `.env` siap, jalankan aplikasi:

```bash
npm run dev

```

Buka `http://localhost:3000` di *browser* Anda untuk melihat hasilnya.

---

## 📂 Struktur Direktori Utama

* `src/app/` : Berisi halaman antarmuka (Frontend).
* `src/app/api/` : Berisi semua *endpoint* API (Backend). Memiliki struktur *routing* untuk `members`, `news`, `events`, `attendance`, `leaderboard`, dan `feedback`.
* `src/lib/` : Berisi inisialisasi koneksi pihak ketiga (contoh: *client* Supabase).
* `src/server/` : Berisi logika manipulasi database spesifik (*query* ke Supabase) agar file *routing* API tetap bersih.
* `src/middleware.ts` : "Satpam" keamanan API yang memastikan operasi non-GET harus menyertakan token otorisasi.

---

## 🔒 Catatan Keamanan API untuk Tim Backend/Frontend

Proyek ini menggunakan perlindungan **Middleware**.
Setiap kali Anda melakukan *request* ke API untuk mengubah data (seperti `POST`, `PUT`, atau `DELETE`), Anda **wajib** menyertakan *header* otorisasi.

**Format Header yang dibutuhkan:**

* **Key:** `Authorization`
* **Value:** `Bearer [API_SECRET_KEY]` *(Ganti dengan nilai yang ada di `.env` Anda)*

Jika *header* ini tidak disertakan, server akan otomatis merespons dengan status `401 Unauthorized`. Request `GET` (mengambil data) tidak memerlukan *header* ini.