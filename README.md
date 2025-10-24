![Cult of Drive](/public/images/bmw-e36.png)

# 🚗 Cult of Drive

> **90s–2000s BMW Culture. Authentic. OEM. Driver’s Cars Only.**  
> A digital homage to the golden era of BMW — built with Next.js 15, Tailwind CSS, and Framer Motion.

---
  
## ✨ Overview

**Cult of Drive** is a clean, minimal, and atmospheric landing page celebrating the pure driving spirit of 90s and early 2000s BMWs.  
Built for enthusiasts, by enthusiasts — merging aesthetics, performance, and soul.

---

## 🧱 Tech Stack

| Technology | Description |
|-------------|--------------|
| **Next.js 15 (App Router)** | Modern React framework optimized for performance and DX |
| **Tailwind CSS** | Utility-first CSS for responsive, clean UI |
| **Framer Motion** | Smooth, fluid animations and transitions |
| **ESLint** | Code linting and quality checks |
| **TypeScript** | Static typing for reliability and scalability |
| **Vercel** | Zero-config cloud deployment |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kursatdemirdelen/cultofdrive.git
cd cultofdrive
```

### 2. Environment Setup

Copy the environment example file and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

Then edit `.env.local` with your actual Supabase URL and API key.

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm run dev
```

Now open [http://localhost:3000](http://localhost:3000) to see it live 🚀

---

## 🧹 Lint & Formatting

This project uses **ESLint** for code linting and quality checks.

```bash
npm run lint
```

---

## 🧠 Project Structure

```
cultofdrive/
├── app/
│   ├── api/subscribe/route.ts # Supabase waitlist endpoint
│   ├── components/            # UI composition (hero, drivers garage, social feed)
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout + metadata
│   └── page.tsx               # Landing page
├── public/
│   └── images/                # Marketing imagery & profile assets
├── utils/                     # Client helpers (e.g. supabase client)
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## 🖋️ Metadata

```ts
export const metadata = {
  title: 'Cult of Drive — 90s–2000s BMW Culture',
  description:
    "Authentic. OEM. Driver's Cars Only. Celebrating the golden era of BMW engineering.",
  openGraph: {
    title: 'Cult of Drive',
    description: 'A tribute to the golden era of BMW driving culture.',
    images: ['/images/bmw-e36.png'],
  },
};
```

---

## 💌 Waitlist Integration

This project includes a fully functional email subscription system:
- **Supabase** (database for storing emails)
- **API Route** (`/api/subscribe`) for handling subscriptions
- **Email Form Component** with validation and error handling

The email subscription is already integrated and ready to use!

---

## 📡 Data Services

Cult of Drive exposes two API routes for loading social content into the site.

### `/api/instagram`
- Returns the latest Instagram media items in a normalized `{ posts: [] }` shape for the UI.
- Requires a valid `INSTAGRAM_ACCESS_TOKEN`; refresh long-lived tokens every 60 days to avoid a `500` response with `{ "error": "Failed to fetch Instagram posts" }`.
- Typical use:
  ```ts
  const res = await fetch('/api/instagram', { cache: 'no-store' })
  if (!res.ok) throw new Error('Instagram feed unavailable')
  ```

### `/api/social-posts`
- Reads curated entries from the Supabase `social_posts` table and accepts `POST` requests to add new rows.
- Expected columns: `id uuid`, `username text`, `content text`, optional `image_url text`, `like_count int4 default 0`, `url text`, `created_at timestamptz default now()`.
- `/api/subscribe` stores waitlist addresses in the `E-mail` table (`id uuid`, `e_mail text unique`, `created_at timestamptz`).
- Error conventions: `400` for missing fields, `500` for Supabase errors.
- Typical use:
  ```ts
  const res = await fetch('/api/social-posts')
  const { posts } = await res.json()
  ```

---

## 🚀 Deployment

Deploy instantly with **[Vercel](https://vercel.com)**:

```bash
vercel deploy
```

✅ Automatic builds  
✅ Edge optimization  
✅ Environment variable support

---

## 🧭 Roadmap

- [x] Add backend integration for email waitlist
- [x] Include Instagram live feed
- [x] Introduce "Driver's Garage" gallery
- [ ] Add multilingual support (EN/TR)

---

## 🏁 License

This project is open source under the [MIT License](LICENSE).

---

### Made with passion 🖤  
**Cult of Drive** — A tribute to those who still *feel* the road.
