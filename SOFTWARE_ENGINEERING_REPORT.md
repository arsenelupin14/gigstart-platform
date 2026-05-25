# Laporan Software Engineering: Pengembangan Sistem GigStart

Sistem GigStart dikembangkan dengan mengadopsi pendekatan siklus hidup pengembangan perangkat lunak (Software Development Life Cycle - SDLC) yang terstruktur dan terukur. Laporan ini menjabarkan setiap fase rekayasa perangkat lunak untuk memastikan sistem yang dihasilkan tidak hanya fungsional, tetapi juga _scalable_, aman, dan mudah dipelihara.

---

## 1. Problem Identification

Sistem GigStart dikembangkan untuk menyelesaikan masalah pada proses pengelolaan portofolio, asesmen keterampilan, dan penyediaan layanan karier berbasis web agar lebih terstruktur, cepat, dan mudah diakses. Banyak pencari kerja dan perusahaan menghadapi kendala dalam memverifikasi keahlian secara objektif; GigStart hadir sebagai jembatan yang memvalidasi keterampilan melalui modul dan _rubric assessment_ yang komprehensif.

## 2. Requirement Analysis

Kebutuhan sistem dikumpulkan dan dipisahkan menjadi dua jenis utama untuk memastikan kualitas fungsional maupun struktural.

### Functional Requirement
- **Authentication & Authorization:** Sistem login, register, dan manajemen _role_ (Admin dan User/Learner).
- **Core Features:** Dashboard pengguna, pengerjaan modul, validasi portofolio, asesmen otomatis berbasis AI & manusia, serta fitur _apply job_ (pekerjaan mikro).
- **Admin Management:** Pengelolaan modul, rubrik penilaian, _job postings_, serta ulasan _submission_ pengguna.

### Non-Functional Requirement
- **Security:** Perlindungan data pengguna, keamanan sesi (session management), dan pencegahan akses tanpa izin.
- **Usability:** Antarmuka (UI/UX) yang bersih, profesional, responsif, dan mudah dipahami dengan navigasi berbasis _dashboard_.
- **Performance & Scalability:** Waktu muat halaman (_load time_) yang cepat, sistem rendering yang efisien, dan kemampuan backend untuk menangani peningkatan pengguna secara konkuren.
- **Maintainability:** Penggunaan arsitektur kode modular (komponen UI terpisah) dan penerapan standardisasi gaya penulisan kode.

## 3. System Planning

Perencanaan sistem menguraikan teknologi dan distribusi tanggung jawab untuk setiap modul utama:
- **Frontend:** Menangani tampilan dan interaksi pengguna menggunakan JavaScript (Vanilla JS) dengan pendekatan DOM rendering dinamis.
- **Backend:** Menangani business logic dan menyediakan RESTful API. Dirancang menggunakan **Node.js** dengan *framework* **Express.js**.
- **Database:** Menyimpan data utama sistem dengan integritas tinggi menggunakan **PostgreSQL**.
- **Authentication:** Mengatur login, enkripsi kata sandi, dan pengelolaan *session* (misalnya menggunakan JWT atau sesi berbasis server).
- **Deployment:** Membuat sistem dapat diakses secara online (contoh: Vercel untuk Frontend dan Railway/Render untuk Backend Node.js).

## 4. System Architecture Design

Sistem dirancang dengan arsitektur _Layered Pattern_ untuk memisahkan tanggung jawab dan menjaga modularitas:

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
Diagram alur data:
```text
User
 ↓
Frontend
 ↓
REST API
 ↓
Controller
 ↓
Service / Business Logic
 ↓
Repository / Data Access
 ↓
Database
```

## 5. Database Design

Database dirancang berdasarkan kebutuhan data sistem dengan memperhatikan relasi antar-entitas, konsistensi data, serta efisiensi proses penyimpanan dan pengambilan data. Desain mengedepankan aspek _entity relationship, data integrity, normalization, relational mapping_.

## 6. API Contract Design

Sistem komunikasi antara Frontend dan Backend dirancang menggunakan kontrak API yang terstruktur:
- Frontend tidak langsung mengakses database.
- Frontend mengirim request ke backend melalui API.
- Backend memvalidasi request, memproses logic, lalu mengirim response.

## 7. Frontend Design

Frontend dirancang untuk menerjemahkan kebutuhan pengguna menjadi antarmuka yang mudah digunakan, dengan struktur halaman, komponen, validasi input, serta komunikasi API yang terorganisir. Melibatkan _page structure, component structure, routing, state management, form validation, error handling_, dan _responsive layout_.

## 8. Backend Design

Struktur backend yang lebih proper:
```text
Route
 ↓
Controller
 ↓
Service
 ↓
Repository / Model
 ↓
Database
```
Backend menjelaskan logic utama sistem, meliputi _controller, service, model, middleware, authentication, authorization, validation_, dan _error handling_.

## 9. Implementation

Implementasi dilakukan berdasarkan requirement dan desain sistem yang telah dibuat sebelumnya, sehingga proses coding tidak dilakukan secara acak, tetapi mengikuti rancangan modular. Tahap ini meliputi _Frontend Implementation, Backend Implementation, Database Implementation, Authentication Implementation_, dan _API Integration_.

## 10. Integration

Integration dilakukan untuk memastikan setiap komponen sistem dapat berkomunikasi dengan baik, terutama antara frontend, backend, dan database melalui API yang telah dirancang. Yang dicek: API berjalan, data berhasil dikirim, response sesuai, validasi cocok, login berhasil, role access benar.

## 11. Testing & Quality Assurance

Testing dilakukan untuk memastikan sistem memenuhi requirement, bebas dari error utama, aman digunakan, dan dapat berjalan sesuai kebutuhan pengguna. Strategi pengujian mencakup:
- **Unit Testing:** Menguji fungsi kecil.
- **Integration Testing:** Menguji hubungan antar-modul.
- **System Testing:** Menguji sistem secara keseluruhan.
- **User Acceptance Testing:** Menguji apakah sistem sudah sesuai kebutuhan user.

## 12. Deployment

Deployment adalah tahap publikasi sistem ke server. Alur publikasi mencakup proses _build frontend, konfigurasi backend, environment variable, database migration, hosting, domain_, dan _SSL_.
Alur Deployment:
```text
Source Code
 ↓
Build Process
 ↓
Environment Configuration
 ↓
Server Deployment
 ↓
Database Migration
 ↓
Production Testing
```

## 13. Monitoring & Maintenance

Maintenance dilakukan untuk menjaga sistem tetap stabil, aman, dan relevan dengan kebutuhan pengguna setelah sistem digunakan. Mencakup _bug fixing, update fitur, backup database, monitoring error, optimasi performa_, dan _update dependency_.

## 14. Evaluation & Improvement

Evaluasi dilakukan untuk menilai keberhasilan sistem dalam menyelesaikan masalah awal serta menentukan pengembangan lanjutan. Fokus evaluasi meliputi umpan balik UI/UX, kinerja fitur, serta kebutuhan eskalasi sistem di masa mendatang.

---
**Modular Design & Maintenance Plan:** Dokumen ini menegaskan pendekatan rekayasa perangkat lunak skala _enterprise_ (_Requirement Engineering_, _API Contract_, _Deployment Strategy_) dibandingkan sekadar siklus pengodean tradisional.