# Memasang Kasirku sebagai Aplikasi di iPad (tanpa Mac)

Aplikasi iPad harus berbentuk file **.ipa**. File itu hanya bisa dibuat di komputer Apple, jadi kita pakai **GitHub** (menyewakan Mac di internet, gratis) untuk membuatnya. Lalu **Sideloadly** di PC Windows memasangnya ke iPad.

Hasil: ikon **Kasirku** di layar iPad, terbuka layar penuh, dengan Bluetooth ke printer XP-58IIZ.

> **Batas penting:** dengan Apple ID gratis, aplikasi **hanya hidup 7 hari**. Setelah itu harus dipasang ulang dengan Sideloadly (data tetap ada bila memakai Apple ID yang sama, tetapi **cadangkan dulu** lewat Atur > Cadangkan). Maksimal 3 aplikasi sideload per Apple ID gratis. Untuk toko yang dipakai terus, pertimbangkan Apple Developer Program (berbayar per tahun), yang membuat aplikasi bertahan lama lewat TestFlight.

## Bagian 1. Membuat file Kasirku.ipa (sekali, sekitar 20 menit)

1. Buat akun di **github.com** (gratis).
2. Klik **+ > New repository**. Nama: `kasirku-app`. Pilih **Public** (build gratis untuk repository publik; isinya hanya program, tanpa data toko dan tanpa kunci rahasia lisensi). Klik **Create repository**.
3. Unggah file dari zip ini:
   - Klik **uploading an existing file**. Seret `setup.mjs`, `capacitor.config.json`, `.gitignore`, dan seluruh folder `src`. Klik **Commit changes**.
4. Buat berkas pembangun (folder tersembunyi, jadi dibuat dengan cara ini):
   - Klik **Add file > Create new file**.
   - Di kolom nama ketik persis: `.github/workflows/build-ios.yml` (tiap tanda `/` membuat folder).
   - Buka `build-ios.yml` dari zip dengan Notepad, salin semua isinya, tempel ke kotak besar, lalu klik **Commit changes**.
5. Buka tab **Actions**. Pilih **Bangun aplikasi iPad (IPA)** di kiri, lalu **Run workflow > Run workflow** (biarkan pilihan `spm`).
6. Tunggu 10 sampai 25 menit sampai muncul tanda centang hijau.
7. Klik proses yang selesai tadi. Di bagian bawah, **Artifacts**, klik **Kasirku-IPA** untuk mengunduh. Ekstrak zip-nya, di dalamnya ada **Kasirku.ipa**.

Kalau muncul tanda silang merah: klik proses itu, buka langkah yang gagal, salin pesan errornya dan kirim ke saya. Sebelumnya coba ulang sekali dengan pilihan **cocoapods** di langkah 5.

## Bagian 2. Memasang ke iPad dari Windows

1. Pasang **iTunes** dan **iCloud** versi dari situs Apple, **bukan** dari Microsoft Store (syarat Sideloadly di Windows). Mulai ulang PC.
2. Unduh **Sideloadly** dari sideloadly.io dan pasang.
3. Di iPad: **Pengaturan > Privasi & Keamanan > Mode Pengembang** (Developer Mode) hidupkan, lalu iPad restart dan konfirmasi.
4. Colok iPad ke PC dengan kabel. Di iPad ketuk **Percayai**.
5. Buka Sideloadly. Pilih iPad Anda, seret **Kasirku.ipa** ke jendelanya, isi **Apple ID**, tekan **Start**, dan isi kata sandi bila diminta. Sebaiknya pakai Apple ID khusus untuk ini, karena Sideloadly adalah alat pihak ketiga yang memakai akun Anda untuk menandatangani aplikasi.
6. Di iPad: **Pengaturan > Umum > VPN & Manajemen Perangkat**, ketuk email Apple ID Anda, lalu **Percayai**.
7. Buka **Kasirku** dari layar utama. Buat akun pemilik dan masukkan kunci lisensi.

Agar tidak harus mengulang tiap minggu: aktifkan opsi auto-refresh di Sideloadly dan biarkan iPad tersambung (USB atau Wi-Fi sideloading) ke PC yang menjalankan Sideloadly. Kalau terlewat, pasang ulang dengan langkah 5.

## Setelah terpasang
- Cetak Bluetooth: ikuti `PANDUAN-PRINTER-BLUETOOTH.md`. Di aplikasi ini Bluetooth iPad berfungsi, berbeda dari Safari.
- Data aplikasi terpisah dari data di Safari. Untuk pindah: Atur > Cadangkan di versi lama, Pulihkan di aplikasi ini.
- Memperbarui aplikasi: ganti isi `src/index.html` di GitHub, jalankan lagi Bagian 1 langkah 5 sampai 7, lalu pasang ulang IPA baru dengan Sideloadly (Bagian 2 langkah 5). Data tetap.

## Kalau punya Mac
Jalankan `node setup.mjs ios` lalu `npx cap open ios`, atur Team (Apple ID), lalu Run. Detailnya di `PANDUAN-APP-NATIVE.md`.

## Status pengujian (jujur)
Skrip build dan alur Bluetooth sudah diuji sebatas yang mungkin di komputer saya (tanpa Mac). **Proses build di GitHub dan pemasangan Sideloadly belum pernah saya jalankan**, jadi kemungkinan ada error di percobaan pertama. Kirim pesan error-nya ke saya dan saya perbaiki.
