# Setup for jeisaru.com

1. Email forwarding (Porkbun): Domain Management > envelope icon next to jeisaru.com > Create a New Forwarding Address.
2. Login database: create a free Supabase project, run schema.sql, paste URL and anon key into config.js.
   In Supabase > Authentication > URL Configuration, set Site URL to https://jeisaru.com.
3. Payments: in Stripe, create a Payment Link per product and paste each link into config.js.
4. Hosting: upload this folder to Cloudflare Pages, Netlify or Vercel, then point jeisaru.com to it in Porkbun DNS.
