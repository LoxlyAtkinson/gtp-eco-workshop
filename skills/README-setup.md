Next action: pick the Supabase project for the workshop and run step 1 below.

# Switch on email delivery for the skills pack (one time, about 40 minutes)

Today the form at `skills/get/` works without any of this: it shows the direct download and sends nothing. These steps switch it to "we email you a 7-day link". Undo at any time with step 9.

Run every command from the project root. Never paste a key into a file that gets committed, a chat or a screenshot.

1. **Link the project (2 min).** Supabase dashboard > your project > Project Settings > General > copy the Reference ID.
   ```powershell
   npx supabase login
   npx supabase link --project-ref <project-ref>
   ```
2. **Create the tables and the private bucket (2 min).** This applies every file in `supabase/migrations/`, including `202610280201_skills_requests.sql` (table `skills_requests`, RLS on, no browser access, private bucket `skills-pack`).
   ```powershell
   npx supabase db push
   ```
3. **Upload the pack (3 min).** The key is typed into a hidden prompt, so it stays out of your shell history.
   ```powershell
   $env:SUPABASE_URL = 'https://<project-ref>.supabase.co'
   $env:SUPABASE_SERVICE_ROLE_KEY = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR((Read-Host 'Service role key' -AsSecureString)))
   node scripts/upload-skills-pack.mjs
   Remove-Item Env:SUPABASE_SERVICE_ROLE_KEY
   ```
   Expect the last line: `signed download check ok: HTTP 200, 125080 bytes, sha256 matches`.
4. **Set up Resend (15 min, mostly DNS waiting).** At resend.com: Domains > Add domain > add the DNS records it shows > wait for Verified. Then API Keys > Create API key with "Sending access".
5. **Store the function secrets (3 min).** Create `supabase/.env.skills` (git ignores `.env.*`) with these three lines, then push it and delete it:
   ```
   RESEND_API_KEY=<from step 4>
   SKILLS_MAIL_FROM=GTP ECO workshop <skills@your-verified-domain>
   RATE_LIMIT_SALT=<any long random string>
   ```
   ```powershell
   npx supabase secrets set --env-file supabase/.env.skills
   Remove-Item supabase/.env.skills
   ```
   Optional extras: `SKILLS_REPLY_TO`, `SKILLS_GUIDE_URL`, `SKILLS_ALLOWED_ORIGINS` (default `https://loxlyatkinson.github.io`).
6. **Deploy the function (2 min).**
   ```powershell
   npx supabase functions deploy skills-request
   ```
7. **Send yourself one test (2 min).** Use your own address.
   ```powershell
   curl.exe -i -X POST "https://<project-ref>.supabase.co/functions/v1/skills-request" -H "content-type: application/json" -H "origin: https://loxlyatkinson.github.io" --data '{\"firstName\":\"Test\",\"email\":\"you@example.com\",\"consent\":true,\"company\":\"\"}'
   ```
   Expect `HTTP/1.1 200` and `{"ok":true,"sent":true}`. Open the email, press "Download the pack", check the zip opens.
8. **Switch the form on (5 min).** In `skills/get/config.js` set
   `apiUrl: 'https://<project-ref>.supabase.co/functions/v1/skills-request'`, commit, run the "Publish GTP ECO site" workflow, then open `https://loxlyatkinson.github.io/gtp-eco-workshop/skills/get/` on your phone and send one real request.
9. **Undo (2 min).** Set `apiUrl: ''` again and republish. The form goes back to the direct download straight away.
10. **Delete old requests automatically (3 min).** Dashboard > Integrations > Cron > enable it, then in the SQL editor:
    ```sql
    select cron.schedule('skills-requests-purge', '17 3 * * *', 'select public.skills_requests_purge_expired()');
    ```
    Rows are deleted 30 days after the request.

## What the function does

- Accepts `POST {firstName, email, consent: true, company: ""}` from `https://loxlyatkinson.github.io` only. `company` is a hidden spam trap.
- Limits: 10 requests per network per hour, 3 per email address per day.
- Saves `name, email, consent, created_at` in `skills_requests`, signs a 7-day link to `skills-pack/anthropic-marketing-skills.zip`, sends one email (plain text plus inline-styled HTML) through Resend and marks the row `sent` or `failed`.
- Logs carry a request id and the outcome, never the name, email or keys.
- Tests: `deno test --no-remote supabase/functions/skills-request/handler.test.ts`.

## Known risk before the workshop

Claude.ai's help page says a skill description should be 200 characters or less. These skills use 278 to 343. If Claude.ai refuses an upload, the guide at `skills/guide/` already tells people what to do instead (Claude Code, or attach the SKILL.md in a chat). Test one upload on your own account before the day.
