# Portofolio Naufal Izzuddin Taufik

Website portofolio satu halaman berdasarkan desain HTML yang diberikan. Dibangun dengan Vite, JavaScript, dan Tailwind CSS. Proyek yang ditampilkan hanya Dekstra dan Arsipal.

## Menjalankan secara lokal

Gunakan Node.js 24 LTS (atau versi yang memenuhi `engines` di `package.json`).

```sh
npm ci
npm run dev
```

## Build produksi

```sh
npm run build
npm run preview
```

Hasil build ada di `dist/`. Folder ini dibuat ulang setiap kali build; edit sumbernya di `index.html` dan `src/`.

## Deploy ke Vercel

1. Push isi folder `portofolio` ini ke repository GitHub, lalu import repository tersebut di Vercel.
2. Jika repository juga memuat proyek lain, atur **Root Directory** ke `portofolio`.
3. Gunakan **Framework Preset: Vite**, **Install Command: npm ci**, **Build Command: npm run build**, dan **Output Directory: dist**. Konfigurasi ini sudah ada di `vercel.json`.
4. Deploy. Tidak memerlukan environment variable, database, atau layanan email tambahan.

Alternatif menggunakan Vercel CLI dari folder ini:

```sh
npx vercel
```

Periksa deployment preview, lalu gunakan `npx vercel --prod` saat siap mempublikasikan.

## Konten dan aset

- `index.html`: profil, keahlian, dua proyek, pengalaman, pendidikan, dan kontak.
- `src/main.js`: menu mobile, navigasi aktif, tema, animasi, katalog sertifikat, dan draf email.
- `src/certificates.json`: 25 entri yang menghubungkan seluruh 28 dokumen PDF/PNG dari ZIP. Dua surat Cisco dan versi Indonesia kursus Huawei dilampirkan pada entri terkait. `desktop.ini` tidak disertakan.
- `public/certificates/`: dokumen asli dengan nama berkas yang aman untuk URL.
- `public/CV_Naufal_Izzuddin_Taufik.pdf`: CV yang diberikan.
- `public/images/naufal.jpg`: foto yang diekstrak dari CV.
- `src/reference.css` dan `tailwind.config.js`: token serta animasi dari desain acuan; Tailwind dibuild secara lokal, tanpa Play CDN.

Formulir kontak **membuka aplikasi email pengunjung** dengan penerima, subjek, dan isi yang terisi. Pesan dikirim oleh pengunjung dari aplikasi emailnya. Tidak ada klaim bahwa pesan sudah terkirim dari website.

Tautan microservice menggunakan repository `dekstra-microservice-async`. Tombol "Lihat Kode" pada proyek Arsipal membuka `https://github.com/naufalizzuddin/arsipal` di tab baru, sesuai URL yang dikonfirmasi pemilik portofolio.

Google Fonts memuat font dari layanan Google, dengan fallback sistem jika jaringan tidak tersedia. Foto, CV, ikon SVG, dan seluruh dokumen sertifikat disajikan dari proyek ini.

Sertifikat Cisco dan Huawei ditulis sebagai penyelesaian kursus. Sertifikat Komdigi ditulis sebagai pelatihan. Dokumen TOEFL ITP 573 diberi label *Unofficial Student Score Report*, sesuai dokumen sumber. Tidak ada sertifikasi BNSP/AWS/PCAP/LPIC/EDB yang ditambahkan.

File di `public/`, termasuk CV dan sertifikat, dapat diakses oleh pengunjung setelah website dipublikasikan.

## Pemeriksaan

- Build produksi dan pemeriksaan sintaks JavaScript berhasil menggunakan Node.js 24.
- Layout diperiksa pada lebar 320, 390, 768, dan 1440 piksel; tidak ditemukan overflow horizontal pada bagian halaman.
- Menu mobile, tema gelap/terang, tampilkan semua sertifikat, filter, pencarian, hasil kosong, serta validasi formulir kosong diperiksa di browser.
- Seluruh 28 dokumen sertifikat, CV, foto, dan favicon mengembalikan HTTP 200 dari build produksi; ukuran berkas dan tipe PDF sesuai sumber.
- Tidak ditemukan error atau warning pada console browser saat pemeriksaan akhir.

Formulir tidak diuji sampai pengiriman email karena pengiriman dilakukan sendiri oleh pengunjung dari aplikasi emailnya.
