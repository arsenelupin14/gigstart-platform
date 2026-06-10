# LAPORAN TEKNIS AKHIR REKAYASA PERANGKAT LUNAK: PENGEMBANGAN SISTEM GIGSTART
## ANALISIS TRANSISI ARSITEKTUR SISTEM DAN IMPLEMENTASI METODOLOGI AGILE

**Penyusun:** Ikbar Faiz  
**Mata Kuliah:** Rekayasa Perangkat Lunak (Software Engineering)  
**Periode Proyek:** Februari 2026 - Mei 2026

---

## Daftar Isi
1. [Pendahuluan](#1-pendahuluan)
   - 1.1 Latar Belakang dan Korelasi SDG 4 & 8
   - 1.2 Identifikasi Masalah
   - 1.3 Kebaruan Sistem (Novelty): *Job Eligibility Guard*
2. [Metodologi Pengembangan Perangkat Lunak](#2-metodologi-pengembangan-perangkat-lunak)
   - 2.1 Implementasi Kerangka Kerja *Agile Scrum*
   - 2.2 Model Proses Inkremental
   - 2.3 Rincian Linimasa Pengembangan (Februari - Mei 2026)
3. [Perancangan Perangkat Lunak dan Arsitektur Informasi](#3-perancangan-perangkat-lunak-dan-arsitektur-informasi)
   - 3.1 Diagram *Use Case* (Interaksi Aktor Utama)
   - 3.2 Diagram Aktivitas: Alur Mesin Asesmen
   - 3.3 Diagram Kelas dan Hubungan Antar-Entitas
4. [Arsitektur Perangkat Lunak](#4-arsitektur-perangkat-lunak)
   - 4.1 Arsitektur Berlapis (*N-Tier Architecture*)
   - 4.2 Evolusi Infrastruktur: Komparasi Versi April dan Mei
5. [Analisis Desain Antarmuka (UI/UX)](#5-analisis-desain-antarmuka-uiux)
   - 5.1 Sistem Desain: Tipografi, Palet Warna, dan Skala Spasi
   - 5.2 Komposisi Tata Letak dan Responsivitas
6. [Analisis Komparatif Kode Sumber dan *Refactoring*](#6-analisis-komparatif-kode-sumber-dan-refactoring)
   - 6.1 Evolusi Mekanisme Persistensi Data
   - 6.2 Pergeseran Paradigma *Rendering*: DOM Imperatif ke Virtual DOM Deklaratif
   - 6.3 Transformasi Logika *Routing* dan Manajemen *State*
7. [Rekayasa *Backend* dan API: Implementasi Express.js](#7-rekayasa-backend-dan-api-implementasi-expressjs)
   - 7.1 Kontrak API dan Endpoint RESTful
   - 7.2 *Middleware* Keamanan dan Optimasi Payload
8. [Evolusi Skema Basis Data](#8-evolusi-skema-basis-data)
   - 8.1 Struktur Data JSON Relasional (V2)
   - 8.2 Perancangan Skema PostgreSQL (Produksi)
9. [Estimasi Usaha (*Effort Estimation*)](#9-estimasi-usaha-effort-estimation)
   - 9.1 Analisis *Function Point* (FP)
   - 9.2 Analisis *Use Case Point* (UCP)
   - 9.3 Analisis Kritis Perbandingan FP dan UCP
10. [Manajemen Risiko Teknis](#10-manajemen-risiko-teknis)
11. [Metrik Kompleksitas dan Pengujian Sistem](#11-metrik-kompleksitas-dan-pengujian-sistem)
   - 11.1 Analisis *Cyclomatic Complexity*: Fungsi *checkEligibility*
   - 11.2 Matriks Pengujian Unit dan Hasil yang Diharapkan
12. [Analisis Pemeliharaan Perangkat Lunak (*Maintainability*)](#12-analisis-pemeliharaan-perangkat-lunak-maintainability)
13. [Kesimpulan dan Saran Pengembangan](#13-kesimpulan-dan-saran-pengembangan)

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang dan Korelasi SDG 4 & 8
Proyek **GigStart** dirancang sebagai solusi teknologi untuk mendukung target *Sustainable Development Goals* (SDG) PBB:
- **SDG 4 (Pendidikan Berkualitas):** Menyediakan kurikulum praktis dan modul asesmen yang relevan dengan standar industri terkini guna meningkatkan keahlian teknis pemuda.
- **SDG 8 (Pekerjaan Layak dan Pertumbuhan Ekonomi):** Membantu mengurangi angka pengangguran melalui sistem verifikasi kompetensi otomatis yang menghubungkan talenta dengan peluang kerja yang sesuai.

### 1.2 Identifikasi Masalah
Terdapat kesenjangan informasi (*information asymmetry*) antara lulusan baru dan industri rekrutmen. Perusahaan seringkali kesulitan memvalidasi kompetensi teknis pelamar secara cepat dan objektif. GigStart hadir untuk menyediakan platform mandiri yang memfasilitasi pembuktian kemampuan melalui proses rekayasa perangkat lunak yang transparan.

### 1.3 Kebaruan Sistem (Novelty): *Job Eligibility Guard*
Inovasi utama sistem ini terletak pada mekanisme **Job Eligibility Guard System**. Berbeda dengan platform pembelajaran daring konvensional, GigStart mengintegrasikan ambang batas kelulusan modul sebagai prasyarat mutlak untuk mengakses fitur pelamaran kerja. Hal ini menjamin bahwa setiap pelamar telah memenuhi kriteria teknis minimum yang ditetapkan oleh sistem.

---

## 2. METODOLOGI PENGEMBANGAN PERANGKAT LUNAK

### 2.1 Implementasi Kerangka Kerja *Agile Scrum*
Sistem dikembangkan dengan pendekatan **Agile Scrum** untuk mengakomodasi perubahan desain dan kebutuhan teknis secara dinamis dalam empat iterasi utama (Sprint).

| Tahap Scrum | Detail Pelaksanaan |
|-------------|--------------------|
| **Product Backlog** | Identifikasi dan prioritas fitur utama dilakukan pada awal Februari. |
| **Sprint Planning** | Pembagian modul pengerjaan ke dalam siklus 2 mingguan. |
| **Sprint Review** | Evaluasi teknis di akhir April yang mendasari transisi arsitektur monolitik ke modular. |
| **Daily Standup** | Sinkronisasi harian untuk memantau progres integrasi komponen sistem. |

### 2.2 Model Proses Inkremental
Sistem berevolusi melalui strategi inkremental:
1. **Iterasi V1 (April):** Pengembangan purwarupa fungsional berbasis *client-side storage*.
2. **Iterasi V2 (Mei):** Implementasi arsitektur *Client-Server* dengan penguatan pada sisi *backend* dan desain antarmuka.

### 2.3 Rincian Linimasa Pengembangan (Februari - Mei 2026)
| Fase | Periode | Aktivitas Utama |
|------|---------|-----------------|
| **Inception** | 23 Feb - 08 Mar | Ideasi proyek, analisis SDG, dan penetapan spesifikasi teknis awal. |
| **Elaboration** | 09 Mar - 31 Mar | Analisis kebutuhan, perancangan diagram UML, dan desain basis data. |
| **Construction V1** | 01 Apr - 30 Apr | Implementasi fungsionalitas inti (Versi Lama) berbasis *localStorage*. |
| **Transition & V2** | 01 Mei - 20 Mei | Migrasi ke React.js, implementasi *backend* Express.js, dan sinkronisasi API. |
| **Validation & QA** | 21 Mei - 28 Mei | Pengujian kompleksitas kode, pengujian unit, dan audit metrik kualitas. |
| **Final Deployment** | 29 Mei - 31 Mei | Optimasi akhir, perbaikan *bug*, dan publikasi ke lingkungan produksi Vercel. |

---

## 3. PERANCANGAN PERANGKAT LUNAK DAN ARSITEKTUR INFORMASI

### 3.1 Diagram *Use Case*
Aktor sistem terdiri dari: Guest, *Registered User* (Pelajar), dan Administrator.
![Use Case Diagram](/home/ikbarfaiz/Projects/Supporting Files/Support2/skillgrade_usecase.png)

### 3.2 Diagram Aktivitas: Alur Mesin Asesmen
Proses utama: `Pemilihan Modul -> Rendering Soal -> Input Jawaban -> Perhitungan Skor Berbasis Rubrik -> Pembaruan State Basis Data -> Penerbitan Sertifikat Digital`.

---

## 4. ARSITEKTUR PERANGKAT LUNAK

### 4.1 Arsitektur Berlapis (*N-Tier Architecture*)
Sistem mengadopsi arsitektur berlapis untuk memastikan pemisahan tanggung jawab (*Separation of Concerns*):
1. **Presentation Layer:** Antarmuka responsif menggunakan React.js.
2. **Communication Layer:** RESTful API untuk pertukaran data asinkron.
3. **Application Logic Layer:** Logika penilaian otomatis di sisi server.
4. **Data Layer:** Persistensi data berbasis file JSON dan rancangan PostgreSQL.

### 4.2 Evolusi Infrastruktur: Komparasi Versi April dan Mei
Transisi dari infrastruktur monolitik menuju sistem terdistribusi meningkatkan skalabilitas sistem secara signifikan, memungkinkan penanganan beban pengguna yang lebih besar.

---

## 5. ANALISIS DESAIN ANTARMUKA (UI/UX)

### 5.1 Sistem Desain: Tipografi dan Palet Warna
- **Tipografi:** Penggunaan kombinasi font **Geist Sans** untuk elemen teknis dan **Newsreader Serif** untuk elemen editorial guna menciptakan hierarki informasi yang jelas.
- **Palet Warna:** Standarisasi warna *Professional Blue* (#2563eb) untuk memperkuat identitas sistem yang kredibel.

---

## 6. ANALISIS KOMPARATIF KODE SUMBER DAN *REFACTORING*

### 6.1 Evolusi Mekanisme Persistensi Data
Pergeseran dari metode sinkron berbasis peramban (*browser-based*) menuju komunikasi API asinkron.

**Kode Versi April (Sinkron - localStorage):**
```javascript
function saveDb(db) {
  localStorage.setItem("gigstart_db_v3", JSON.stringify(db));
}
```

**Kode Versi Mei (Asinkron - REST API):**
```javascript
function saveDb(db) {
  setAppDb(db); 
  fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(db)
  }).catch(err => console.error("Kegagalan Sinkronisasi API:", err));
}
```

### 6.2 Pergeseran Paradigma *Rendering*
Versi Mei menggantikan manipulasi DOM langsung (*imperative*) dengan model deklaratif React. Hal ini meningkatkan performa melalui optimalisasi proses *re-rendering* komponen yang hanya dilakukan saat terjadi perubahan *state* spesifik.

---

## 7. REKAYASA *BACKEND* DAN API: IMPLEMENTASI EXPRESS.JS

Sistem *backend* menyediakan endpoint RESTful yang terstandarisasi untuk memastikan integritas data antara klien dan server. Penggunaan *middleware* seperti CORS dan parser JSON dengan batasan kapasitas (50MB) menjamin keamanan transfer data.

---

## 8. EVOLUSI SKEMA BASIS DATA

Sistem bertransformasi dari struktur data linier menuju skema relasional yang mendukung hubungan *one-to-many* antara entitas User, Submissions, dan Certificates.

---

## 9. ESTIMASI USAHA (*EFFORT ESTIMATION*)

### 9.1 Perbandingan Analisis FP dan UCP
- **Function Point (FP):** 93 Adjusted FP (744 jam).
- **Use Case Point (UCP):** 44.96 UCP (899.2 jam).
- **Interpretasi Teknis:** Estimasi UCP menunjukkan angka 20.9% lebih tinggi karena metode ini lebih sensitif terhadap kompleksitas interaksi pengguna pada fitur mesin asesmen.

---

## 10. MANAJEMEN RISIKO TEKNIS

| Risiko | Tingkat | Mitigasi Teknis |
|--------|---------|-----------------|
| Injeksi SQL | Tinggi | Implementasi *Parameterized Queries* di sisi server. |
| Konflik State | Sedang | Mekanisme *State Synchronization* asinkron. |

---

## 11. METRIK KOMPLEKSITAS DAN PENGUJIAN SISTEM

### 11.1 Analisis *Cyclomatic Complexity*
Melalui audit pada fungsi kritis `checkEligibility`, didapatkan nilai **V(G) = 3**. Nilai ini menunjukkan kode yang efisien dan memiliki tingkat keterujian yang tinggi dengan tiga jalur keputusan independen.

---

## 12. ANALISIS PEMELIHARAAN PERANGKAT LUNAK (*MAINTAINABILITY*)

Sistem diukur menggunakan tiga parameter:
1. **Defect Density:** Penurunan angka cacat kode melalui penerapan analisis statis (ESLint).
2. **Modularitas:** Pemecahan kode monolitik menjadi komponen modular di versi Mei mempermudah isolasi masalah.
3. **MTTR (*Mean Time To Repair*):** Struktur proyek yang terstandarisasi mempercepat proses identifikasi dan perbaikan *bug*.

---

## 13. KESIMPULAN DAN SARAN PENGEMBANGAN

Pengembangan sistem GigStart dari Februari hingga Mei 2026 telah berhasil mencapai seluruh target fungsionalitas melalui penerapan metodologi Agile Scrum. Transisi arsitektur menuju model *N-Tier* berbasis React dan Express.js memastikan sistem memiliki kesiapan teknis untuk skala produksi.

---
**Tertanda,**  
Ikbar Faiz  
*(Penyusun Laporan)*
