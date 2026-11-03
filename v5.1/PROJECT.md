# Player Football Analyzer: Catatan Proyek

Tempel file ini di awal setiap sesi dengan Claude maupun ChatGPT.
Perbarui bagian "Status" dan "Daftar tugas" setiap selesai satu pekerjaan.

## Tentang proyek
- Website analisis peran pemain sepak bola. Pengguna menilai 15 atribut dan menjawab 10 pertanyaan kebiasaan, lalu mendapat peran, posisi, role model, dan rencana latihan.
- Situs: https://kifathiin.github.io/Player-Football-Analizer/v5.0/
- Teknologi: HTML, CSS, JavaScript biasa (tanpa framework, tanpa library). Hosting GitHub Pages. Akun dan penyimpanan hasil memakai Supabase lewat `fetch`.
- Bahasa antarmuka: Indonesia. Gaya penulisan teks: ringkas, tanpa tanda pisah panjang.

## Pembagian peran
| Siapa | Tugas |
|---|---|
| Claude | Menulis kode, perintah (Git, Supabase), dan langkah-langkah perubahan |
| ChatGPT | Membuat gambar dan aset visual, serta menyaring apa yang tidak cocok atau kurang |
| Pemilik proyek | Memasang file, commit ke GitHub, menguji di browser, menjadi penghubung keduanya |

## Struktur file
```
index.html     kerangka halaman, memuat semua script
style.css      semua gaya tampilan
config.js      alamat dan kunci PUBLIK Supabase (jangan pernah isi kunci secret)
js/
  data.js      daftar atribut, pertanyaan, tips, dan peran    (data saja, tanpa logika)
  core.js      fungsi bantu $ dan esc, state S, penyimpanan jawaban
  ui.js        progress bar, toast, efek muncul
  form.js      halaman Analisis (3 langkah)
  engine.js    compute(): perhitungan peran dan posisi
  result.js    halaman Hasil: radar, ringkasan, ringkasan personal
  auth.js      akun Supabase: konfigurasi, API, masuk, daftar
  history.js   riwayat: simpan, bandingkan, ekspor dan impor
  plan.js      halaman Latihan: rencana, catatan sesi, target mingguan, sinkron ke akun
  router.js    navigasi antar halaman (#/analisis, #/hasil, dst.)
  main.js      titik mulai aplikasi
supabase/
  00_audit.sql            hanya membaca: kondisi tabel riwayat (aman dijalankan kapan saja)
  01_riwayat_izin_minimal.sql  izin akses minimal untuk riwayat (RLS dan kebijakannya sudah benar sejak awal)
  02_rencana_latihan.sql  tabel baru rencana_latihan (satu baris per pengguna)
  03_hapus_akun.sql       fungsi hapus_akun() untuk tombol Hapus akun
```

## Aturan penting (supaya tidak ada yang rusak)
1. **Urutan `<script>` di `index.html` tidak boleh diubah.** Semua file berbagi satu ruang nama global, dan file di bawah memakai fungsi dari file di atas. Urutan sekarang: data, core, ui, form, engine, result, auth, history, plan, router, main.
2. **Satu sesi AI, satu atau dua file.** Saat meminta perubahan, kirim hanya file yang relevan, bukan seluruh proyek.
3. **Data peran dan pertanyaan hanya diubah di `data.js`.** Logika hitung hanya di `engine.js`.
4. Semua teks dari pengguna yang masuk ke `innerHTML` harus lewat `esc()`.
5. Tidak ada library eksternal tanpa persetujuan pemilik proyek.
6. Gambar: SVG untuk ikon dan ilustrasi garis, WebP untuk foto atau gambar rumit. Letakkan di `assets/img/`, ukuran di bawah 200 KB per file. Jangan memakai wajah atau logo pemain dan klub nyata. Palet: hijau `#19e36b`, volt `#d9ff3d`, putih `#f5f7f6`, latar hitam `#000`.
7. **Aturan database.** Semua perubahan database ditulis sebagai file SQL bernomor di `supabase/` dan disimpan di repo, tidak diketik manual tanpa catatan. Setiap tabel baru wajib: RLS aktif, kebijakan per pemilik (`(select auth.uid()) = user_id`), dan `GRANT` eksplisit hanya ke `authenticated` (Supabase mewajibkan grant eksplisit untuk semua proyek mulai 30 Okt 2026). Kolom `user_id` diisi default `auth.uid()`. Jangan pernah memakai kunci secret atau service_role di kode website.

## Cara memperbarui website
1. Salin file hasil dari Claude ke folder repo (timpa file lama).
2. Uji di komputer: buka `index.html` lewat server lokal (mis. ekstensi Live Server), jangan klik dua kali, karena fitur akun butuh `http`.
3. Commit dan push ke GitHub. Tunggu 1 sampai 2 menit sampai Pages terbarui.
4. Jika tampilan tidak berubah, muat ulang paksa (Ctrl+Shift+R) karena cache browser.

## Catatan keamanan
- Peringatan Security Advisor `authenticated_security_definer_function_executable` untuk `hapus_akun()` disengaja: fungsi itu memang dipanggil pengguna yang sudah masuk dan hanya menghapus akun pemanggilnya sendiri (`auth.uid()`). Jangan dicabut izinnya.

## Status
- Versi: 5.0, struktur sudah modular.
- Sudah ada: analisis 15 atribut dan 10 pertanyaan, 14 peran dan 75 role model, akun Supabase, riwayat dan perbandingan, ekspor dan impor, rencana latihan, sinkron rencana ke akun dan hapus akun (SQL 01 sampai 03 sudah diterapkan ke Supabase pada 2 Nov 2026; kode di `js/` perlu terpasang di situs).

## Daftar tugas (urut prioritas)
- [x] SQL Supabase 01 sampai 03 diterapkan dan diverifikasi (izin minimal, pengguna lain melihat 0 baris, anon ditolak).
- [ ] Pasang kode terbaru (`pfa-db-upgrade.zip`: plan.js, auth.js, main.js, router.js) ke situs, lalu uji: masuk, riwayat, rencana latihan, hapus akun dengan akun percobaan.
- [ ] Aktifkan Leaked Password Protection di dashboard Supabase (Authentication), bila tersedia di paket.
- [x] Fitur hapus akun dan sinkron rencana latihan (kode siap).
- [ ] Rapikan Beranda: pindahkan "Kondisi versi 3.2" dan "Saran pengembangan" ke halaman Changelog, samakan nomor versi.
- [ ] Tes otomatis untuk `compute()` di `engine.js`.
- [ ] Aksesibilitas: kontras teks abu, fokus keyboard, meta Open Graph, favicon.
- [ ] Tampilan hasil yang lebih profesional (gaya laporan scouting) dan kartu hasil yang bisa dibagikan sebagai gambar.
- [ ] Modul belajar dan visual data terbuka StatsBomb.
- [ ] Mode penilaian oleh pelatih (v6.0). Penjelasan AI lewat backend kecil (v7.0).

## Template permintaan
**Ke Claude:** "Konteks: [tempel PROJECT.md]. Tugas: [satu fitur]. File yang relevan: [tempel file]. Beri kode lengkap file yang berubah, langkah pasang, dan cara mengujinya."

**Ke ChatGPT (penyaring):** "Ini screenshot/isi file website saya. Nilai dari sisi profesionalitas tampilan, keterbacaan di HP, dan konsistensi gaya. Beri daftar masalah berurutan dari yang terpenting, tanpa menulis ulang kodenya."

**Ke ChatGPT (gambar):** "Buat [aset] untuk website analisis sepak bola. Gaya: garis tipis geometris, palet hijau #19e36b, volt #d9ff3d, putih, latar hitam. Tanpa teks, tanpa wajah atau logo nyata. Format [SVG/WebP], ukuran [..]."
