# Namecheap MySQL deployment

1. In cPanel, create a MySQL database and database user. Grant the user all database privileges.
2. Copy `.env.example` to `.env.local` for local development, or set the variables in the Namecheap Node.js application environment.
3. Set `DATABASE_URL`:
   `mysql://USER:PASSWORD@HOST:3306/DATABASE`
   Use the Namecheap hostname shown in cPanel as the host; it may be the local server name rather than `localhost`.
4. Generate a secure `AUTH_SECRET`, for example:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
5. Create the MySQL schema and import existing data:
   ```sh
   pnpm prisma db push
   node scripts/convert-postgres-backup.js db_backup/data_2026-11-05_20-37-15.sql db_backup/data_mysql.sql
   mysql --host=HOST --user=USER --password DATABASE < db_backup/data_mysql.sql
   ```
6. Install and build with the cPanel terminal:
   ```sh
   pnpm install --frozen-lockfile
   pnpm prisma generate
   pnpm build
   node scripts/prepare-namecheap-deploy.mjs
   ```
7. In cPanel, create a Node.js application with:
   - Application root: `/home/loyataom/public_html`
   - Startup file: `server.js`
   - Node.js version: 22 or newer
8. Required production environment variables for the cPanel Node.js app:
   - `DATABASE_URL` or `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `AUTH_SECRET` (32+ random characters)
   - `PORT` (optional, usually set by cPanel)
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_BASE_URL` (the public HTTPS URL for the app)
   - Any email, file storage, and external API variables the app requires
9. Configure `DATABASE_URL` and `AUTH_SECRET` in the cPanel Node.js application's Environment Variables section. Redeploy from the `main` branch and restart the application.
10. Keep `public/uploads` writable for local avatar uploads. For a persistent or load-balanced deployment, move avatars to object storage.
11. Production startup command:
   ```sh
   NODE_ENV=production PORT=3000 node server.js
   ```
   The bundled `server.js` prefers the generated Next.js standalone server when `.next/standalone/server.js` exists, and falls back to the local dev server only when the standalone build is absent.
