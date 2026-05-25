# GigStart - Platform Persiapan Karier

GigStart adalah platform berbasis web yang dikembangkan untuk menyelesaikan masalah pada proses pengelolaan portofolio, asesmen keterampilan, dan penyediaan layanan karier agar lebih terstruktur, cepat, dan mudah diakses. Platform ini hadir sebagai jembatan bagi pencari kerja (mahasiswa & *fresh graduate*) dan perusahaan dalam memverifikasi keahlian secara objektif melalui modul dan *rubric assessment* yang komprehensif.

Proyek ini dikembangkan dengan mengadopsi pendekatan siklus hidup pengembangan perangkat lunak (*Software Development Life Cycle* - SDLC) yang terstruktur, memastikan sistem yang dihasilkan fungsional, *scalable*, aman, dan mudah dipelihara.

---

## Fitur Utama

Sistem GigStart membagi fungsionalitasnya menjadi beberapa bagian utama:

1. **Authentication & Authorization**
   - Sistem registrasi dan login yang aman.
   - Manajemen *role* pengguna (Admin dan User/Learner).

2. **Core Features (User)**
   - **Dashboard interaktif:** Melacak progres belajar dan status kesiapan kerja.
   - **Modul Praktis:** Pembelajaran yang berorientasi pada target role pekerjaan.
   - **Validasi Portofolio & Sertifikat:** Pengakuan objektif setelah menyelesaikan modul dan asesmen.
   - **Job Apply:** Melamar pekerjaan (*micro-jobs*) yang sesuai dengan keterampilan yang telah tervalidasi.

3. **Admin Management**
   - Pengelolaan modul pembelajaran dan karir (*Career Paths*).
   - Pengaturan rubrik penilaian dan *job postings*.
   - Review dan kurasi *submission* tugas pengguna.

---

## Arsitektur Sistem

GigStart dibangun menggunakan arsitektur **Layered Pattern** untuk memisahkan tanggung jawab dan menjaga modularitas kode skala *enterprise*:

```text
Client Layer
    ↓
Presentation Layer
    ↓
API Layer
    ↓
Business Logic Layer
    ↓
Data Access Layer
    ↓
Database Layer
```

**Alur Data Request:**
`User` - `Frontend` - `REST API` - `Controller` - `Service / Business Logic` - `Repository` - `Database`

---

## Teknologi yang Digunakan

- **Frontend:** HTML5, Vanilla CSS (Custom Properties & Modern Layout), Vanilla JavaScript (DOM Rendering Dinamis & SPA Routing).
- **Backend/API:** Node.js, Express.js (RESTful API).
- **Database:** PostgreSQL (Relational Database Management System).
- **Deployment:** Vercel (untuk Frontend) dan Railway/Render (untuk Backend/Database).

---

## Alur Deployment

Aplikasi dipublikasikan (*deploy*) dengan alur otomatisasi berikut:

1. **Source Code** di-[push] ke repositori.
2. **Build Process** mengkompilasi *asset* frontend.
3. **Environment Configuration** menyuntikkan *environment variable* rahasia.
4. **Server Deployment** mengunggah file statis ke Vercel.
5. **Database Migration** (jika ada) dijalankan.
6. **Production Testing** memastikan aplikasi berjalan (*live*) tanpa *error*.

---

## Cara Menjalankan Proyek di Lokal

Jika kamu ingin mengembangkan atau menguji proyek GigStart di komputermu sendiri:

1. **Clone Repositori:**
   ```bash
   git clone https://github.com/username/gigstart.git
   cd gigstart
   ```

2. **Jalankan *Development Server*:**
   Kamu bisa menggunakan utilitas seperti `serve`, `live-server`, atau langsung menjalankannya lewat Node.js:
   ```bash
   # Jalankan server lokal
   npm start
   # atau menggunakan npx vercel
   npx vercel dev
   ```

3. **Akses Aplikasi:**
   Buka *browser* dan kunjungi `http://localhost:3000` (atau *port* yang diberikan oleh server lokalmu).

---

## Pengujian & Kualitas (QA)

Untuk menjaga sistem tetap andal (*reliable*), kami menerapkan beberapa level pengujian:
- **Unit Testing:** Menguji fungsi-fungsi utilitas kecil.
- **Integration Testing:** Memastikan alur komunikasi API Frontend ke Backend berjalan mulus.
- **System Testing:** Pengujian *end-to-end* untuk seluruh alur aplikasi.
- **User Acceptance Testing (UAT):** Validasi bahwa sistem benar-benar menyelesaikan masalah pencari kerja dan rekruter.

---

*Laporan teknis lengkap mengenai Software Engineering untuk proyek ini dapat dibaca pada file `SOFTWARE_ENGINEERING_REPORT.md`.*
