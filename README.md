# Desire Job Hub 🇳🇵

Nepal's premier job portal with QR-based payment, AI CV builder, and admin dashboard.

**Stack:** Next.js 14 · Tailwind CSS · Supabase · Google Gemini · Resend

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Fill in your Supabase, Gemini, and Resend credentials
```

### 3. Setup Supabase Database
1. Create a project at [supabase.com](https://supabase.com)
2. In SQL Editor, run the full contents of `supabase/schema.sql`
3. Create admin user in **Authentication → Users** then run:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
   ```
4. Upload `public/qr-esewa.png` to **Storage → qr-codes bucket** (public)

### 4. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
jobPortal/
├── app/
│   ├── page.tsx              # Landing page
│   ├── cv-builder/page.tsx   # AI CV Builder
│   ├── admin/
│   │   ├── login/page.tsx    # Admin login
│   │   ├── page.tsx          # Dashboard
│   │   ├── applications/     # Review & verify payments
│   │   ├── jobs/             # Manage job listings
│   │   └── users/            # User credits tracker
│   └── api/
│       ├── applications/     # Submit & list applications
│       ├── jobs/             # CRUD for jobs
│       └── cv/enhance/       # Gemini AI enhancement
├── components/               # All UI components
├── lib/
│   ├── supabase/             # Client & server helpers
│   └── types.ts              # TypeScript types
├── public/
│   └── qr-esewa.png          # eSewa QR code
└── supabase/
    └── schema.sql            # Full database schema
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `RESEND_API_KEY` | Resend email service key |

---

## 💳 Payment Flow

1. User applies → fills form + pays NPR 500 via eSewa QR
2. User uploads payment screenshot → status: **Pending**
3. Admin reviews screenshot in dashboard → **Approve / Reject**
4. On approval → user gets **3 job unlock credits** + email with job contact details

---

## 🌐 Deployment (Vercel + Supabase)

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy → Done!

---

## 📧 Email Setup (Resend)

1. Create account at [resend.com](https://resend.com)
2. Add & verify your domain
3. Get API key and set `RESEND_API_KEY`
4. Update the `from` email in `/app/api/applications/[id]/verify/route.ts`

---

## 🤖 AI CV Builder

Uses Google Gemini 1.5 Flash to enhance:
- Career objectives
- Work experience descriptions  
- Skills lists

Get API key: [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

---

Made with ❤️ for Nepal's job market
