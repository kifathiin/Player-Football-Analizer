-- SUDAH DITERAPKAN ke proyek pada 2 Nov 2026 (migrasi "buat_tabel_rencana_latihan").
-- 02_rencana_latihan.sql
-- Tabel baru agar rencana latihan tersimpan di akun (satu baris per pengguna).
-- Aman dijalankan berulang.

begin;

create table if not exists public.rencana_latihan (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  constraint rencana_latihan_ukuran check (pg_column_size(data) <= 20000)
);

-- Isi updated_at otomatis setiap baris diubah.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end $$;
revoke all on function public.set_updated_at() from public, anon, authenticated;

drop trigger if exists rencana_latihan_updated_at on public.rencana_latihan;
create trigger rencana_latihan_updated_at
  before update on public.rencana_latihan
  for each row execute function public.set_updated_at();

-- Row Level Security: hanya pemilik yang bisa mengakses barisnya.
alter table public.rencana_latihan enable row level security;

drop policy if exists "rencana_lihat_milik_sendiri"  on public.rencana_latihan;
drop policy if exists "rencana_tambah_milik_sendiri" on public.rencana_latihan;
drop policy if exists "rencana_ubah_milik_sendiri"   on public.rencana_latihan;
drop policy if exists "rencana_hapus_milik_sendiri"  on public.rencana_latihan;

create policy "rencana_lihat_milik_sendiri" on public.rencana_latihan
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "rencana_tambah_milik_sendiri" on public.rencana_latihan
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "rencana_ubah_milik_sendiri" on public.rencana_latihan
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "rencana_hapus_milik_sendiri" on public.rencana_latihan
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Izin akses eksplisit; anon tidak mendapat akses.
revoke all on table public.rencana_latihan from public, anon, authenticated;
grant select, insert, update, delete on table public.rencana_latihan to authenticated;
grant select, insert, update, delete on table public.rencana_latihan to service_role;

commit;
