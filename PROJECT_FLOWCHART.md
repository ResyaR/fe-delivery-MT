# 🗺️ MT Trans Food Delivery - Flowchart Lengkap Project

## 📋 Daftar Isi
0. [⭐ Flowchart Lengkap (Semua Alur dalam Satu Diagram)](#0-flowchart-lengkap-semua-alur-dalam-satu-diagram)
1. [Gambaran Arsitektur Sistem](#1-gambaran-arsitektur-sistem)
2. [Alur Autentikasi Pengguna](#2-alur-autentikasi-pengguna)
3. [Alur Pemesanan Makanan](#3-alur-pemesanan-makanan)
4. [Alur Proses Order](#4-alur-proses-order)
5. [Alur Admin Panel](#5-alur-admin-panel)
6. [Struktur Backend API](#6-struktur-backend-api)
7. [Alur Layanan Pengiriman](#7-alur-layanan-pengiriman)

---

## 0. ⭐ Flowchart Terpisah (3 Flowchart Fokus)

**Rekomendasi: Gunakan 3 flowchart terpisah ini untuk memahami alur sistem dengan lebih fokus!**

Flowchart telah dipecah menjadi 3 bagian terpisah untuk memudahkan pemahaman:

### 👤 **Flowchart User Flow** (Section 0 di MERMAID_LIVE_EDITOR.md)
- ✅ Alur Autentikasi (Login, Registrasi, OTP)
- ✅ Alur Pemesanan Makanan (Browse, Cart, Checkout)
- ✅ Alur Profile (Edit Profile, Kelola Alamat, Ubah Password)
- ✅ Alur Orders (Lihat Orders, Detail Order, Lacak Order)

### 🔧 **Flowchart Admin Flow** (Section 1 di MERMAID_LIVE_EDITOR.md)
- ✅ Login Admin
- ✅ Dashboard Analytics
- ✅ Manajemen Orders (Lihat, Detail, Update Status)
- ✅ Manajemen Users (Lihat, Detail, Toggle Status)
- ✅ Manajemen Restaurants (Lihat, Edit, Kelola Menu)
- ✅ Pelacakan Deliveries
- ✅ Analytics Dashboard
- ✅ Manajemen Ongkir
- ✅ Settings

### 🚚 **Flowchart Shipping Flow** (Section 2 di MERMAID_LIVE_EDITOR.md)
- ✅ Cek Ongkir (Kirim Barang)
- ✅ Ekspedisi Lokal
- ✅ Multi Drop
- ✅ Tracking Pengiriman (Pending → Assigned → Picked Up → In Transit → Delivered)

**Lihat file `MERMAID_LIVE_EDITOR.md` untuk 3 flowchart terpisah yang bisa langsung di-copy ke Mermaid Live Editor.**
**Atau lihat file `FLOWCHART_LENGKAP.md` untuk versi lengkap dengan penjelasan.**

---

## 1. Gambaran Arsitektur Sistem

```mermaid
graph TB
    subgraph "Aplikasi Frontend"
        A[Aplikasi User<br/>https://fe-delivery-mt.vercel.app<br/>Next.js]
        B[Panel Admin<br/>https://mt-admin.vercel.app<br/>Next.js]
    end
    
    subgraph "Backend API"
        C[API NestJS<br/>https://be-mt-trans.vercel.app]
        D[Database<br/>PostgreSQL]
        E[ORM<br/>TypeORM]
    end
    
    subgraph "Layanan Eksternal"
        F[Layanan Email<br/>Verifikasi OTP]
        G[Penyedia OAuth<br/>Google]
        H[Penyimpanan File]
    end
    
    A -->|REST API| C
    B -->|REST API| C
    C -->|Query Database| E
    E -->|Koneksi| D
    C -->|Kirim OTP| F
    C -->|Login OAuth| G
    C -->|Upload File| H
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#e8f5e9
    style D fill:#f3e5f5
```

---

## 2. Alur Autentikasi Pengguna

```mermaid
flowchart TD
    Start([Pengguna Membuka Aplikasi]) --> CheckAuth{Pengguna<br/>Sudah Login?}
    
    CheckAuth -->|Tidak| ShowHome[Tampilkan Halaman Utama]
    CheckAuth -->|Ya| ShowDashboard[Tampilkan Dashboard]
    
    ShowHome --> UserAction{Aksi Pengguna}
    UserAction -->|Klik Masuk| SignInPage[Halaman Masuk]
    UserAction -->|Klik Daftar| SignUpPage[Halaman Daftar]
    UserAction -->|Jelajahi| BrowseFood[Jelajahi Makanan]
    
    SignInPage --> InputCredentials[Input Email/Password]
    InputCredentials --> ValidateInput{Input<br/>Valid?}
    ValidateInput -->|Tidak| ShowError[Tampilkan Error]
    ValidateInput -->|Ya| CallAPI[Panggil Auth API]
    
    CallAPI --> CheckResponse{Status<br/>Response?}
    CheckResponse -->|Berhasil| StoreToken[Simpan JWT Token]
    CheckResponse -->|Error| ShowError
    
    StoreToken --> RedirectHome[Redirect ke Home]
    
    SignUpPage --> InputRegData[Input Data Registrasi]
    InputRegData --> ValidateReg{Data<br/>Valid?}
    ValidateReg -->|Tidak| ShowError
    ValidateReg -->|Ya| CallRegAPI[Panggil Register API]
    
    CallRegAPI --> SendOTP[Kirim OTP ke Email]
    SendOTP --> VerifyOTPPage[Halaman Verifikasi OTP]
    VerifyOTPPage --> InputOTP[Input Kode OTP]
    InputOTP --> VerifyOTPAPI[Verifikasi OTP API]
    
    VerifyOTPAPI --> OTPValid{OTP<br/>Valid?}
    OTPValid -->|Ya| ActivateUser[Aktifkan Akun Pengguna]
    OTPValid -->|Tidak| ShowError
    
    ActivateUser --> StoreToken
    
    BrowseFood --> CheckAuthRequired{Perlu<br/>Login?}
    CheckAuthRequired -->|Tidak| ShowFood[Tampilkan Daftar Makanan]
    CheckAuthRequired -->|Ya| SignInPage
    
    ShowError --> UserAction
    
    style Start fill:#e1f5ff
    style StoreToken fill:#c8e6c9
    style ShowError fill:#ffcdd2
```

---

## 3. Alur Pemesanan Makanan

```mermaid
flowchart TD
    Start([Pengguna di Halaman Utama]) --> BrowseFood[Halaman Jelajahi Makanan]
    
    BrowseFood --> DetectLocation[Deteksi Lokasi Pengguna<br/>Alamat Default/Geolocation]
    DetectLocation --> FilterRestaurants[Filter Restaurant Berdasarkan Kota]
    FilterRestaurants --> ShowRestaurants[Tampilkan Daftar Restaurant]
    
    ShowRestaurants --> UserAction{Aksi Pengguna}
    UserAction -->|Cari| SearchRestaurants[Cari Restaurant]
    UserAction -->|Pilih Kategori| FilterByCategory[Filter Berdasarkan Kategori]
    UserAction -->|Klik Restaurant| ViewRestaurant[Lihat Detail Restaurant]
    
    SearchRestaurants --> ShowRestaurants
    FilterByCategory --> ShowRestaurants
    
    ViewRestaurant --> ShowMenu[Tampilkan Menu Restaurant]
    ShowMenu --> AddToCart[Tambahkan Item ke Keranjang]
    
    AddToCart --> UpdateCart[Update Cart Context]
    UpdateCart --> ShowCartIcon[Update Badge Icon Keranjang]
    
    ShowCartIcon --> ContinueShopping{Lanjut<br/>Belanja?}
    ContinueShopping -->|Ya| BrowseFood
    ContinueShopping -->|Tidak| ViewCart[Halaman Keranjang]
    
    ViewCart --> CheckAuth{Pengguna<br/>Sudah Login?}
    CheckAuth -->|Tidak| RedirectSignIn[Redirect ke Masuk]
    CheckAuth -->|Ya| SelectAddress[Pilih Alamat Pengiriman]
    
    SelectAddress --> LoadAddresses[Muat Alamat Tersimpan]
    LoadAddresses --> AddressOptions{Pilihan<br/>Alamat}
    AddressOptions -->|Gunakan Tersimpan| SelectSaved[Pilih Alamat Tersimpan]
    AddressOptions -->|Tambah Baru| AddNewAddress[Form Tambah Alamat Baru]
    
    AddNewAddress --> SaveAddress[Simpan Alamat dengan<br/>Nama Penerima]
    SaveAddress --> SelectSaved
    
    SelectSaved --> CalculateFee[Hitung Biaya Pengiriman<br/>Rp 15.000]
    CalculateFee --> CalculateAppFee[Hitung Biaya Aplikasi<br/>10% dari Subtotal]
    CalculateAppFee --> ShowTotal[Tampilkan Total Harga]
    
    ShowTotal --> ProceedCheckout[Lanjut ke Checkout]
    
    ProceedCheckout --> ReviewOrder[Tinjau Detail Order]
    ReviewOrder --> ConfirmOrder[Konfirmasi Order]
    
    ConfirmOrder --> CreateOrderAPI[Buat Order API]
    CreateOrderAPI --> OrderCreated{Order<br/>Berhasil Dibuat?}
    OrderCreated -->|Berhasil| ClearCart[Bersihkan Keranjang]
    OrderCreated -->|Error| ShowError[Tampilkan Pesan Error]
    
    ClearCart --> ShowSuccess[Tampilkan Halaman Sukses]
    ShowSuccess --> ViewOrders[Halaman Order]
    
    ShowError --> ReviewOrder
    
    style Start fill:#e1f5ff
    style ShowSuccess fill:#c8e6c9
    style ShowError fill:#ffcdd2
    style CreateOrderAPI fill:#fff9c4
```

---

## 4. Alur Proses Order

```mermaid
flowchart TD
    Start([Order Dibuat]) --> ValidateOrder[Validasi Data Order]
    
    ValidateOrder --> CheckRestaurant{Restaurant<br/>Ada?}
    CheckRestaurant -->|Tidak| RejectOrder[Tolak Order]
    CheckRestaurant -->|Ya| CalculateSubtotal[Hitung Subtotal]
    
    CalculateSubtotal --> CalculateDeliveryFee[Hitung Biaya Pengiriman<br/>Rp 15.000]
    CalculateDeliveryFee --> CalculateAppFee[Hitung Biaya Aplikasi<br/>10% dari Subtotal]
    CalculateAppFee --> CalculateTotal[Hitung Total<br/>Subtotal + Pengiriman + Biaya Aplikasi]
    
    CalculateTotal --> GenerateOrderNumber[Generate Nomor Order<br/>MT-XXXXXX]
    GenerateOrderNumber --> CheckUnique{Nomor Order<br/>Unik?}
    CheckUnique -->|Tidak| GenerateOrderNumber
    CheckUnique -->|Ya| AssignShippingManager[Assign Shipping Manager<br/>Berdasarkan Zone]
    
    AssignShippingManager --> CreateOrderItems[Buat Order Items]
    CreateOrderItems --> SaveOrder[Simpan Order ke Database]
    
    SaveOrder --> OrderStatus{Status<br/>Order}
    OrderStatus -->|Pending| NotifyRestaurant[Notifikasi Restaurant]
    OrderStatus -->|Confirmed| PrepareFood[Restaurant Menyiapkan Makanan]
    OrderStatus -->|Preparing| AssignDriver[Assign Driver]
    OrderStatus -->|On The Way| TrackDelivery[Lacak Pengiriman]
    OrderStatus -->|Delivered| CompleteOrder[Selesai Order]
    OrderStatus -->|Cancelled| CancelOrder[Batal Order]
    
    NotifyRestaurant --> WaitConfirmation[Tunggu Konfirmasi<br/>Restaurant]
    WaitConfirmation --> RestaurantAction{Aksi<br/>Restaurant}
    RestaurantAction -->|Terima| PrepareFood
    RestaurantAction -->|Tolak| CancelOrder
    
    PrepareFood --> UpdateStatusPreparing[Update Status: Menyiapkan]
    UpdateStatusPreparing --> AssignDriver
    
    AssignDriver --> UpdateStatusOnWay[Update Status: Dalam Perjalanan]
    UpdateStatusOnWay --> TrackDelivery
    
    TrackDelivery --> DeliveryComplete{Pengiriman<br/>Selesai?}
    DeliveryComplete -->|Ya| CompleteOrder
    DeliveryComplete -->|Tidak| TrackDelivery
    
    CompleteOrder --> UpdateStatusDelivered[Update Status: Terkirim]
    UpdateStatusDelivered --> NotifyUser[Notifikasi Pengguna]
    
    CancelOrder --> RefundProcess[Proses Refund jika Sudah Bayar]
    RefundProcess --> UpdateStatusCancelled[Update Status: Dibatalkan]
    
    style Start fill:#e1f5ff
    style CompleteOrder fill:#c8e6c9
    style CancelOrder fill:#ffcdd2
    style SaveOrder fill:#fff9c4
```

---

## 5. Alur Admin Panel

```mermaid
flowchart TD
    Start([Admin Membuka Panel]) --> AdminLogin[Halaman Login Admin]
    
    AdminLogin --> InputAdminCreds[Input Kredensial Admin]
    InputAdminCreds --> ValidateAdmin{Admin<br/>Valid?}
    ValidateAdmin -->|Tidak| ShowError[Tampilkan Error]
    ValidateAdmin -->|Ya| AdminDashboard[Dashboard Admin]
    
    AdminDashboard --> AdminMenu{Menu<br/>Admin}
    
    AdminMenu -->|Orders| OrdersPage[Manajemen Orders]
    AdminMenu -->|Users| UsersPage[Manajemen Users]
    AdminMenu -->|Restaurants| RestaurantsPage[Manajemen Restaurants]
    AdminMenu -->|Deliveries| DeliveriesPage[Pelacakan Deliveries]
    AdminMenu -->|Analytics| AnalyticsPage[Dashboard Analytics]
    AdminMenu -->|Ongkir| OngkirPage[Manajemen Ongkir]
    AdminMenu -->|Settings| SettingsPage[Pengaturan]
    
    OrdersPage --> ViewOrders[Lihat Semua Orders]
    ViewOrders --> OrderAction{Aksi<br/>Order}
    OrderAction -->|Lihat Detail| ViewOrderDetails[Lihat Detail Order<br/>- Nama Penerima<br/>- Label Alamat<br/>- Alamat Lengkap<br/>- Biaya Aplikasi]
    OrderAction -->|Update Status| UpdateOrderStatus[Update Status Order]
    OrderAction -->|Filter| FilterOrders[Filter Orders]
    
    ViewOrderDetails --> OrderDetailsModal[Modal Detail Order<br/>Info Alamat Lengkap]
    
    UpdateOrderStatus --> SaveStatus[Simpan Status ke Database]
    SaveStatus --> RefreshOrders[Refresh Daftar Orders]
    
    UsersPage --> ViewUsers[Lihat Semua Users]
    ViewUsers --> UserAction{Aksi<br/>User}
    UserAction -->|Lihat Detail| ViewUserDetails[Lihat Detail User]
    UserAction -->|Aktifkan/Nonaktifkan| ToggleUserStatus[Toggle Status User]
    
    RestaurantsPage --> ViewRestaurants[Lihat Semua Restaurants]
    ViewRestaurants --> RestaurantAction{Aksi<br/>Restaurant}
    RestaurantAction -->|Lihat Detail| ViewRestaurantDetails[Lihat Detail Restaurant]
    RestaurantAction -->|Edit| EditRestaurant[Edit Restaurant]
    RestaurantAction -->|Lihat Menu| ViewMenus[Lihat Menu Restaurant]
    
    DeliveriesPage --> ViewDeliveries[Lihat Semua Deliveries]
    ViewDeliveries --> DeliveryAction{Aksi<br/>Delivery}
    DeliveryAction -->|Lacak| TrackDelivery[Lacak Pengiriman]
    DeliveryAction -->|Update Status| UpdateDeliveryStatus[Update Status Delivery]
    
    AnalyticsPage --> ViewAnalytics[Lihat Chart Analytics<br/>- Pendapatan<br/>- Orders<br/>- Users<br/>- Restaurants]
    
    OngkirPage --> OngkirMenu{Menu<br/>Ongkir}
    OngkirMenu -->|Provinces| ManageProvinces[Kelola Provinsi]
    OngkirMenu -->|Cities| ManageCities[Kelola Kota]
    OngkirMenu -->|Services| ManageServices[Kelola Layanan]
    OngkirMenu -->|Calculator| OngkirCalculator[Kalkulator Ongkir]
    
    SettingsPage --> SettingsMenu{Menu<br/>Pengaturan}
    SettingsMenu -->|Payment Methods| PaymentSettings[Metode Pembayaran<br/>Hanya Cash on Delivery]
    
    ShowError --> AdminLogin
    
    style Start fill:#e1f5ff
    style AdminDashboard fill:#fff4e1
    style ViewOrderDetails fill:#c8e6c9
    style ShowError fill:#ffcdd2
```

---

## 6. Struktur Backend API

```mermaid
graph TB
    subgraph "Backend NestJS"
        A[App Module]
        
        subgraph "Modul Auth"
            A1[Auth Controller]
            A2[Auth Service]
            A3[JWT Strategy]
            A4[Google Strategy]
            A5[OTP Service]
            A6[Email Service]
        end
        
        subgraph "Modul User"
            U1[User Controller]
            U2[User Service]
            U3[User Entity]
        end
        
        subgraph "Modul Restaurant"
            R1[Restaurant Controller]
            R2[Restaurant Service]
            R3[Restaurant Entity]
        end
        
        subgraph "Modul Menu"
            M1[Menu Controller]
            M2[Menu Service]
            M3[Menu Entity]
        end
        
        subgraph "Modul Cart"
            C1[Cart Controller]
            C2[Cart Service]
            C3[Cart Entity]
            C4[Cart Item Entity]
        end
        
        subgraph "Modul Order"
            O1[Order Controller]
            O2[Order Service]
            O3[Order Entity]
            O4[Order Item Entity]
        end
        
        subgraph "Modul Address"
            AD1[Address Controller]
            AD2[Address Service]
            AD3[Address Entity]
        end
        
        subgraph "Modul Delivery"
            D1[Delivery Controller]
            D2[Delivery Service]
            D3[Delivery Entity]
        end
        
        subgraph "Modul Ongkir"
            ON1[Ongkir Controller]
            ON2[Ongkir Service]
        end
        
        subgraph "Modul Admin"
            ADM1[Admin Controller]
            ADM2[Admin Service]
        end
        
        subgraph "Modul Shipping Manager"
            SM1[Shipping Manager Controller]
            SM2[Shipping Manager Service]
            SM3[Shipping Manager Entity]
        end
    end
    
    A --> A1
    A --> U1
    A --> R1
    A --> M1
    A --> C1
    A --> O1
    A --> AD1
    A --> D1
    A --> ON1
    A --> ADM1
    A --> SM1
    
    A1 --> A2
    A2 --> A3
    A2 --> A4
    A2 --> A5
    A2 --> A6
    
    U1 --> U2
    U2 --> U3
    
    R1 --> R2
    R2 --> R3
    
    M1 --> M2
    M2 --> M3
    
    C1 --> C2
    C2 --> C3
    C2 --> C4
    
    O1 --> O2
    O2 --> O3
    O2 --> O4
    O2 --> R2
    O2 --> SM2
    
    AD1 --> AD2
    AD2 --> AD3
    
    D1 --> D2
    D2 --> D3
    
    ON1 --> ON2
    
    ADM1 --> ADM2
    
    SM1 --> SM2
    SM2 --> SM3
    
    style A fill:#e1f5ff
    style A2 fill:#fff9c4
    style O2 fill:#c8e6c9
```

---

## 7. Alur Layanan Pengiriman

```mermaid
flowchart TD
    Start([Pengguna Butuh Pengiriman]) --> ServiceType{Jenis<br/>Layanan?}
    
    ServiceType -->|Food Delivery| FoodFlow[Alur Order Makanan]
    ServiceType -->|Kirim Barang| CekOngkir[Halaman Cek Ongkir]
    ServiceType -->|Ekspedisi Lokal| EkspedisiFlow[Alur Ekspedisi]
    ServiceType -->|Multi Drop| MultiDropFlow[Alur Multi Drop]
    
    CekOngkir --> InputOrigin[Input Alamat Asal]
    InputOrigin --> InputDestination[Input Alamat Tujuan]
    InputDestination --> SelectService[Pilih Layanan Pengiriman]
    SelectService --> CalculateOngkir[Hitung Biaya Ongkir]
    CalculateOngkir --> ShowCost[Tampilkan Biaya Pengiriman]
    
    ShowCost --> UserDecision{Keputusan<br/>Pengguna}
    UserDecision -->|Pesan Pengiriman| CreateDelivery[Buat Order Pengiriman]
    UserDecision -->|Batal| BackToHome[Kembali ke Home]
    
    CreateDelivery --> ValidateAddress{Alamat<br/>Valid?}
    ValidateAddress -->|Tidak| ShowError[Tampilkan Error]
    ValidateAddress -->|Ya| SaveDelivery[Simpan Order Pengiriman]
    
    SaveDelivery --> AssignDriver[Assign Driver]
    AssignDriver --> TrackDelivery[Lacak Status Pengiriman]
    
    EkspedisiFlow --> InputPackageInfo[Input Info Paket<br/>- Berat<br/>- Dimensi<br/>- Nilai]
    InputPackageInfo --> CalculateEkspedisi[Hitung Biaya Ekspedisi]
    CalculateEkspedisi --> ShowEkspedisiCost[Tampilkan Biaya Ekspedisi]
    ShowEkspedisiCost --> UserDecision
    
    MultiDropFlow --> InputMultipleDestinations[Input Beberapa Tujuan]
    InputMultipleDestinations --> CalculateMultiDrop[Hitung Biaya Multi Drop]
    CalculateMultiDrop --> ShowMultiDropCost[Tampilkan Biaya Multi Drop]
    ShowMultiDropCost --> UserDecision
    
    TrackDelivery --> DeliveryStatus{Status<br/>Pengiriman}
    DeliveryStatus -->|Pending| WaitAssignment[Tunggu Assignment Driver]
    DeliveryStatus -->|Assigned| DriverOnWay[Driver Dalam Perjalanan]
    DeliveryStatus -->|Picked Up| InTransit[Dalam Perjalanan]
    DeliveryStatus -->|Delivered| DeliveryComplete[Pengiriman Selesai]
    
    WaitAssignment --> AssignDriver
    DriverOnWay --> UpdateStatus[Update Status]
    InTransit --> UpdateStatus
    UpdateStatus --> TrackDelivery
    
    DeliveryComplete --> GenerateResi[Generate Kode Resi]
    GenerateResi --> NotifyUser[Notifikasi Pengguna]
    
    FoodFlow --> FoodOrderFlow[Ke Alur Order Makanan]
    
    ShowError --> CekOngkir
    
    style Start fill:#e1f5ff
    style DeliveryComplete fill:#c8e6c9
    style ShowError fill:#ffcdd2
```

---

## 📊 ERD Database Lengkap

**Entity Relationship Diagram lengkap untuk seluruh sistem MT Trans Food Delivery**

ERD ini menampilkan semua entities, atribut, dan relasi dalam sistem:

### Core Entities
- **USERS** - Pengguna aplikasi dengan autentikasi lengkap
- **ADDRESSES** - Alamat pengguna dengan nama penerima
- **RESTAURANTS** - Restaurant dengan rating dan status
- **MENUS** - Menu restaurant dengan kategori dan ketersediaan
- **CARTS** - Keranjang belanja pengguna
- **CART_ITEMS** - Item dalam keranjang
- **ORDERS** - Pesanan dengan detail lengkap
- **ORDER_ITEMS** - Item dalam pesanan
- **DELIVERIES** - Pengiriman dengan berbagai tipe
- **MULTI_DROP_LOCATIONS** - Lokasi multi drop
- **SHIPPING_MANAGERS** - Shipping manager per zone
- **DRIVERS** - Driver pengiriman dengan tracking

### Auth & Security Entities
- **OTP_VERIFICATIONS** - Verifikasi OTP untuk registrasi
- **PENDING_USERS** - User yang belum verifikasi
- **TOKEN_BLACKLIST** - Token yang di-blacklist

### Ongkir Entities
- **ONGKIR_CITIES** - Kota dengan zone dan multiplier
- **ONGKIR_SERVICES** - Layanan ongkir (Reguler, Express, Ekonomis)
- **ONGKIR_PRICING** - Pricing antar kota
- **ONGKIR_ZONE_TARIFFS** - Tarif antar zone

**Lihat ERD lengkap di:**
- **MERMAID_LIVE_EDITOR.md** - Section 8: ERD Database Lengkap
- **FLOWCHART_LENGKAP.md** - Section 3: ERD Database Lengkap

ERD lengkap mencakup semua atribut, primary keys (PK), foreign keys (FK), unique keys (UK), dan relasi dengan cardinality yang benar.

---

## 🔄 Perjalanan Lengkap Pengguna

```mermaid
journey
    title Perjalanan Lengkap Pengguna - Food Delivery
    section Registrasi
      Kunjungi Halaman Utama: 5: Pengguna
      Klik Daftar: 4: Pengguna
      Isi Form Registrasi: 3: Pengguna
      Terima Email OTP: 4: Sistem
      Verifikasi OTP: 5: Pengguna
      Akun Diaktifkan: 5: Sistem
    section Jelajahi Makanan
      Jelajahi Restaurant: 5: Pengguna
      Filter Berdasarkan Lokasi: 4: Pengguna
      Lihat Menu Restaurant: 5: Pengguna
      Tambahkan Item ke Keranjang: 5: Pengguna
    section Checkout
      Lihat Keranjang: 4: Pengguna
      Pilih Alamat: 4: Pengguna
      Tinjau Order: 5: Pengguna
      Konfirmasi Order: 5: Pengguna
      Order Dibuat: 5: Sistem
    section Pelacakan Order
      Order Dikonfirmasi: 4: Sistem
      Restaurant Menyiapkan: 3: Restaurant
      Driver Diassign: 4: Sistem
      Dalam Perjalanan: 5: Driver
      Terkirim: 5: Sistem
      Beri Rating Order: 4: Pengguna
```

---

## 📝 Catatan

- **Aplikasi Frontend User**: Aplikasi Next.js untuk pengguna akhir
- **Panel Admin**: Aplikasi Next.js terpisah untuk manajemen admin
- **Backend API**: REST API NestJS
- **Database**: PostgreSQL dengan TypeORM
- **Autentikasi**: Token JWT (24 jam akses, 30 hari refresh) + verifikasi OTP
- **Pembayaran**: Hanya Cash on Delivery
- **Biaya Pengiriman**: Tarif flat Rp 15.000 untuk food delivery
- **Biaya Aplikasi**: 10% dari subtotal
- **Format Nomor Order**: MT-XXXXXX (alphanumeric)

---

**Dibuat untuk Project MT Trans Food Delivery**
**Terakhir Diupdate**: 2025
