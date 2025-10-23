# 🚀 Setup Admin Panel - MT Trans

## ✅ Project Sudah Terpisah!

Admin panel sekarang berada di folder terpisah:
- **User App**: `food-delivery-app/` (port 3000)
- **Admin Panel**: `food-delivery-admin/` (port 3001)

## 📦 Install Dependencies

```bash
cd food-delivery-admin
npm install
```

## 🎯 Run Admin Panel

```bash
# Development mode
npm run dev

# Akses di: http://localhost:3001
# Login dengan admin key: resya123@
```

## 🔑 Login Credentials

- **URL**: http://localhost:3001/login
- **Admin Key**: `resya123@`

## 📋 Next Steps

### 1. Hapus Folder Admin dari User App (Opsional)

```bash
cd ../food-delivery-app

# Hapus folder admin
rmdir /S /Q app\admin
rmdir /S /Q components\admin

# Hapus file admin
del lib\adminApi.ts

# Hapus dari AuthGuard.jsx bagian admin exception
```

### 2. Push ke Repository Terpisah

```bash
cd ../food-delivery-admin

# Init git
git init
git add .
git commit -m "Initial commit: MT Trans Admin Panel"

# Buat repo baru di GitHub (PRIVATE!)
# Lalu push:
git remote add origin https://github.com/YOUR_USERNAME/mt-trans-admin.git
git branch -M main
git push -u origin main
```

### 3. Deploy ke Vercel (Opsional)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

## 🔒 Security Checklist

- [ ] Admin repo adalah **PRIVATE** di GitHub
- [ ] User app dan admin app di repo berbeda
- [ ] Deploy di domain/subdomain berbeda
- [ ] Ganti admin key default (`resya123@`)
- [ ] Backend admin key sama dengan frontend

## 📁 Struktur Project Sekarang

```
Downloads/
├── food-delivery-app/          # User-facing app
│   ├── app/
│   ├── components/
│   └── package.json
│
└── food-delivery-admin/        # Admin panel (PRIVATE)
    ├── app/
    │   ├── page.jsx            # Dashboard
    │   ├── login/page.jsx
    │   ├── users/page.jsx
    │   ├── orders/page.jsx
    │   └── ...
    ├── components/
    │   ├── AdminGuard.jsx
    │   ├── AdminDashboard.jsx
    │   └── ...
    ├── lib/
    │   ├── adminApi.ts
    │   └── config.ts
    └── package.json
```

## 🌐 Recommended Deployment Structure

### Production URLs

- **User App**: https://mttrans.com (Vercel)
- **Admin Panel**: https://admin.mttrans.com (Vercel - Different Project)
- **Backend API**: https://be-mt-trans.vercel.app

### Environment Setup

**User App** (`food-delivery-app`):
- Deploy normally
- Public repository OK

**Admin Panel** (`food-delivery-admin`):
- **PRIVATE repository only!**
- Deploy sebagai project terpisah di Vercel
- Gunakan custom domain: admin.yourdomain.com

## ⚠️ Important Notes

1. **Jangan gabung admin dan user** dalam 1 deployment
2. **Admin key** harus sama antara frontend (`lib/adminApi.ts`) dan backend (`backend/src/admin/admin.controller.ts`)
3. **Selalu gunakan HTTPS** di production
4. **Repository admin harus PRIVATE**

## 🆘 Troubleshooting

### Port sudah terpakai

```bash
# Kill process di port 3001
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F
```

### Dependencies error

```bash
cd food-delivery-admin
rm -rf node_modules package-lock.json
npm install
```

### Build error

```bash
npm run build
# Check error messages
```

## ✅ Verification

Pastikan semua bekerja:

1. [ ] User app jalan di port 3000
2. [ ] Admin panel jalan di port 3001
3. [ ] Bisa login admin dengan key `resya123@`
4. [ ] Data users muncul dari API
5. [ ] Data deliveries muncul dari API
6. [ ] Semua navigasi bekerja
7. [ ] Logout berfungsi

## 🎉 Done!

Admin panel sudah terpisah dan siap untuk di-deploy secara independen!

