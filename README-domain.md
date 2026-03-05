Deploy / DNS checklist for polysea.space

Overview
- Backend: Render service (https://polysea.onrender.com)
- Frontend: Vercel static site
- Domain: polysea.space (root + www) -> Vercel
- API subdomain: api.polysea.space -> Render

What I added to the repo
- `render.yaml` (Render service manifest)
- `vercel.json` (Vercel static config + SPA fallback)
- GitHub Action `.github/workflows/deploy-vercel.yml` to deploy frontend to Vercel on push to `main` (requires secrets)
- `/health` endpoint on the backend

DNS records (general)
1) Frontend (Vercel)
   - Add `polysea.space` and `www.polysea.space` as custom domains in your Vercel project.
   - Vercel will show DNS records to add. Typical records are either:
     - A records for `@` pointing to Vercel's IPs (provided by Vercel), OR
     - An ALIAS/ANAME for `@` pointing to `cname.vercel-dns.com` (if your DNS provider supports it).
     - CNAME for `www` -> `cname.vercel-dns.com`
   - After DNS is added and verified, Vercel provisions TLS automatically.

2) Backend (Render)
   - In Render service dashboard, add `api.polysea.space` as a custom domain for your `polysea` service.
   - Render will provide a CNAME target (copy it). In your DNS provider add:
     - Type: CNAME
     - Name: api
     - Value: <Render CNAME target provided in the dashboard>
   - After DNS verification Render will provision TLS for `api.polysea.space`.
   - If Render tells you to use an A record instead, follow Render's instructions.

Environment variables to set
- On Render (Service -> Environment):
  - GROQ_API_KEY = <your_groq_key>
  - GROQ_MODEL = openai/gpt-oss-120b
  - APP_SECRET_KEY = <strong-secret>
  - ALLOWED_ORIGINS = https://polysea.space, https://www.polysea.space

- On Vercel (Project -> Settings -> Environment Variables):
  - API_BASE_URL = https://api.polysea.space

GitHub Action for Vercel
- The workflow `.github/workflows/deploy-vercel.yml` executes `vercel --prod` on push to main.
- You must add these repository secrets in GitHub (Settings -> Secrets -> Actions):
  - VERCEL_TOKEN (create one in Vercel Account -> Tokens)
  - VERCEL_ORG_ID (found in Vercel project settings)
  - VERCEL_PROJECT_ID (found in Vercel project settings)
  - Optionally API_BASE_URL if you want to override the default.

After DNS changes
- Wait 5–30 minutes for DNS propagation (up to 24h in worst cases).
- Visit:
  - https://polysea.space -> should show your frontend
  - https://api.polysea.space/health -> should return {"status":"ok","service":"polysea"}

Troubleshooting
- If `https://polysea.space` returns 404 from Vercel: check Vercel project domains and that the deployment is assigned to that domain.
- If `https://api.polysea.space` returns DEPLOYMENT_NOT_FOUND: ensure the DNS `api` CNAME points to Render's provided target (not Vercel).
- For CORS errors: ensure `ALLOWED_ORIGINS` contains the exact origin(s) including the protocol (https://polysea.space).

Security notes
- Do not commit `.env` to the repo. Keep secrets in Render/Vercel/GitHub Secrets.
- Rotate GROQ/API keys if they were accidentally pushed to a public repo.

If you want, I can:
- Generate the exact DNS records for your DNS provider if you tell me which one you're using (Cloudflare / Namecheap / GoDaddy / Google Domains / DigitalOcean). 
- Trigger the Vercel deploy via the GitHub Action (once you set secrets) or via Vercel token (if you provide it).

*** End of file
