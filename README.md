# HydroTrack — Aplikasi Pencatatan dan Visualisasi Konsumsi Air Minum Harian

**HydroTrack** adalah aplikasi **Progressive Web App (PWA)** dan **RESTful API** terpadu untuk mencatat, memantau, dan memvisualisasikan konsumsi air minum harian dengan tema putih-biru yang menenangkan (*calming white & blue*).

Dibuat untuk memenuhi **Tugas Akhir Praktikum Pemrograman Perangkat Bergerak (PPB) Ganjil 2026**.

## Fitur Utama

1. **Dashboard Hidrasi Harian**:
   - Ring progres target hidrasi harian (`HydrationRing`).
   - Tombol tambah cepat (`+200 ml`, `+350 ml`, `+500 ml`).
   - Daftar konsumsi hari ini yang dapat diklik untuk membuka detail, edit, atau hapus.
2. **Riwayat & Visualisasi 7 Hari**:
   - Grafik batang konsumsi air 7 hari terakhir.
   - Pencarian dan filter kategori minuman, dengan setiap item dapat diklik menuju halaman detail (`LogDetail`).
3. **Catat Minuman (`LogDrinkPage`)**:
   - Form pencatatan konsumsi minuman lengkap dengan pilihan minuman, preset volume, mood, catatan, dan auto-save draft lokal.
4. **Katalog Minuman & Indeks Hidrasi (`BeveragesPage`)**:
   - Daftar minuman sehat dengan filter kategori & favorit.
   - Setiap item dapat diklik menuju `BeverageDetail` (manfaat, tips konsumsi, indeks hidrasi, dan tombol catat cepat).
5. **Profil & Tentang Aplikasi (`ProfileAboutPage`)**:
   - Kalkulator target air harian berdasarkan berat badan (`berat × 35 ml`).
   - Informasi aplikasi HydroTrack.
6. **PWA Offline-Ready**:
   - Mendukung `vite-plugin-pwa`, Web App Manifest, Service Worker caching, dan fallback penyimpanan `localStorage`.

## Struktur Proyek Terpadu

```text
tappb/
├── public/                 # Aset PWA (logo.svg, icon-192.png, icon-512.png)
├── server/                 # Backend Express.js + Supabase (MVC)
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
├── src/                    # Frontend React + Vite + Tailwind CSS
│   ├── components/
│   ├── config/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json            # Konfigurasi terpadu frontend & backend
├── supabase_schema.sql     # Skema database PostgreSQL Supabase
├── vercel.json             # Konfigurasi deployment Vercel (API + Static PWA)
└── vite.config.js          # Konfigurasi Vite + PWA
```

## Menjalankan Secara Lokal

1. Salin `.env.example` menjadi `.env` dan isi `SUPABASE_URL` serta `SUPABASE_ANON_KEY` (opsional untuk mode database cloud; tanpa `.env`, frontend otomatis berjalan penuh dengan fallback lokal).
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan backend API (port `3000`):
   ```bash
   npm run server
   ```
4. Jalankan frontend Vite PWA (port `5173`):
   ```bash
   npm run dev
   ```
5. Build produksi PWA:
   ```bash
   npm run build
   ```
