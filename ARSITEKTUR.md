# Arsitektur Kasirku: front end, back end, database

Satu tampilan yang sama dipakai di tiga bentuk. Yang berbeda hanya "dapur" di belakangnya.

```
                  ┌───────────────────────────────┐
                  │   FRONT END  (index.html)     │   HTML + CSS + JavaScript
                  │   layar kasir, stok, laporan  │   satu berkas, tanpa framework
                  └──────────────┬────────────────┘
                                 │  memanggil  /api/...  (JSON)
        ┌────────────────────────┼─────────────────────────────┐
        ▼                                                      ▼
┌──────────────────────────────┐              ┌────────────────────────────────┐
│ A. VERSI SERVER              │              │ B. MANDIRI (iPad / Android)    │
│ BACK END: server.py (Python) │              │ BACK END: localserver.js       │
│ DATABASE: SQLite (satu berkas)│             │ (server mini di dalam aplikasi)│
│ jalan di PC/hosting          │              │ DATABASE: IndexedDB di perangkat│
└──────────────────────────────┘              └────────────────────────────────┘
```

Versi native (`kasirku-app`) adalah **B** yang dibungkus Capacitor menjadi aplikasi iOS/Android, ditambah beberapa plugin native (lihat bagian 4).

## 1. Front end (yang dilihat dan disentuh pengguna)
- **Bahasa:** HTML, CSS, dan JavaScript biasa (vanilla). Tanpa React/Vue, tanpa proses build. Seluruh tampilan ada di satu berkas `index.html`.
- **Isi:** layar Kasir, Stok, Riwayat dan laporan, Pengguna, Atur; keranjang, pembayaran, struk; hak akses per peran (pemilik, manajer, kasir).
- **Cara kerja:** menyimpan keadaan layar di memori (`S` dan `Store`), menggambar ulang layar, dan semua data diambil/disimpan lewat `fetch('/api/...')`. Front end tidak tahu apakah di belakangnya server Python atau mini server di dalam aplikasi, karena alamat dan format datanya sama.
- **Cetak struk:** dialog cetak sistem (AirPrint), atau langsung ke printer Bluetooth lewat perintah **ESC/POS** (Web Bluetooth di Chrome/Android/Bluefy, atau plugin Bluetooth di aplikasi native).
- **Font:** Google Fonts bila ada internet, dan font sistem bila tidak ada.
- **Offline (versi mandiri):** *service worker* (`sw.js`) menyimpan berkas aplikasi di perangkat.

## 2. Back end (yang memproses dan menjaga aturan)
Tugasnya: login dan peran, hitung transaksi, kurangi stok, batalkan transaksi, laporan, impor/ekspor, cadangan, lisensi. Aturan yang sama ada di dua versi.

| | A. Versi server | B. Mandiri / native |
|---|---|---|
| Berkas | `server.py` (±1.500 baris) | `localserver.js` (±600 baris, ikut tertanam di `index.html`) |
| Teknologi | Python 3 standar (`http.server`), tanpa pustaka tambahan | JavaScript di dalam aplikasi; mencegat panggilan `fetch('/api/...')` |
| Kata sandi | PBKDF2-SHA256 (200.000 putaran) | PBKDF2 lewat WebCrypto |
| Sesi | token acak di header `Authorization`, hanya hash-nya disimpan | sama |
| Keamanan lain | pembatasan percobaan login, batas ukuran permintaan | kode pemulihan untuk lupa kata sandi pemilik |
| Lisensi | tanda tangan **ECDSA P-256** diverifikasi di server | diverifikasi dengan WebCrypto di perangkat |
| Akses | lewat jaringan (Wi-Fi toko atau internet, sebaiknya HTTPS) | tidak ada jaringan sama sekali |

## 3. Database
**A. Versi server: SQLite**, satu berkas (`data/kasirku.db`), mode WAL, transaksi atomik.
Tabel: `products` (produk dan stok), `sales` (transaksi), `sale_items` (isi tiap transaksi), `users` (akun), `sessions` (sesi login), `meta` (pengaturan, lisensi, dll).
Cadangan: otomatis satu per hari, 14 terakhir di `data/backups`, ditambah unduh manual.

**B. Mandiri / native: IndexedDB** (basis data bawaan peramban/WebView, nama `kasirku`, versi 3). Bentuknya dokumen, bukan tabel:
- `kv` berisi satu catatan `core` (produk, pengaturan, akun, sesi, meta) dan `abkIndex` (daftar cadangan harian).
- `sales` berisi **satu catatan per transaksi** (indeks pada waktu dan nomor), jadi menyimpan penjualan tetap cepat walau riwayat sudah ratusan ribu.
- `autobak` berisi salinan harian.
Data ada di perangkat itu saja dan tidak ikut ke perangkat lain. Aplikasi native tidak terkena pembersihan otomatis Safari untuk situs yang lama tidak dibuka.

## 4. Lapisan native (hanya di `kasirku-app`)
Capacitor menjalankan front end di WKWebView (iOS) atau WebView (Android), plus:
- **Bluetooth LE** (`@capacitor-community/bluetooth-le`): kirim struk ke XP-58IIZ.
- **Filesystem dan Share**: ekspor stok, cadangan, dan salinan harian ke Berkas.
- **Plugin cetak kecil** (`KasirPrint` di iOS, `KasirNative` di Android): dialog cetak sistem.

## 5. Alat pendukung
- **Generator lisensi** (`kasirku-license`, Python): membuat kunci bertanda tangan. Kunci rahasianya hanya ada pada Anda.
- **Build iPad otomatis**: GitHub Actions membangun `Kasirku.ipa` dari `setup.mjs` dan `src/`.

## 6. Kelebihan dan batas desain ini
- Sederhana: tanpa server database terpisah dan tanpa langganan, mudah dipindah.
- Versi mandiri: satu perangkat = satu data. Dua iPad tidak berbagi stok. Untuk berbagi, pakai versi server.
- SQLite cocok untuk satu toko dan puluhan pengguna bersamaan. Untuk banyak cabang dengan ribuan transaksi per menit, perlu database server (misalnya PostgreSQL).
- Cadangan harian di dalam perangkat tidak menggantikan cadangan di luar perangkat.
