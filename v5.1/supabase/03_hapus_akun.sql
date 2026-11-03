-- SUDAH DITERAPKAN ke proyek pada 2 Nov 2026 (migrasi "buat_fungsi_hapus_akun").
-- 03_hapus_akun.sql
-- Fungsi database yang dipanggil tombol "Hapus akun saya" di halaman Akun.
-- Fungsi ini HANYA bisa menghapus akun milik pemanggilnya sendiri (auth.uid()), tidak ada parameter
-- yang bisa diisi orang lain. Jalankan SETELAH 01 dan 02.

begin;

create or replace function public.hapus_akun()
returns void
language plpgsql
security definer          -- berjalan dengan hak pembuat fungsi, agar boleh menghapus dari auth.users
set search_path = ''      -- mencegah pembajakan lewat schema lain
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Harus masuk dulu.' using errcode = '28000';
  end if;
  delete from public.riwayat         where user_id = uid;
  delete from public.rencana_latihan where user_id = uid;
  delete from auth.users             where id = uid;
end $$;

-- Hanya pengguna yang sudah masuk yang boleh memanggil.
revoke all on function public.hapus_akun() from public, anon;
grant execute on function public.hapus_akun() to authenticated;

commit;
