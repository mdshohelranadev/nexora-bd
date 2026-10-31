# Md Shohel Rana — Portfolio

Next.js 14 + TypeScript + Tailwind CSS + Framer Motion. Black & white only.

## 1. Run locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set YOUR OWN ADMIN_PASSWORD
npm run dev
```

Open http://localhost:3000
Admin panel: http://localhost:3000/admin

## 2. Edit content

All text, skills, services, roadmap and experience are in `lib/content.ts`.
Replace the placeholder jobs in `experience` with your real ones.

## 3. Admin panel (manage projects)

- Go to `/admin` and log in with `ADMIN_PASSWORD`.
- Create, edit and delete projects. Changes show on the home page.
- Projects are saved in `data/projects.json`.

**Important:** Vercel's file system is read-only in production, so Create/Edit/Delete
will fail on the live site. Works fine on your local computer.
For live editing, move storage to a database (Supabase or Vercel KV). Or edit
`data/projects.json` locally and push to GitHub.

## 4. Contact form

Web3Forms key is already in `lib/content.ts`. Messages go to your email.
WhatsApp button opens https://wa.me/8801340048790.

## 5. Deploy on Vercel

1. Push this folder to a GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Add environment variable: `ADMIN_PASSWORD` = your password.
4. Click Deploy.
