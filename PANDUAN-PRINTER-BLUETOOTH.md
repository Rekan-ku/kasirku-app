# Cetak Langsung ke Printer Bluetooth (Xprinter XP-58IIZ)

Tombol **Cetak struk** bisa langsung mengirim struk ke printer thermal 58 mm lewat Bluetooth, tanpa dialog cetak. Aplikasi memakai perintah ESC/POS (yang didukung XP-58IIZ) lewat Bluetooth Low Energy (BLE).

## 1. Dulu cek: perangkat Anda bisa atau tidak?

| Perangkat | Bisa cetak Bluetooth langsung? |
|---|---|
| **Android**, Chrome (alamat web / PWA) | Ya. |
| **Android**, aplikasi Kasirku (APK) | Ya. |
| **iPad/iPhone**, Safari atau ikon Layar Utama | **Tidak.** Apple tidak menyediakan Bluetooth untuk situs web di Safari. Cetak tetap lewat AirPrint. |
| **iPad/iPhone**, browser **Bluefy** (gratis di App Store) | Ya, untuk alamat web **HTTPS** (mis. GitHub Pages). |
| **iPad/iPhone**, aplikasi Kasirku native | Ya, tetapi membangunnya butuh Mac (lihat `PANDUAN-APP-NATIVE.md`). |
| Laptop/PC, Chrome atau Edge | Ya. |

Pilihan paling mudah bagi pengguna iPad tanpa Mac: **Bluefy**. Data di Bluefy terpisah dari data di Safari, jadi pindahkan lewat *Atur > Cadangkan* lalu *Pulihkan*. Bluefy belum saya uji, termasuk apakah datanya aman jangka panjang di sana, jadi rutin buat cadangan. Alternatif tanpa risiko itu: tablet Android dengan Chrome.

## 2. Menghubungkan printer (sekali saja per perangkat)

1. Isi kertas dan nyalakan printer. Letakkan dekat perangkat.
2. **Jangan** memasangkannya di Pengaturan Bluetooth perangkat. Aplikasi menyambung langsung.
3. Di Kasirku: **Atur > Printer Bluetooth > Cari dan hubungkan printer**.
4. Pilih printer di daftar (namanya biasanya mirip `XP-58`, atau tampil sebagai kode). Android akan meminta izin "Perangkat di sekitar".
5. Tekan **Tes cetak**. Hasil yang benar: nama toko, garis `1234567890...` selebar 32 karakter, dan "Tes printer berhasil".
6. Selesai. Mulai sekarang tombol **Cetak struk** langsung mencetak. Bila printer mati atau gagal, dialog cetak biasa terbuka sebagai cadangan.

Printer mengingat satu perangkat iOS sekaligus. Bila tersambung ke iPad lain, putuskan dulu di sana.

## 3. Pengaturan di panel (tersimpan di perangkat itu saja)

- **Cetak langsung lewat Bluetooth**: Ya/Tidak. Pilih Tidak bila ingin kembali ke dialog cetak.
- **Lebar kertas printer**: 58 mm (32 karakter) untuk XP-58IIZ.
- **Cetak logo**: logo dari Atur > Toko dan struk dicetak hitam-putih di atas struk. Logo membuat cetak lebih lambat. Matikan bila tidak perlu.
- **Kecepatan kirim**: Aman (potongan kecil, paling cocok dengan banyak printer) atau Cepat (bila cetak terasa lambat dan hasilnya tetap benar).
- **Baris kosong di akhir struk**: supaya struk bisa disobek di luar pelat printer (bawaan 4).

## 4. Bila bermasalah

| Gejala | Coba |
|---|---|
| Printer tidak muncul di daftar | Nyalakan ulang printer, putuskan dari perangkat lain, dekatkan. Di Android, aktifkan Bluetooth dan beri izin "Perangkat di sekitar". |
| Muncul "tidak punya jalur cetak yang dikenal" | Buka **Info teknis** di panel printer, salin isinya, dan kirim ke pembuat aplikasi. |
| Tersambung tapi tidak ada yang tercetak | Pastikan kertas terpasang dan tutup rapat. Coba Kecepatan **Aman**. |
| Huruf acak | Pastikan modelnya mendukung ESC/POS dan lebar kertas di panel benar. |
| Gagal sesekali | Dekatkan printer, pastikan baterai/adaptor cukup. |
| Cetak lambat | Matikan Cetak logo, atau coba Kecepatan **Cepat**. |

## 5. Status pengujian (jujur)

Alur sudah diuji di browser dengan printer Bluetooth tiruan: byte ESC/POS, lebar 32 kolom, logo, sambung ulang, dan cadangan ke dialog cetak. **Belum diuji dengan printer XP-58IIZ yang asli**, karena saya tidak punya perangkatnya. Karena itu ada tombol Tes cetak dan Info teknis. Kalau hasil pertama tidak benar, kirim fotonya atau isi Info teknis dan saya sesuaikan.
