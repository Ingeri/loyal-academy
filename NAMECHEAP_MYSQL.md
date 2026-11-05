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
   pnpm install
   pnpm prisma generate
   pnpm build
   ```
7. Point the Namecheap Node.js application entry point at `node_modules/.bin/next` and start it as `start`.
8. Keep `public/uploads` writable for local avatar uploads. For a persistent or load-balanced deployment, move avatars to object storage.
