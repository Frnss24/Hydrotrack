# Panduan Penjelasan Asistensi Tugas Akhir PPB 2026 - HydroTrack

## 1. Identitas Aplikasi

1. Nama Aplikasi: HydroTrack (Daily Hydration Tracker)
2. Jenis Aplikasi: Progressive Web App (PWA) dengan RESTful API
3. Fungsi Utama: Aplikasi pencatatan, pemantauan, dan visualisasi konsumsi air minum harian lengkap dengan indeks hidrasi per jenis minuman, jadwal pengingat, dan pelacakan streak pencapaian.
4. Repository GitHub: https://github.com/Frnss24/Hydrotrack.git

---

## 2. Pembuktian Ketentuan Tugas Akhir dan Lokasi File

### Ketentuan 1: Menggunakan Teknologi Praktikum (PWA Modul 5)
Aplikasi dibangun menggunakan React, Vite, Tailwind CSS, dan plugin PWA (`vite-plugin-pwa`).
Bukti pada file:
1. `package.json`: berisi dependensi `react`, `react-dom`, `axios`, `lucide-react`, `vite`, dan `vite-plugin-pwa`.
2. `vite.config.js`: konfigurasi Web App Manifest (nama aplikasi, tema warna biru putih, ikon 192x192 dan 512x512, `display: standalone`) serta Service Worker Workbox untuk caching offline.
3. `public/logo.svg`, `public/icon-192.png`, `public/icon-512.png`: aset ikon PWA untuk instalasi ke layar utama perangkat.
4. `src/components/PWABadge.jsx`: komponen untuk menampilkan tombol install aplikasi dan status koneksi offline.

### Ketentuan 2: Menggunakan API (Web Service) Buatan Sendiri Sesuai Modul 1
Backend dibuat sendiri menggunakan Node.js dan Express.js dengan pola arsitektur MVC (Model, Controller, Route) yang terhubung ke database cloud PostgreSQL di Neon.
Bukti pada file:
1. `server/index.js`: entry point Express API dengan middleware `cors()`, `express.json()`, dan routing utama `/api`.
2. `server/config/db.js`: konfigurasi koneksi Pool PostgreSQL (`pg`) ke Neon menggunakan `DATABASE_URL` dari `.env`.
3. `server/models/categoryModel.js`, `server/models/beverageModel.js`, `server/models/logModel.js`: berisi query SQL untuk operasi CRUD (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) ke tabel `beverage_categories`, `beverages`, dan `hydration_logs`.
4. `server/controllers/categoryController.js`, `server/controllers/beverageController.js`, `server/controllers/logController.js`: menangani request HTTP, validasi input, dan mengirim response JSON beserta status code (`200`, `201`, `400`, `404`, `500`).
5. `server/routes/categoryRoutes.js`, `server/routes/beverageRoutes.js`, `server/routes/logRoutes.js`: mendefinisikan endpoint REST API `/api/categories`, `/api/beverages`, dan `/api/logs`.
6. `src/config/api.js`, `src/services/logService.js`, `src/services/beverageService.js`: penghubung frontend dengan backend API menggunakan `axios`.

### Ketentuan 3: Memiliki Bottom Navigation Bar
Navigasi utama berada di bagian bawah layar agar nyaman digunakan seperti aplikasi mobile.
Bukti pada file:
1. `src/components/BottomNav.jsx`: menampilkan 6 tab navigasi utama yaitu Beranda, Riwayat, Jadwal, Capaian, Minuman, dan Profil.
2. `src/index.css`: mengatur posisi tetap di bawah layar (`.bottom-nav`) dan tata letak grid 6 kolom (`.bottom-nav-inner`).
3. `src/App.jsx`: menghubungkan state `activeTab` dengan `BottomNav`.

### Ketentuan 4: Memiliki Minimal 5 Halaman
Aplikasi memiliki 6 halaman utama dan 2 halaman detail (total 8 tampilan halaman).
Bukti pada file:
1. `src/pages/DashboardPage.jsx`: halaman Beranda berisi gelas air animasi, pemilih jenis minuman, tombol tambah cepat, input custom ml, tombol reset hari ini, ringkasan statistik, dan daftar catatan hari ini.
2. `src/pages/HistoryPage.jsx`: halaman Riwayat berisi grafik batang konsumsi 7 hari terakhir, pencarian, filter kategori, dan daftar seluruh catatan minum.
3. `src/pages/RemindersPage.jsx`: halaman Jadwal dan Pengingat berisi pengaturan jam bangun, jam tidur, interval pengingat, timeline jadwal minum otomatis, dan tombol tes notifikasi.
4. `src/pages/AchievementsPage.jsx`: halaman Capaian berisi perhitungan streak harian, pola waktu minum rutin, dan 6 badge pencapaian.
5. `src/pages/BeveragesPage.jsx`: halaman Minuman berisi katalog jenis minuman sehat dengan filter kategori dan favorit.
6. `src/pages/ProfileAboutPage.jsx`: halaman Profil dan Tentang Aplikasi.
7. `src/components/logs/LogDetail.jsx`: halaman detail untuk melihat, mengubah, dan menghapus catatan minum.
8. `src/components/beverages/BeverageDetail.jsx`: halaman detail untuk melihat informasi lengkap minuman dan mencatatnya langsung.

### Ketentuan 5: Minimal 2 Halaman Utama Memiliki List yang Setiap Itemnya Dapat Diklik ke Halaman Detail
Bukti pada file:
1. Halaman List Pertama: `src/pages/HistoryPage.jsx` menggunakan `src/components/logs/LogCard.jsx`. Saat item diklik (`onSelectLog`), `src/App.jsx` membuka halaman detail `src/components/logs/LogDetail.jsx`.
2. Halaman List Kedua: `src/pages/BeveragesPage.jsx` menggunakan `src/components/beverages/BeverageCard.jsx`. Saat item diklik (`onSelectBeverage`), `src/App.jsx` membuka halaman detail `src/components/beverages/BeverageDetail.jsx`.
3. Halaman List Tambahan: daftar catatan hari ini di `src/pages/DashboardPage.jsx` juga menggunakan `LogCard` dan dapat diklik menuju `LogDetail.jsx`.

### Ketentuan 6: Memiliki 1 Halaman Profile atau About Aplikasi
Bukti pada file:
1. `src/pages/ProfileAboutPage.jsx`: menyediakan form pengaturan nama pengguna, berat badan, kalkulator target hidrasi harian (`berat badan x 35 ml`), bio, serta bagian Tentang Aplikasi HydroTrack (deskripsi, fitur utama, dan versi aplikasi).

### Ketentuan 7: Source Code Diunggah ke GitHub dan PWA Di-deploy ke Free Hosting
Bukti pada file:
1. Repository GitHub: https://github.com/Frnss24/Hydrotrack.git
2. `vercel.json`: konfigurasi routing untuk deployment ke Vercel agar `/api/(.*)` diarahkan ke `server/index.js` dan halaman frontend diarahkan ke hasil build statis `dist/`.

---

## 3. Penjelasan Cara Kerja Fitur Utama (Jika Ditanya Asisten)

1. Identifikasi Pengguna Tanpa Login (UUID Perangkat):
   Pada `src/services/userService.js`, saat aplikasi pertama kali dibuka, fungsi `getUserIdentifier()` membuat 1 UUID unik menggunakan `crypto.randomUUID()` dan menyimpannya di `localStorage`. Setiap permintaan `GET /api/logs` dan `POST /api/logs` mengirim UUID tersebut agar data di tabel `hydration_logs` Neon terpisah per perangkat.

2. Perhitungan Indeks Hidrasi dan Gelas Air Animasi:
   Pada `src/utils/helpers.js`, fungsi `getHydrationIndex()` dan `getEffectiveHydrationMl()` menghitung efektivitas hidrasi tiap jenis minuman (misalnya Air Putih 100 persen, Air Kelapa 108 persen, Susu 115 persen, Teh Hijau 92 persen, Kopi 80 persen). Hasil hidrasi efektif ditampilkan pada gelas air animasi di `src/components/common/HydrationRing.jsx` yang menampilkan animasi aliran air, percikan, dan gelembung setiap kali volume air bertambah.

3. Mekanisme Offline dan Sinkronisasi ke Database:
   Pada `src/services/logService.js`, data catatan dari Neon disimpan sebagai cache di `localStorage` per `user_identifier`. Jika user mencatat minum saat koneksi terputus, data disimpan sementara dengan tanda `pendingSync: true`. Saat koneksi internet kembali (`online` event pada `src/hooks/useReminderNotifications.js`), fungsi `syncPendingLogs()` otomatis mengirim catatan tertunda ke `POST /api/logs` di Neon.

4. Sistem Jadwal dan Notifikasi PWA:
   Pada `src/utils/reminderSchedule.js` dan `src/hooks/useReminderNotifications.js`, jadwal minum dihitung otomatis dari jam bangun sampai jam tidur sesuai interval yang dipilih. Pengecekan berjalan secara global di `src/App.jsx` dan mengirim notifikasi melalui Service Worker (`registration.showNotification`) maupun Notification API browser.
