-- 01_riwayat_izin_minimal.sql
-- SUDAH DITERAPKAN ke proyek pada 2 Nov 2026 (migrasi "riwayat_izin_minimal").
-- Menggantikan rencana awal 01_riwayat_hardening.sql, karena hasil audit menunjukkan RLS, tiga kebijakan,
-- aturan unik, dan batas ukuran data di tabel riwayat sudah benar. Yang kurang hanya izin akses yang terlalu lebar.
--
-- anon (tanpa login) tidak punya akses sama sekali; authenticated hanya boleh baca, tambah, dan hapus
-- (baris miliknya sendiri, dibatasi oleh kebijakan RLS).

revoke all on table public.riwayat from public, anon, authenticated;
grant select, insert, delete on table public.riwayat to authenticated;
grant select, insert, update, delete on table public.riwayat to service_role;
