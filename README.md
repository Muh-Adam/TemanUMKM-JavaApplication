# TemanUMKM

Simulator keuangan dan penentu HPP untuk UMKM (SDG 8). Backend Java (Spring Boot), frontend Next.js.

## Menjalankan
Butuh: JDK 17+, Maven, Node 18+.

```bash
# Terminal 1 - backend (port 8080)
cd backend && mvn spring-boot:run

# Terminal 2 - frontend (port 3000)
cd frontend && npm install && npm run dev
```
Laptop: buka http://localhost:3000
HP (satu Wi-Fi dengan laptop): buka http://IP-LAPTOP:3000 (cek IP dengan `ipconfig` / `ifconfig`).
HP hanya mengakses frontend; panggilan /api diteruskan ke backend lewat next.config.mjs.

## Peta konsep OOP
| Konsep | Lokasi |
|---|---|
| Abstraction | `model/BiayaItem` (abstract class, method abstract `hitungBiaya`) |
| Inheritance | `BahanBaku`, `TenagaKerja`, `Overhead` extends `BiayaItem` |
| Polymorphism | `Produk.totalBiaya()` memanggil `hitungBiaya()` tanpa tahu jenisnya |
| Encapsulation | field private final + validasi di constructor |
| Interface | `strategi/StrategiHarga` diimplementasi `MarginPersen` dan `MarkupRupiah` |
| Composition | `Produk` punya `List<BiayaItem>` |

## Jadi APK (HP) dan web/PWA (laptop)
Backend harus online karena APK hanya berisi tampilan.

1. **Hosting backend.** Push repo ini ke GitHub. Di render.com buat *Web Service* dari repo, Root Directory `backend`, Runtime Docker. Catat URL-nya, misal `https://temanumkm-api.onrender.com`. (Paket gratis tidur saat sepi, request pertama bisa lambat.)
2. **Set URL.** GitHub repo > Settings > Secrets and variables > Actions > tab Variables > buat `API_URL` berisi URL Render tadi (tanpa garis miring di akhir).
3. **Bangun APK.** Tab Actions > *Build APK* > Run workflow. Setelah hijau, unduh artifact `TemanUMKM-apk`, kirim `app-debug.apk` ke HP, install (izinkan "sumber tidak dikenal").
4. **Laptop.** Deploy folder `frontend` ke Vercel dengan env `NEXT_PUBLIC_API_URL` = URL Render. Buka di Chrome/Edge, klik ikon Install di address bar. Di HP, web yang sama bisa di-install lewat "Tambahkan ke layar utama".

Build APK manual (butuh Android Studio): `cd frontend && npm install && npx cap add android && NEXT_PUBLIC_API_URL=https://... npm run apk:sync && npx cap open android`

## Mode lokal (tanpa hosting, tanpa kartu kredit)
Laptop dan HP harus satu Wi-Fi.

1. Jalankan backend dan frontend di laptop (lihat bagian Menjalankan di atas).
2. Izinkan port 8080 dan 3000 di firewall laptop (Windows: izinkan Java dan Node saat muncul pop-up).
3. Cek IP laptop (`ipconfig` / `ifconfig`), misal `192.168.1.10`.
4. Di HP, pilih salah satu:
   - Browser: buka `http://192.168.1.10:3000` (bisa "Tambahkan ke layar utama").
   - APK: bangun lewat GitHub Actions (kosongkan variabel `API_URL`), install, lalu isi "Alamat server" di bagian bawah halaman dengan `http://192.168.1.10:8080`.

## Fitur tambahan
- **Simpanan:** produk dan riwayat perhitungan disimpan di perangkat (localStorage), bukan di server, supaya data tiap pengguna tidak tercampur. Konsekuensinya data tidak berpindah antar perangkat.
- **Pegawai:** hierarki `Pegawai` (abstract) > `PegawaiTetap`, `PegawaiHarian`, `PegawaiParuhWaktu`, dihitung polymorphic oleh `PegawaiService`. Total gaji bisa dimasukkan ke simulasi bulanan.
- **Ekspor Excel:** `Eksportir` (interface) > `XlsxEksportir` (Apache POI), 4 lembar. Endpoint `POST /api/export/xlsx`. Di APK dibuka lewat menu Bagikan (plugin Capacitor Filesystem dan Share).
- **Buku kas:** `Transaksi` (abstract) > `Pemasukan`, `Pengeluaran` (`nilaiBersih()` positif/negatif), disusun dalam `BukuKas`; `KasService` membuat rekap bulanan (`POST /api/kas/rekap`). Ikut diekspor sebagai lembar "Kas".
