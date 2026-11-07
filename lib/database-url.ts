export function getDatabaseUrl(): string {
  if (
    process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_NAME &&
    process.env.DB_PORT
  ) {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const user = encodeURIComponent(process.env.DB_USER);
    const password = encodeURIComponent(process.env.DB_PASSWORD ?? '');
    const database = encodeURIComponent(process.env.DB_NAME);

    return `mysql://${user}:${password}@${host}:${port}/${database}`;
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  throw new Error(
    'Configure DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME (or DATABASE_URL) in .env.local',
  );
}
