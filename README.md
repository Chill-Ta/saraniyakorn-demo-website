# Saraniyakorn Demo Website (ArtsGoz)

ระบบคลังบทความสาราณียกรและแดชบอร์ดบริหารจัดการข้อมูล ArtsGoz (เชื่อมต่อฐานข้อมูล PostgreSQL จริง)

---

## สถาปัตยกรรมระบบ (Architecture)

โปรเจกต์นี้รวมทุกส่วนไว้ในที่เดียว สามารถรันระบบทั้งหมดได้ทันทีผ่าน Docker Compose:

* **Backend API (`artsgoz-backend`):** Go (Gin) + GORM + PostgreSQL (พอร์ต `8080`)
* **Backoffice Dashboard (`apps/artsgoz-backoffice`):** React + Vite + TailwindCSS (พอร์ต `4200`)
  * ภาพรวมสถิติคลังบทความ (`/aksornsara`)
  * สถิติการเข้าชม (`/aksornsara/traffic`)
  * หมวดหมู่ยอดนิยม (`/aksornsara/categories`)
  * ความคิดเห็น (`/aksornsara/comments`)
  * กิจกรรมทั้งหมด (`/aksornsara/activities`)
  * แดชบอร์ดผู้ดูแลระบบ (`/admin`)
  * บันทึกประวัติการทำงาน (`/admin/audit-log`)
* **Frontend เว็บไซต์สาราณียกร (`apps/aksornsara-frontend`):** React + Vite (พอร์ต `4201`)
* **Frontend เว็บหลัก ArtsGoz (`apps/artsgoz-frontend`):** React + Vite (พอร์ต `4300`)
* **Database (`postgres`):** PostgreSQL 16 (พอร์ต `5432`)

---

## วิธีการติดตั้งและรันระบบ (Quick Start)

### 1. โคลน Repository
```bash
git clone https://github.com/Chill-Ta/saraniyakorn-demo-website.git
cd saraniyakorn-demo-website
```

### 2. รันระบบทั้งหมดด้วย Docker Compose
```bash
docker compose up -d --build
```

### 3. เข้าใช้งานระบบ
* **หน้าเว็บไซต์สาราณียกร (Frontend):** [http://localhost:4201](http://localhost:4201)
* **หน้าแดชบอร์ดจัดการบทความ (Backoffice):** [http://localhost:4200](http://localhost:4200)
* **หน้าเว็บหลัก ArtsGoz:** [http://localhost:4300](http://localhost:4300)
* **Backend REST API:** [http://localhost:8080](http://localhost:8080)
* **Database Connection:** `localhost:5433` (User: `user`, Password: `password`, DB: `artsgoz`)
* **User and Password สําหรับ login หน้าแดชบอร์ด : Username: admin: password: password123

---

## โครงสร้างโปรเจกต์
```
.
├── docker-compose.yml          # การตั้งค่ารันคอนเทนเนอร์ทั้งหมด
├── README.md                   # คู่มือการใช้งาน
├── artsgoz-backend/            # Go REST API backend
│   ├── cmd/api/                # Main entrypoint
│   ├── internal/               # Domain services (article, comment, activity, dashboard)
│   ├── migrations/             # Database migrations (0001 - 0007)
│   └── seeds/                  # ข้อมูลเริ่มต้นบทความจริง 170+ รายการ
└── artsgoz-monorepo/           # Frontend monorepo (Nx + Vite)
    └── apps/
        ├── aksornsara-frontend/
        ├── artsgoz-backoffice/
        └── artsgoz-frontend/
```

