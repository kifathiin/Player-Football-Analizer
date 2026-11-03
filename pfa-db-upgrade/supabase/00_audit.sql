-- 00_audit.sql
-- HANYA MEMBACA. Tidak mengubah apa pun. Aman dijalankan kapan saja.
-- Tujuan: melihat kondisi tabel riwayat sekarang (kolom, RLS, kebijakan, izin akses).
-- Cara pakai: buka Supabase > SQL Editor > New query > tempel semua > Run.
-- Hasilnya satu tabel dengan kolom "aspek" dan "detail".

select 'kolom' as aspek,
       column_name || ' | ' || data_type || coalesce(' | default ' || column_default, '') as detail
from information_schema.columns
where table_schema = 'public' and table_name = 'riwayat'

union all
select 'rls',
       'aktif=' || relrowsecurity::text || ', dipaksa=' || relforcerowsecurity::text
from pg_class
where oid = to_regclass('public.riwayat')

union all
select 'kebijakan (policy)',
       policyname || ' | ' || cmd || ' | role=' || roles::text
         || ' | using=' || coalesce(qual, '-') || ' | check=' || coalesce(with_check, '-')
from pg_policies
where schemaname = 'public' and tablename = 'riwayat'

union all
select 'izin akses (grant)',
       grantee || ' : ' || string_agg(privilege_type, ', ' order by privilege_type)
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'riwayat'
  and grantee in ('anon', 'authenticated', 'PUBLIC')
group by grantee

union all
select 'aturan (constraint)',
       conname || ' | ' || pg_get_constraintdef(oid)
from pg_constraint
where conrelid = to_regclass('public.riwayat')

union all
select 'tabel lain di schema public', table_name
from information_schema.tables
where table_schema = 'public' and table_name <> 'riwayat'

union all
select 'jumlah baris riwayat', count(*)::text
from public.riwayat

order by 1, 2;
