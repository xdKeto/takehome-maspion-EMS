# Takehome Maspion EMS

Employee Management System untuk mengelola data karyawan, departemen, akun pengguna, dan audit log.

## Demo Live

- Backend API: [takehome-maspion-ems-backend.vercel.app](https://takehome-maspion-ems-backend.vercel.app)
- Health check: [API health check](https://takehome-maspion-ems-backend.vercel.app/health)
- Frontend: [takehome-maspion-ems-frontend.vercel.app](https://takehome-maspion-ems-frontend.vercel.app)

## Demo account
- Viewer = {
  "username": "employee1",
  "password": "employee123"
}
- Admin = {
  "username": "admin_ems",
  "password": "13password57"
}

## Tech Stack

- Backend: Node.js, Express, Prisma ORM 7, PostgreSQL
- Frontend: React, TypeScript, Vite, Tailwind + Shadcn components
- Authentication: JWT dan role `ADMIN`/`VIEWER`

## Struktur Project

```text
takehome-maspion-EMS/
├── backend/     # Express API dan Prisma schema/migration
└── frontend/    # React web application
```

## Setup Lokal

### Prasyarat

- Node.js 
- PostgreSQL 
- Database PostgreSQL 

### 1. Konfigurasi backend

Masuk ke folder backend dan install dependency:

```bash
cd backend
npm install
```

Buat file `.env` secara manual di folder `backend/` dengan konfigurasi berikut.

```env
PORT=2000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/maspion_ems?schema=public"
JWT_SECRET="long-secret-string"
JWT_EXPIRES_IN="1h"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="password"
```

Jalankan migration dan buat akun admin:

```bash
npm run db:migrate
npm run db:seed-admin
```

Backend saat ini mengekspor Express app untuk deployment Vercel. Sebelum menjalankan server secara lokal, aktifkan blok `app.listen` yang dikomentari di `backend/src/index.js`, lalu jalankan:

```bash
npm run dev
```

API lokal tersedia di `http://localhost:2000`.

### 2. Konfigurasi frontend

Buka terminal baru, lalu install dependency frontend:

```bash
cd frontend
npm install
```

Buat file `.env` secara manual di folder `frontend/`:

```env
VITE_API_URL=http://localhost:2000
```

Jalankan frontend:

```bash
npm run dev
```

Frontend tersedia di `http://localhost:5173`.

## ERD / Skema Database

```mermaid
erDiagram
    DEPARTMENTS ||--o{ EMPLOYEE : memiliki
    USER ||--o{ AUDIT_LOG : membuat

    DEPARTMENTS {
        int id PK
        string nama
    }

    EMPLOYEE {
        int id PK
        string nama
        string email UK
        string no_telp UK
        string jabatan
        EmployeeStatus status
        date tanggal_masuk
        string image
        int department_id FK
    }

    USER {
        int id PK
        string username UK
        string password
        UserRole role
    }

    AUDIT_LOG {
        int id PK
        string target
        string target_id
        Actions action
        string changes
        int user_id FK
        string username
        datetime createdAt
    }
```

### Enum

- `EmployeeStatus`: `FULL_TIME`, `PART_TIME`, `KELUAR`
- `UserRole`: `ADMIN`, `VIEWER`
- `Actions`: `CREATE`, `UPDATE`, `DELETE`

Catatan: `email`, `no_telp`, dan `username` bersifat unik. `AuditLog.user_id` bersifat opsional dan menjadi `NULL` jika user terkait dihapus.

## Daftar Endpoint

Semua endpoint selain login dan health check membutuhkan header:

```http
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint | Auth | Role | Keterangan |
|---|---|---|---|---|
| `GET` | `/health` | Tidak | - | Cek status API |
| `POST` | `/api/auth/login` | Tidak | - | Login dan mendapatkan JWT |
| `POST` | `/api/auth/register` | Ya | `ADMIN` | Membuat user baru |
| `GET` | `/api/employees` | Ya | Semua | Daftar karyawan, search, filter, dan sorting |
| `GET` | `/api/employees/:id` | Ya | Semua | Detail karyawan |
| `GET` | `/api/employees/export-csv` | Ya | Semua | Export karyawan ke CSV |
| `POST` | `/api/employees` | Ya | `ADMIN` | Membuat karyawan |
| `PUT` | `/api/employees/:id` | Ya | `ADMIN` | Mengubah karyawan |
| `DELETE` | `/api/employees/:id` | Ya | `ADMIN` | Menghapus karyawan |
| `GET` | `/api/departments` | Ya | Semua | Daftar departemen |
| `GET` | `/api/audit` | Ya | `ADMIN` | Daftar audit log |

### Query parameter karyawan

Endpoint `GET /api/employees` mendukung:

- `search`: pencarian pada `nama`, `email`, `no_telp`, atau `jabatan`
- `status`: `FULL_TIME`, `PART_TIME`, atau `KELUAR`
- `department_id`: ID departemen positif
- `sort_by`: `id`, `nama`, `jabatan`, `status`, atau `tanggal_masuk`
- `sort_order`: `asc` atau `desc`

### Contoh request

Login:

```bash
curl -X POST http://localhost:2000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

Membuat karyawan:

```bash
curl -X POST http://localhost:2000/api/employees \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nama":"Budi Santoso",
    "email":"budi@example.com",
    "no_telp":"081234567890",
    "jabatan":"Software Engineer",
    "status":"FULL_TIME",
    "tanggal_masuk":"2026-01-01",
    "department_id":1
  }'
```

## Menjalankan Test dan Verifikasi

Smoke test API secara manual:

```bash
curl http://localhost:2000/health
```

Verifikasi schema Prisma:

```bash
cd backend
npm run prisma:validate
```

Setelah login di frontend, halaman `API Docs` dapat digunakan untuk menguji seluruh endpoint yang tersedia. Untuk quality check frontend, jalankan sesuai kebutuhan:

```bash
cd frontend
npm run lint
npm run build
```

## Perintah Backend

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan backend dengan nodemon |
| `npm start` | Menjalankan backend |
| `npm run db:migrate` | Membuat/menjalankan migration development |
| `npm run db:deploy` | Menjalankan migration untuk deployment |
| `npm run db:studio` | Membuka Prisma Studio |
| `npm run db:seed-admin` | Membuat atau memperbarui akun admin |
| `npm run prisma:validate` | Memvalidasi Prisma schema |

## Perintah Frontend

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan Vite development server |
| `npm run build` | Build production |
| `npm run lint` | Menjalankan ESLint |
| `npm run preview` | Preview hasil build |
