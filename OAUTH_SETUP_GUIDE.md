# OAuth Setup Guide - Google

Panduan lengkap untuk mengkonfigurasi OAuth Google untuk aplikasi food delivery.

## 📋 Daftar Isi

1. [Google OAuth Setup](#google-oauth-setup)
2. [Environment Variables](#environment-variables)
3. [Testing](#testing)
4. [Troubleshooting](#troubleshooting)

---

## 🔵 Google OAuth Setup

### 1. Buat OAuth 2.0 Client di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih atau buat project baru
3. Navigasi ke **APIs & Services** → **Credentials**
4. Klik **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Jika belum ada OAuth consent screen, buat terlebih dahulu:
   - Pilih **User Type** (External untuk testing, Internal untuk G Suite)
   - Isi **App name**, **User support email**, **Developer contact information**
   - Tambahkan **Scopes**: `email`, `profile`
   - Tambahkan **Test users** (untuk testing mode)

### 2. Konfigurasi OAuth Client

**Application type:** Web application

**Authorized JavaScript origins:**
```
http://localhost:3000
https://your-frontend-domain.vercel.app
```

**Contoh:**
- Development: `http://localhost:3000`
- Production: `https://your-app-name.vercel.app`

**Authorized redirect URIs:**
```
http://localhost:4000/auth/google/callback
https://be-mt-trans.vercel.app/auth/google/callback
```

**Contoh:**
- Development: `http://localhost:4000/auth/google/callback`
- Production: `https://be-mt-trans.vercel.app/auth/google/callback`

### 3. Simpan Client ID dan Client Secret

Setelah dibuat, Google akan menampilkan:
- **Client ID** (misal: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
- **Client Secret** (misal: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)

**⚠️ PENTING:** Simpan Client Secret dengan aman, tidak bisa dilihat lagi setelah ditutup!

---

## 🔧 Environment Variables

### Frontend (Vercel)

Tambahkan environment variables di **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

```env
# Tidak perlu untuk OAuth (menggunakan API_BASE_URL dari lib/config.ts)
# Tapi jika ingin override, bisa set:
NEXT_PUBLIC_API_URL=https://be-mt-trans.vercel.app
```

### Backend (Vercel)

Tambahkan environment variables di **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GOOGLE_CALLBACK_URL=https://be-mt-trans.vercel.app/auth/google/callback
BACKEND_URL=https://be-mt-trans.vercel.app

# Frontend URL (untuk redirect setelah OAuth) - ⚠️ PENTING!
# Ganti dengan URL frontend production Anda (contoh: https://your-app-name.vercel.app)
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

**⚠️ PENTING:** 
- `FRONTEND_URL` harus diset dengan URL frontend production Anda
- Jika tidak diset, OAuth callback akan redirect ke `localhost:3000` yang menyebabkan error
- Contoh: Jika frontend Anda di `https://mt-trans-app.vercel.app`, maka set `FRONTEND_URL=https://mt-trans-app.vercel.app`

### Development (Local)

Buat file `.env.local` di root frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Buat file `.env` di folder `backend`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
BACKEND_URL=http://localhost:4000

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 🧪 Testing

### Development

1. **Start backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start frontend:**
   ```bash
   npm run dev
   ```

3. **Test OAuth:**
   - Buka `http://localhost:3000/signin`
   - Klik "Continue with Google"
   - Harus redirect ke Google login
   - Setelah login, harus redirect kembali ke aplikasi

### Production

1. **Deploy backend ke Vercel:**
   - Pastikan semua environment variables sudah diset
   - Deploy dan pastikan tidak ada error

2. **Deploy frontend ke Vercel:**
   - Pastikan `NEXT_PUBLIC_API_URL` diset (opsional, karena sudah pakai `API_BASE_URL`)
   - Deploy dan test OAuth flow

3. **Test OAuth di Production:**
   - Buka aplikasi production
   - Klik "Continue with Google"
   - Pastikan redirect ke Google OAuth
   - Pastikan callback berhasil dan redirect ke aplikasi

---

## ❌ Troubleshooting

### Error: "redirect_uri_mismatch"

**Penyebab:** Callback URL di Google OAuth console tidak sama dengan yang digunakan di aplikasi.

**Solusi:**
1. Pastikan callback URL di Google console sama persis dengan yang di environment variables
2. Pastikan tidak ada trailing slash (`/`) yang tidak perlu
3. Pastikan menggunakan `https` untuk production

### Error: "redirect ke localhost padahal di production"

**Penyebab:** Environment variable `FRONTEND_URL` tidak diset di Vercel backend, sehingga backend menggunakan default `http://localhost:3000`.

**Solusi:**
1. **PENTING:** Set `FRONTEND_URL` di Vercel backend environment variables dengan URL frontend production Anda
   - Contoh: `FRONTEND_URL=https://your-app-name.vercel.app`
   - Jangan gunakan `http://localhost:3000` di production!
2. Pastikan `BACKEND_URL` diset di backend Vercel
3. Pastikan `GOOGLE_CALLBACK_URL` menggunakan full URL production
4. Redeploy backend setelah mengubah environment variables
5. Cek di Vercel logs apakah ada warning tentang `FRONTEND_URL` tidak diset

### Error: "Invalid client credentials"

**Penyebab:** Client ID atau Client Secret salah atau tidak diset.

**Solusi:**
1. Pastikan environment variables sudah diset dengan benar
2. Pastikan tidak ada spasi atau karakter yang tidak perlu
3. Untuk Google, pastikan Client Secret dimulai dengan `GOCSPX-`
4. Restart server setelah mengubah environment variables

### Error: "OAuth consent screen not configured"

**Penyebab:** OAuth consent screen belum dikonfigurasi di Google Cloud Console.

**Solusi:**
1. Buka Google Cloud Console
2. Navigasi ke **APIs & Services** → **OAuth consent screen**
3. Lengkapi semua field yang diperlukan
4. Tambahkan scopes: `email`, `profile`
5. Tambahkan test users (jika dalam testing mode)

---

## 📝 Checklist

### Google OAuth
- [ ] OAuth 2.0 Client dibuat di Google Cloud Console
- [ ] OAuth consent screen dikonfigurasi
- [ ] Authorized JavaScript origins ditambahkan (frontend URL)
- [ ] Authorized redirect URIs ditambahkan (backend callback URL)
- [ ] Client ID dan Client Secret disimpan
- [ ] Environment variables diset di backend (production & development)

### Frontend
- [ ] Environment variables diset (opsional, karena sudah pakai `API_BASE_URL`)
- [ ] OAuth button menggunakan `API_BASE_URL` dari `lib/config.ts`
- [ ] Callback page (`/auth/callback`) sudah dibuat

### Backend
- [ ] Environment variables diset (production & development)
- [ ] Google Strategy dikonfigurasi dengan benar
- [ ] Callback route (`/auth/google/callback`) sudah dibuat
- [ ] `FRONTEND_URL` diset untuk redirect setelah OAuth

---

## 🔗 Referensi

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)

---

## 📞 Support

Jika mengalami masalah, pastikan:
1. Semua environment variables sudah diset dengan benar
2. Google OAuth console sudah dikonfigurasi dengan benar
3. Callback URLs menggunakan full URL (termasuk `https://`)
4. Tidak ada typo di environment variables atau OAuth console
5. Server sudah di-restart setelah mengubah environment variables
