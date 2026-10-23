# Contoh frontend Next.js

1. Salin `DdcPredictForm.tsx` ke folder komponen pada proyek Next.js, misalnya `app/components/DdcPredictForm.tsx`.
2. Import komponen tersebut ke `app/page.tsx`: `import DdcPredictForm from "./components/DdcPredictForm";` lalu render `<DdcPredictForm />`. Sesuaikan path import.
3. Salin `.env.local.example` menjadi `.env.local` di root proyek Next.js. Ganti URL dengan URL Space sebenarnya, misalnya `https://nama-akun-nama-space.hf.space`.
4. Restart dev server Next.js setelah mengubah `.env.local`.
5. Pada production, atur `NEXT_PUBLIC_DDC_API_URL` di environment hosting frontend. Nilai `NEXT_PUBLIC_` memang akan terlihat di browser; URL API bukan secret.

Jika CORS bermasalah, atur variable Space `DDC_ALLOWED_ORIGINS` ke origin frontend, misalnya `https://nama-aplikasi.vercel.app` (tanpa path). Untuk pengujian, default `*` terbuka; batasi saat production.
