# P2R Development Context

Dokumen ini berfungsi sebagai **Handoff Context** resmi untuk developer / AI agent berikutnya yang melanjutkan pengembangan frontend website **"Pixel To Reality: Cyber Arcade"**. Seluruh informasi di bawah ini disusun berdasarkan audit aktual source code dan arsitektur sistem per 22 Agustus 2026.

---

## 1. Project Overview

- **Nama Project**: Pixel To Reality (P2R) — *The Cyber Arcade*
- **Tujuan Website**: Portal pameran interaktif untuk karya siswa/mahasiswa RPL (Game, Website, Software, IoT/Hardware, Digital Art), sarana Dana Usaha & penjualan merchandise pameran, live chat support CS, papan klasemen (leaderboard), serta portal berita/info terkini pameran.
- **Peta Repository & Peran**:
  1. **`p2r-web`** (`/home/zann/p2r-web`): **Frontend Production Utama** untuk pengunjung publik pameran. Menampilkan landing page, showcase karya, katalog merchandise & checkout, leaderboard, dan live chat.
  2. **`p2r-panel`** (`/home/zann/pixel2reality/p2r-panel`): **Admin Control Center** (Port 3002) untuk panitia pameran (verifikasi pembayaran, manajemen pesanan, CRUD produk & karya, kurasi feeds, moderasi live chat CS, dan manajemen pengguna).
  3. **`p2r-testbed`** (`/home/zann/pixel2reality/p2r-testbed`): **Client Reference / Testbed** (Port 3001) yang berisi implementasi logika cart, chat playground, dan API helper yang sudah teruji.
  4. **`p2r-api`** (`/home/zann/pixel2reality/p2r-api`): **Backend REST API** berbasis Laravel 13 (Port 8090, API prefix `/p2r/v1`) yang melayani database PostgreSQL, Redis cache, dan real-time WebSockets Reverb (Port 8080).

---

## 2. Current Architecture

Hubungan antar aplikasi dalam ekosistem Pixel To Reality:

```
                      ┌────────────────────────────────────────┐
                      │          Browser Pengunjung            │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                 ┌──────────────────────────────────────────────────┐
                 │       p2r-web (PRODUCTION FRONTEND PUBLIK)       │
                 │   Next.js 16 (App Router) · React 19 · TS · CSS  │
                 └──────────────┬───────────────────┬───────────────┘
                                │ (REST API / JSON) │ (WebSockets)
                                ▼                   ▼
   ┌───────────────────────────────────┐    ┌────────────────────────┐
   │        p2r-api (BACKEND)          │    │ Laravel Reverb (WS)    │
   │  Laravel 13 · PHP 8.3+ · Port 8090│◄───┤ Port 8080              │
   │  Base URL: /p2r/v1                │    └────────────────────────┘
   └──────────────▲────────────────────┘
                  │ (BFF Proxy & Token Auth)
   ┌──────────────┴────────────────────┐
   │     p2r-panel (ADMIN PANEL)       │
   │  Next.js 16 · Port 3002           │
   └───────────────────────────────────┘

   ┌───────────────────────────────────┐
   │     p2r-testbed (REFERENCE)       │ ──► [Sumber referensi logika: Cart, Chat, Feeds]
   └───────────────────────────────────┘
```

- **Production Target**: `p2r-web` adalah frontend publik yang akan di-deploy ke production.
- **Reference / Testbed**: `p2r-testbed` berfungsi sebagai referensi logika (cart state, websockets client, feeds parser) yang dapat diadaptasi ke dalam `p2r-web`.
- **Backend Single Source of Truth**: Seluruh data operasional dikelola oleh `p2r-api`.

---

## 3. Production Frontend (`p2r-web`)

Detail kondisi repositori `/home/zann/p2r-web` saat ini:

- **Framework**: Next.js `16.3.0` (App Router)
- **React**: React `^19.2.4` / React DOM `^19.2.4`
- **Language**: TypeScript `5.7.3` (`tsconfig.json`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss: ^4.3.3`, `tw-animate-css: ^1.4.0`)
- **UI Primitives**: `@base-ui/react`, `shadcn`, `lucide-react`, `cva`, `clsx`, `tailwind-merge`
- **Typography / Font**: Google Font `Jersey 15` (Pixel Font) via `next/font/google` (`variable: --font-jersey`)
- **Struktur Folder Utama**:
  ```
  p2r-web/
  ├── __tests__/           # Jest unit & component tests (7 suites)
  ├── app/                 # Next.js App Router (layout.tsx, page.tsx, globals.css)
  ├── components/          # Komponen UI landing page & modal
  │   └── ui/              # Primitive shadcn/cva button
  ├── docs/                # Dokumentasi arsitektur & context handoff
  ├── lib/
  │   ├── api/             # API client, config, endpoints, & response types
  │   ├── games/           # Server data fetcher & mapper untuk Game Karyas
  │   ├── content.ts       # Fallback data & copywriting statis
  │   └── utils.ts         # Utility class merging (clsx + tw-merge)
  └── public/              # Aset statis & logo investor (Agate, Aice, Indomie, Kabayan)
  ```
- **API Client**: Terpusat di `lib/api/client.ts` (`apiGet<T>`) dengan caching `next: { revalidate: 60 }` dan konfigurasi environment `NEXT_PUBLIC_P2R_API_BASE_URL` di `lib/api/config.ts`.
- **Testing**: Jest 30 + React Testing Library (`jest.config.ts`, `jest.setup.ts`). 6 dari 7 test suites lulus (36 passing assertions).

---

## 4. Existing Features (Sudah Tersedia)

Fitur yang sudah diimplementasikan di `p2r-web`:
1. **Landing Page Shell**: Header navbar, hero section, about section, game showcase section, merchandise grid, dan investor footer tersusun rapi di [`app/page.tsx`](file:///home/zann/p2r-web/app/page.tsx).
2. **Dynamic Arcade Logo**: Rendering teks melengkung matematis pada komponen [`ArcadeLogo.tsx`](file:///home/zann/p2r-web/components/ArcadeLogo.tsx).
3. **Hero Section + Interactive CTA**: Headline besar bergaya arcade, deskripsi, dan tombol CTA 3D pixel shadow di [`Hero.tsx`](file:///home/zann/p2r-web/components/Hero.tsx) & [`ExploreButton.tsx`](file:///home/zann/p2r-web/components/ExploreButton.tsx).
4. **About RPL Section**: Pengenalan jurusan dengan running ticker banner [`Marquee.tsx`](file:///home/zann/p2r-web/components/Marquee.tsx), pembatas bergerigi [`PixelDivider.tsx`](file:///home/zann/p2r-web/components/PixelDivider.tsx), dan [`RplEmblem.tsx`](file:///home/zann/p2r-web/components/RplEmblem.tsx).
5. **Live Game Showcase**: Komponen async server [`Games.tsx`](file:///home/zann/p2r-web/components/Games.tsx) yang mengambil data dari API `GET /p2r/v1/karyas?category=game` via [`getGames.ts`](file:///home/zann/p2r-web/lib/games/getGames.ts) dengan graceful fallback ke data statis.
6. **Accessible Game Card**: Card interaktif zigzag dengan artwork miring 3D, deskripsi, dan keyboard accessibility (`Enter`/`Space`) di [`GameCard.tsx`](file:///home/zann/p2r-web/components/GameCard.tsx).
7. **Merchandise Section UI**: Grid display produk dengan generator border spiral SVG di [`MerchandiseCard.tsx`](file:///home/zann/p2r-web/components/MerchandiseCard.tsx).
8. **Modal Order Form (UI)**: Dialog form pemesanan merchandise (Nama, Jurusan, Kelas, No. HP) di [`Order.tsx`](file:///home/zann/p2r-web/components/Order.tsx).
9. **Modal Chat Admin (UI Mockup)**: Dialog simulasi chat CS di [`ChatAdmin.tsx`](file:///home/zann/p2r-web/components/ChatAdmin.tsx).
10. **Investor / Sponsor Footer**: Footer resmi menampilkan logo partner (Agate, Aice, Indomie, Kabayan) dan copyright di [`Footer.tsx`](file:///home/zann/p2r-web/components/Footer.tsx).

---

## 5. Missing / Partial Features (Perlu Dilanjutkan)

1. **Merchandise API Integration (PARTIAL)**:
   - Saat ini grid di [`MerchandiseSection.tsx`](file:///home/zann/p2r-web/components/MerchandiseSection.tsx) masih menggunakan perulangan array hardcoded `[3, 4, 5]`. Perlu dihubungkan ke `GET /p2r/v1/products`.
2. **End-to-End Order & Checkout (PARTIAL / MOCK)**:
   - Form di [`Order.tsx`](file:///home/zann/p2r-web/components/Order.tsx) baru menampilkan `alert()` saat submit. Belum terhubung ke endpoint `/checkout`, `/payment`, dan upload bukti transfer.
3. **Live Chat WebSockets (PARTIAL / MOCK)**:
   - Dialog [`ChatAdmin.tsx`](file:///home/zann/p2r-web/components/ChatAdmin.tsx) masih berisi balon chat statis. Perlu integrasi ke `POST /p2r/v1/chat/start`, `POST /p2r/v1/chat/send`, dan listener Laravel Echo (Reverb).
4. **Multi-Category Karya Showcase (TODO)**:
   - Saat ini baru memfilter kategori `game`. Kategori `website`, `software`, `hardware_robotics`, dan `digital_art` belum ditampilkan.
5. **Public Voting Interaktif (TODO)**:
   - Field `votes_count` sudah ada di response type, tetapi UI tombol Like/Vote interaktif belum dipasang.
6. **Leaderboard Section / Page (TODO)**:
   - Belum ada tampilan klasemen skor arcade game dan ranking vote karya.
7. **Info Terkini / Feeds (TODO)**:
   - Belum ada komponen penampil berita/media feeds pameran.
8. **Test Stabilization & Copywriting Fix (TODO)**:
   - Memperbaiki 1 assertion minor di [`__tests__/Hero.test.tsx`](file:///home/zann/p2r-web/__tests__/Hero.test.tsx).
   - Mengganti teks placeholder *"Lorem Ipsum"* dan typo navigasi (*"Marchandise"*, *"Shoping"*) di [`lib/content.ts`](file:///home/zann/p2r-web/lib/content.ts).

---

## 6. Design & UI/UX Rules (SANGAT PENTING)

> [!IMPORTANT]
> **ATURAN MUTLAK DESAIN:**
> - Frontend `p2r-web` adalah hasil karya dan desain orisinal dari tim Pixel To Reality.
> - **JANGAN melakukan REDESIGN.**
> - **JANGAN mengganti karakter visual** retro arcade yang sudah dibangun.
> - **JANGAN mengganti palette warna atau font** tanpa instruksi eksplisit.
> - Seluruh perubahan harus dilakukan secara **inkremental** dengan memprioritaskan **reuse existing components**.
> - Hanya tambahkan atau sesuaikan elemen yang mutlak diperlukan agar fitur menjadi *production-ready*.

### 1. Color Palette Tokens ([`app/globals.css`](file:///home/zann/p2r-web/app/globals.css#L47-L56))
- **Arcade Violet**: `#5b2be6` (Warna dasar canvas utama)
- **Arcade Purple**: `#7a1fb0` (Warna gradient section & header)
- **Arcade Yellow**: `#ffe500` (Warna aksen utama, judul game, tombol CTA)
- **Arcade Yellow Shadow**: `#b98b00` (Shadow 3D untuk tombol dan border)
- **Arcade Ink**: `#2a1147` (Warna teks gelap / text-shadow)
- **Arcade Green**: `#7ac70c` (Warna section footer)
- **Arcade Green Dark / Shadow**: `#3f8f12` / `#2c6b00`

### 2. Typography
- **Heading & Display**: **`Jersey 15`** via CSS variable `--font-jersey` / class `font-display` (Google Font pixel font). Digunakan pada judul section, nama game, logo, dan teks berbobot arcade.
- **Body & UI**: Clean sans-serif via class `font-body` / `font-sans` untuk deskripsi, form input, dan teks bacaan panjang agar tetap terbaca jelas (*high readability*).

### 3. Visual & Interactive Patterns
- **3D Retro Button Press**: Tombol arcade menggunakan shadow tebal solid dan efek offset saat ditekan:
  ```css
  shadow-[6px_6px_0_var(--arcade-yellow-shadow)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5
  ```
- **Pixel Border Generator**: Border berpola pixel spiral 16-step via SVG pattern ([`components/MerchandiseCard.tsx`](file:///home/zann/p2r-web/components/MerchandiseCard.tsx#L32)).
- **Sawtooth Pixel Divider**: Pembatas zig-zag pixel antar section ([`components/PixelDivider.tsx`](file:///home/zann/p2r-web/components/PixelDivider.tsx)).
- **Marquee Ticker**: Teks berjalan horizontal berulang untuk pengumuman atau judul chapter ([`components/Marquee.tsx`](file:///home/zann/p2r-web/components/Marquee.tsx)).

---

## 7. Landing Page Philosophy

> **Prinsip**: Landing page (`/`) **BUKAN tempat untuk menumpuk seluruh data**.

Landing page berfungsi sebagai:
- **Introduction**: Memperkenalkan tema pameran *Cyber Arcade* dan kejuruan RPL.
- **Storytelling**: Membangun antusiasme pengunjung melalui narasi visual yang menarik.
- **Preview & Teaser**: Menampilkan cuplikan 2–3 game unggulan, 3–4 merchandise terpopuler, dan highlight karya.

**Aturan Navigasi & CTA**:
- Setiap section di homepage harus menyediakan tombol Call-to-Action (CTA) seperti:
  - *"Lihat Semua Game"* → menuju `/games`
  - *"Jelajahi Semua Karya"* → menuju `/karya`
  - *"Buka Katalog Lengkap"* → menuju `/merchandise`
  - *"Lihat Klasemen"* → menuju `/leaderboard`
  - *"Baca Info Terkini"* → menuju `/info-terkini`
- Jangan memaksakan rendering seluruh database di homepage; arahkan pengunjung ke dedicated route yang relevan.

---

## 8. Reference dari `p2r-testbed`

Modul logika yang sudah matang di [`p2r-testbed`](file:///home/zann/pixel2reality/p2r-testbed) dan siap diadaptasi ke `p2r-web`:

1. **Cart State & Persistence**:
   - Lokasi: [`p2r-testbed/src/components/cart/cart-context.tsx`](file:///home/zann/pixel2reality/p2r-testbed/src/components/cart/cart-context.tsx)
   - Menyediakan `CartProvider`, perhitungan subtotal, quantity modifier, dan sinkronisasi otomatis ke `localStorage` (`p2r_public_cart`).
2. **Realtime CS Chat Client**:
   - Lokasi: [`p2r-testbed/src/lib/api/public-chat.ts`](file:///home/zann/pixel2reality/p2r-testbed/src/lib/api/public-chat.ts) dan [`p2r-testbed/src/lib/echo.ts`](file:///home/zann/pixel2reality/p2r-testbed/src/lib/echo.ts)
   - Menyediakan helper `startChat()`, `sendChatMessage()`, `fetchChatMessages()`, serta inisialisasi Laravel Echo via Pusher JS ke Reverb WebSocket.
3. **Public Products & Feeds Fetcher**:
   - Lokasi: [`p2r-testbed/src/lib/api/public-products.ts`](file:///home/zann/pixel2reality/p2r-testbed/src/lib/api/public-products.ts) dan [`p2r-testbed/src/lib/api/public-feeds.ts`](file:///home/zann/pixel2reality/p2r-testbed/src/lib/api/public-feeds.ts)
   - Menyediakan helper format rupiah `formatIDR()`, fetcher produk, dan parser feeds media sosial.

> **Aturan Adaptasi**: Logika TypeScript, state management, dan API helper boleh disalin/diadaptasi, tetapi **desain UI, styling Tailwind, dan komponen visual `p2r-web` tetap menjadi sumber kebenaran tampilan**.

---

## 9. Backend REST API Endpoints

Backend `p2r-api` berjalan di `http://127.0.0.1:8090/p2r/v1` (atau tunnel `https://api.razzan.site/p2r/v1`). Seluruh response menggunakan envelope standar `{ success: boolean, message: string, data: T }`.

### Public Endpoints
| Domain | Method & Path | Keterangan & Payload |
| :--- | :--- | :--- |
| **Karya & Game** | `GET /karyas` | Filter query: `?category=game|website|software|hardware_robotics|digital_art&sort=newest|votes&limit=N` |
| | `GET /karyas/{slug}` | Detail karya, media URLs, creators, tech stack, dan `votes_count` |
| | `POST /karyas/{slug}/vote` | Mengirim vote publik untuk karya tertentu |
| | `DELETE /karyas/{slug}/vote`| Membatalkan vote |
| **Products** | `GET /products` | List produk merchandise/dana usaha yang berstatus published |
| | `GET /products/{slug}` | Detail produk, harga, deskripsi, stok, dan kategori |
| | `GET /categories` | List kategori produk aktif |
| **Feeds** | `GET /feeds` | List berita / postingan media sosial pameran |
| | `GET /feeds/{id}` | Detail postingan feed |
| **Leaderboard** | `GET /leaderboards/global` | Klasemen global seluruh game arcade |
| | `GET /leaderboards/games/{slug}` | Klasemen per game tertentu |
| | `GET /leaderboards/karyas` | Ranking perolehan voting karya pameran |
| **Chat CS** | `POST /chat/start` | Body: `{ guest_name: string, guest_email?: string, topic?: string }` → mengembalikan `session_token` |
| | `POST /chat/send` | Body: `{ session_token: string, message: string, attachment_url?: string }` |
| | `GET /chat/messages/{token}`| Riwayat pesan dalam sesi chat |
| | `DELETE /chat/session/{token}` | Menutup sesi chat |
| **Checkout** | `POST /auth/register` | Membuat akun guest sementara untuk customer checkout |
| | `POST /checkout` | Body: `{ customer_name, customer_phone, notes }` (memerlukan token) |
| | `POST /payment` | Body: `{ payment_method: 'qris'|'bank_transfer'|'cash' }` |
| | `POST /payment/proof` | Form-data: `proof_image` (file gambar bukti bayar) |

---

## 10. Development Roadmap

Urutan prioritas pengerjaan untuk menyelesaikan website hingga tahap production:

1. **Phase 1: Baseline Stabilization & Copywriting**
   - Perbaiki assertion di `__tests__/Hero.test.tsx` agar semua test 100% PASS.
   - Ganti seluruh placeholder *"Lorem Ipsum"* dan perbaiki typo navigasi di `lib/content.ts`.
2. **Phase 2: Landing Navigation & Preview Architecture (CURRENT TASK)**
   - Perbarui anchor navigasi di navbar.
   - Tambahkan CTA *"Lihat Semua"* di setiap section preview homepage.
   - Siapkan struktur target route (`/games`, `/karya`, `/merchandise`, `/leaderboard`, `/info-terkini`).
3. **Phase 3: Merchandise API Integration**
   - Buat `lib/api/products.ts` untuk memanggil `GET /p2r/v1/products`.
   - Hubungkan `MerchandiseSection.tsx` agar merender produk asli dari database dengan fallback statis.
4. **Phase 4: End-to-End Order & Checkout Integration**
   - Integrasikan form `Order.tsx` dengan alur checkout guest dan upload bukti pembayaran.
   - Adaptasi `CartProvider` dari `p2r-testbed` jika keranjang belanja multi-item dibutuhkan.
5. **Phase 5: Live CS Chat Engine**
   - Integrasikan `ChatAdmin.tsx` dengan API chat backend dan listener WebSocket Laravel Reverb (`laravel-echo`).
6. **Phase 6: Multi-Category Karya Showcase & Voting**
   - Implementasikan halaman/section karya untuk menampilkan kategori Web, IoT, dan Digital Art.
   - Pasang tombol interaktif voting karya yang memicu `POST /p2r/v1/karyas/{slug}/vote`.
7. **Phase 7: Feeds / Info Terkini & Leaderboard**
   - Buat komponen/halaman Feeds sosial media dan Leaderboard arcade.
8. **Phase 8: Final QA & Build Verification**
   - Jalankan `pnpm test`, `pnpm lint`, dan `pnpm build` untuk memastikan zero errors sebelum deployment.

---

## 11. Current Task (Langkah Segera)

> **Task Aktif**: **Landing Page Navigation & Preview Architecture**
> 1. Pastikan homepage berfungsi sebagai *introduction + storytelling + preview*.
> 2. Pasang tombol CTA *"Lihat Semua / Explore More"* pada section Games dan Merchandise.
> 3. Buat skeleton / routing dasar untuk target halaman detail (`/games`, `/karya`, `/merchandise`, `/leaderboard`, `/info-terkini`).

---

## 12. Development Rules

Setiap agent developer wajib mematuhi aturan kerja berikut:
- **Incremental**: Kerjakan satu fitur secara tuntas sebelum berpindah ke fitur lain.
- **Preserve Existing UI/UX**: Pertahankan estetika dan komponen yang sudah dibuat oleh tim.
- **No Unnecessary Refactor**: Jangan merombak arsitektur yang sudah berjalan dengan baik.
- **Reuse Existing Components**: Gunakan komponen yang ada (`GameArtwork`, `PixelBorder`, `PixelDivider`, `Marquee`, `ExploreButton`, dll.).
- **Always Test**: Jalankan `pnpm test` setelah melakukan perubahan kode.
- **Build Before Commit**: Pastikan `pnpm build` berhasil tanpa error TypeScript atau bundling.
- **Do Not Modify Unrelated Files**: Fokus hanya pada file yang relevan dengan tugas yang sedang dikerjakan.

---

## 13. Important Decisions

| Keputusan | Status | Rationale |
| :--- | :---: | :--- |
| **`p2r-web` sebagai Frontend Utama** | CONFIRMED | `p2r-web` memiliki desain orisinal yang disepakati tim dan struktur Next.js 16 App Router yang bersih. |
| **`p2r-testbed` sebagai Referensi Logika** | CONFIRMED | Menghindari duplikasi riset logika Cart, Chat, dan Feeds yang sudah berjalan di testbed. |
| **Server Components + Static Fallbacks** | CONFIRMED | Data fetching server-side memberikan performa tinggi, sementara fallback data statis menjamin website tetap menyala saat koneksi backend pameran terputus. |
| **One-Page Preview + Dedicated Sub-pages** | CONFIRMED | Homepage tetap ringan dan fokus pada storytelling, sedangkan katalog lengkap diakses melalui dedicated route. |
| **Domain Base URL Environment** | CONFIRMED | Dikonfigurasi dinamis melalui `NEXT_PUBLIC_P2R_API_BASE_URL` (default: `https://api.razzan.site/p2r/v1`). |

---
*Dokumen ini dibuat otomatis sebagai referensi pengembang. Perubahan pada aturan desain atau arsitektur harus diperbarui di dokumen ini.*
