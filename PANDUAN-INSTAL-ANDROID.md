# Kasirku untuk Android (APK)

File: `Kasirku.apk` (± 4 MB). Aplikasi ini ditandatangani dengan kunci *debug*, jadi dipasang langsung dari file (sideload), bukan lewat Play Store. Tidak ada masa berlaku 7 hari seperti di iPad.

## 1. Pasang APK
1. Kirim `Kasirku.apk` ke HP/tablet Android (WhatsApp ke diri sendiri, Google Drive, kabel USB, atau unduh dari halaman Releases GitHub).
2. Buka file tersebut dari aplikasi **File/Unduhan**.
3. Jika muncul "Demi keamanan, ponsel tidak diizinkan memasang aplikasi dari sumber ini", tekan **Setelan** lalu aktifkan **Izinkan dari sumber ini** (Install unknown apps) untuk aplikasi yang dipakai membuka file (Chrome / File Saya / WhatsApp).
4. Kembali, tekan **Instal**. Jika Play Protect bertanya, pilih **Tetap instal**.
5. Buka **Kasirku**. Pertama kali: buat akun pemilik. Masa percobaan 7 hari, setelah itu masukkan kunci lisensi `KSR1-...`.

## 2. Printer Bluetooth Xprinter XP-58IIZ
1. Nyalakan printer. Lakukan **pairing** dahulu di Setelan Android > Bluetooth (PIN biasanya `0000` atau `1234`).
2. Di Kasirku: **Pengaturan > Printer Bluetooth**, aktifkan, tekan **Pilih printer**.
3. Saat diminta izin **Perangkat di sekitar** (Nearby devices), pilih **Izinkan**. Android 11 ke bawah mungkin meminta izin **Lokasi**; ini aturan Android untuk memindai Bluetooth.
4. Pilih XP-58IIZ, lalu tekan **Tes cetak**. Lebar kertas 58 mm = 32 kolom.
5. Setelah itu tombol **Cetak struk** langsung mencetak ke printer. Jika gagal, aplikasi membuka dialog cetak sistem sebagai cadangan.

## 3. Backup otomatis
- Setiap hari, saat aplikasi dibuka, salinan data disimpan di dalam aplikasi (7 hari terakhir) dan dicoba ditulis ke folder **Documents/Kasirku** (maks. 14 file).
- Di sebagian Android baru, penulisan ke Documents dapat ditolak sistem. Jika folder tidak muncul, buka **Pengaturan > Backup otomatis > Unduh** dan simpan manual, atau pakai **Ekspor backup** secara berkala.
- **Menghapus aplikasi (uninstall) menghapus data.** Simpan backup di luar HP sebelum uninstall atau ganti perangkat.

## 4. Memperbarui aplikasi
Pasang APK versi baru di atas yang lama (tanpa uninstall) agar data tetap ada.

## 5. Masalah umum
| Masalah | Solusi |
|---|---|
| Tidak bisa memasang | Aktifkan "Install unknown apps" untuk aplikasi pembuka file |
| Printer tidak muncul | Pairing dulu di Setelan Bluetooth; izinkan "Perangkat di sekitar" |
| Cetak putus di tengah | Pilih mode **Aman** (potongan 20 byte) di Pengaturan > Printer |
| Struk terlalu lebar/sempit | Ubah kolom 32 / 48 |

## Catatan jujur
APK ini dibangun otomatis oleh GitHub Actions dan isinya sudah diperiksa, tetapi belum diuji di perangkat Android asli maupun printer XP-58IIZ asli. Lakukan tes cetak sebelum diserahkan ke pelanggan. Untuk distribusi Play Store diperlukan penandatanganan rilis (keystore) dan akun developer.
