# Vercel + Railway deployment

## Frontend on Vercel

1. Push this workspace to a GitHub repository.
2. Import the repository in Vercel.
3. Keep the project root at the repository root.
4. Use these settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
5. Add this environment variable:

```env
VITE_API_URL=https://YOUR-RAILWAY-BACKEND.up.railway.app
```

The root `vercel.json` keeps React routes working after refresh.

## Backend on Railway

1. Create a Railway project and add a MySQL database.
2. Add the same GitHub repository as a service.
3. Set the service root directory to `backend`.
4. Railway will use `backend/Dockerfile`.
5. Set these variables in the Laravel service:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:GENERATE_A_REAL_KEY_LOCALLY
APP_URL=https://YOUR-RAILWAY-BACKEND.up.railway.app
FRONTEND_URL=https://YOUR-VERCEL-APP.vercel.app
SANCTUM_STATEFUL_DOMAINS=YOUR-VERCEL-APP.vercel.app
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
MAIL_MAILER=log
SUPPLIER_PRODUCTS_URL=https://admin.gpdsgameshop.com/api/product
```

Generate the application key locally with:

```powershell
cd backend
php artisan key:generate --show
```

Copy the returned value into Railway as `APP_KEY`. Do not commit `.env` or any secret keys.

## Database

For a fresh Railway database, run migrations from the Railway service shell only if the database is empty. For the existing SQL backup, import it into Railway MySQL first and do not run `migrate:fresh`.

If the imported database does not contain the newer application tables, create those missing tables before going live. Take a backup before changing the production database.

## CORS and cookies

After adding the production URLs, redeploy the backend. Laravel uses `FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS` for browser authentication. The frontend must use the exact same hostname configured there.

## Local verification

```powershell
npm run build
cd backend
php artisan route:list
```
