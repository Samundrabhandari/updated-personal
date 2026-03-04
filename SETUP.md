# Gallery System Setup

This is a Next.js App Router application built with Prisma, PostgreSQL, NextAuth, and Cloudinary.

## Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Cloudinary account

## Environment Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your credentials:
   - `DATABASE_URL`: Your local or remote PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate a secure random string (e.g. using `openssl rand -base64 32`)
   - `ADMIN_PASSWORD`: Choose a secure password for the admin portal
   - Cloudinary keys (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`): Get these from your Cloudinary dashboard.

## Database Setup
1. Apply the Prisma schema to your database:
   ```bash
   npx prisma db push
   ```
   *(Alternatively, use `npx prisma migrate dev` if you prefer migrations).*
2. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Running the App
Start the development server:
```bash
npm run dev
```

- **Public Gallery**: [http://localhost:3000/gallery](http://localhost:3000/gallery)
- **Admin Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Deployment
This app can be deployed to Vercel easily. Make sure to add all the environment variables from `.env` into your Vercel project settings.
