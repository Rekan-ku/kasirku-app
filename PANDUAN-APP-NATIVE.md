# Kasirku – Aplikasi Android & iOS

Ini versi **mandiri** (data tersimpan di perangkat, tanpa server) yang dibungkus menjadi aplikasi sungguhan memakai Capacitor.
Isi folder: `src/` (aplikasi), `setup.mjs` (menyiapkan semuanya), `capacitor.config.json`.

## Pilih cara pasang

| Kebutuhan | Cara | Butuh |
|---|---|---|
| Cepat, tanpa build | **PWA**: Android Chrome > menu ⋮ > *Instal aplikasi*; iPad Safari > Bagikan > *Tambah ke Layar Utama* | alamat web (lihat panduan hosting) |
| File APK sendiri untuk HP/tablet Android toko | **Bagian A** di bawah | PC Windows/Mac + Android Studio |
| Aplikasi iPhone/iPad | **Bagian B** di bawah | **Mac** + Xcode + Apple ID |

Kelebihan aplikasi native dibanding PWA: ikon dan layar penuh sungguhan, dan di iOS data tidak terkena pembersihan otomatis Safari untuk situs yang lama tidak dibuka.

**Tidak punya Mac, ingin aplikasi di iPad?** Pakai `PANDUAN-INSTAL-IPAD.md` (build otomatis di GitHub, pasang dari PC Windows).

## Persiapan umum (sekali saja)
1. Pasang **Node.js LTS** dari nodejs.org.
2. Ekstrak zip ini, buka terminal (Windows: Command Prompt) di foldernya.

## A. Android (APK)
1. Pasang **Android Studio** (developer.android.com/studio). Buka sekali, biarkan mengunduh SDK.
2. Jalankan: `node setup.mjs android`
3. Jalankan: `npx cap open android`. Android Studio terbuka, tunggu "Gradle sync" selesai.
4. Menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**. Klik *locate* saat muncul.
   Hasil: `android/app/build/outputs/apk/debug/app-debug.apk`
5. Kirim APK ke perangkat (kabel, Drive, WhatsApp), buka, izinkan "pasang dari sumber ini".
   Alternatif: sambungkan perangkat (USB debugging aktif) lalu tekan tombol ▶ Run.

Cetak: tombol **Cetak struk** membuka dialog cetak Android. Pilih printer Wi-Fi Anda (butuh layanan cetak bawaan atau Mopria aktif di Pengaturan > Cetak).

Ke Google Play (opsional): daftar akun developer (biaya sekali bayar), lalu buat *Signed Bundle (AAB)* dari menu Build. APK debug di atas cukup untuk dipakai sendiri.

## B. iOS (di Mac)
1. Pasang **Xcode** dari App Store, buka sekali dan setujui lisensinya.
2. Pasang CocoaPods bila diminta: `sudo gem install cocoapods` (atau `brew install cocoapods`).
3. Jalankan: `node setup.mjs ios`
4. Jalankan: `npx cap open ios`. Di Xcode: pilih target **App** > *Signing & Capabilities* > centang *Automatically manage signing* > pilih **Team** (Apple ID Anda).
5. Sambungkan iPad/iPhone, pilih sebagai tujuan, tekan ▶ Run. Di perangkat: Pengaturan > Umum > VPN & Manajemen Perangkat > percayai developer Anda.

Biaya dan batas:
- Apple ID gratis: aplikasi **kedaluwarsa tiap 7 hari** dan harus dipasang ulang dari Xcode.
- Apple Developer Program (berbayar per tahun): aplikasi bertahan lama, bisa lewat TestFlight atau App Store.

Cetak: tombol **Cetak struk** membuka dialog AirPrint.

## Cetak Bluetooth (Xprinter XP-58IIZ)
Aplikasi native memakai Bluetooth langsung, jadi **di iPad pun bisa** (berbeda dari Safari). `setup.mjs` otomatis memasang plugin Bluetooth, izin di Android (`AndroidManifest.xml`) dan izin di iOS (`Info.plist`). Cara menghubungkan printer dan mengatasi masalah ada di `PANDUAN-PRINTER-BLUETOOTH.md`.
- Android 12 ke atas meminta izin "Perangkat di sekitar" saat pertama mencari printer.
- iOS meminta izin Bluetooth saat pertama mencari printer. Izinkan.
- Saat `node setup.mjs` dijalankan, ada langkah bundel Bluetooth (`esbuild`). Kalau langkah itu error, kirim pesannya ke saya.

## Penting
- Penjelasan front end, back end, dan database ada di `ARSITEKTUR.md`.
- **Data aplikasi native terpisah** dari data di Safari/Chrome (PWA). Untuk pindah: di versi lama *Atur > Cadangkan*, lalu di aplikasi baru *Atur > Pulihkan*.
- Lisensi: masukkan kunci lagi di aplikasi baru. Masa percobaan 7 hari dihitung dari pertama aplikasi dibuka.
- Setiap kali `src/index.html` diubah, jalankan lagi `node setup.mjs <android|ios>`.
- Ekspor stok/cadangan memunculkan lembar *Bagikan*: pilih "Simpan ke File" (iOS) atau Drive/File (Android).
- Ikon aplikasi masih bawaan Capacitor. Untuk ikon sendiri: siapkan `assets/icon-only.png` (1024 px) lalu `npx @capacitor/assets generate`.

## Status pengujian (jujur)
Logika di dalam aplikasi (simpan file lewat Bagikan, cetak lewat jembatan native, cetak Bluetooth lewat plugin tiruan, SW dimatikan di native) sudah diuji di browser dengan Capacitor tiruan. **Build Android/iOS sungguhan belum bisa saya jalankan** (tidak ada Android SDK/Mac di lingkungan saya) dan **belum dicoba dengan printer XP-58IIZ asli**. Bila langkah build error, kirim pesan error-nya ke saya.

## Cadangan otomatis harian
Di **Atur > Cadangan otomatis harian** (hanya pemilik):
- Setiap hari, saat aplikasi pertama kali dipakai, Kasirku membuat satu salinan seluruh data (produk, stok, riwayat, pengaturan, akun) di dalam aplikasi. **7 hari terakhir** disimpan.
- Tiap salinan bisa **Diunduh** atau **Dipulihkan**. Pulihkan butuh dua ketukan dan mengganti produk, stok, riwayat, dan pengaturan (akun tidak berubah). Data sebelum dipulihkan disimpan sebagai salinan pengaman.
- Tombol **Cadangkan sekarang** menimpa salinan hari ini. Pilihan **Mati** menghentikan salinan otomatis.
- Di **aplikasi native**, salinan juga ditulis ke folder **Kasirku** di aplikasi **Berkas** (Files), 14 hari terakhir. Di iOS: Berkas > Di iPad Saya > Kasirku. Di Android lokasinya bisa berbeda, dan bila gagal, panel menampilkan pesannya.
- Perlu diingat: salinan ini ada di perangkat yang sama. **Bila aplikasi dihapus atau perangkat hilang, salinan ikut hilang.** Tetap simpan cadangan manual (tombol Unduh cadangan) di tempat lain, mis. iCloud Drive, Google Drive, atau komputer. File cadangan berisi akun (kata sandi dalam bentuk hash), jadi simpan di tempat pribadi.
- Berkas harian bertambah besar mengikuti riwayat transaksi. Dengan puluhan ribu transaksi bisa mencapai beberapa MB per hari.
