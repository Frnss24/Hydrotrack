---
description: Larangan commit dan push file SQL ke GitHub
---

# Aturan Keamanan Repository (HydroTrack)

- **DILARANG** melakukan `git add`, `git commit`, atau `git push` untuk segala file berekstensi `.sql` (termasuk `neon_schema.sql` dan skema database lainnya) maupun file `.env`.
- Pastikan `*.sql` dan `.env` selalu terdaftar di `.gitignore`.
- Jika ingin menjalankan atau memperbarui skema database, jalankan langsung ke database Neon secara lokal tanpa melacak file `.sql` di Git.
