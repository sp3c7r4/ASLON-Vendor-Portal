# ASLON Vendor Portal

A fully functional Next.js vendor management portal with authentication, job management, LMS, forum, and AI chatbot features.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Vendor:**
- Email: `vendor@example.com`
- Password: `vendor123`

## Features

### Authentication & Roles
- ✅ Signup/Login with NextAuth
- ✅ Vendor and Admin roles
- ✅ Role-based protected routes

### Vendor Dashboard
- ✅ Profile management
- ✅ Job statistics and overview
- ✅ Announcements feed

### Speedlimiter Job Workflow
- ✅ Create new jobs (customer name, vehicle number)
- ✅ Process payment (mock)
- ✅ Auto-generate unique approval codes (ASLN-XXXX-XXXX)
- ✅ Generate downloadable PDF receipts with QR codes
- ✅ View complete job history

### Admin Dashboard
- ✅ View total revenue (aggregated)
- ✅ Manage vendors (approve/suspend)
- ✅ Create announcements
- ✅ Upload training content (mock)

### LMS Module
- ✅ Course list and details
- ✅ Video placeholder with content
- ✅ Progress tracking (in-memory)
- ✅ Download certificate (mock)

### Forum Module
- ✅ Create posts and replies
- ✅ Vendor-only access
- ✅ Admin moderation (delete posts)

### AI Chatbot
- ✅ Chat widget (bottom-right)
- ✅ Predefined FAQ responses from JSON
- ✅ "Escalate to admin" creates support ticket

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS** + **Shadcn UI**
- **NextAuth v5** (Credentials Provider)
- **Prisma ORM** (schema ready for future DB)
- **pdf-lib** (PDF generation)
- **qrcode** (QR code generation)

## Project Structure

```
/app
  /(auth)          - Login & Register
  /dashboard       - Dashboards
    /vendor        - Vendor dashboard & profile
    /admin         - Admin dashboard & management
  /jobs            - Job management
  /lms             - Learning Management System
  /forum           - Forum
/components        - React components
  /ui              - Shadcn UI components
/lib               - Utilities & mock data
/prisma            - Database schema
```

## Mock Data

All data is stored in-memory in `src/lib/mock-data.ts`:
- Data persists during the session
- Resets on server restart
- Ready to be replaced with real database queries

## Database Schema

Prisma schema is included in `/prisma/schema.prisma` for future database integration. Currently, the app uses in-memory mock data.

To use a real database:
1. Update `prisma/schema.prisma` with your database provider
2. Set `DATABASE_URL` in `.env`
3. Run: `npx prisma generate && npx prisma migrate dev`

## Changing Admin Password

Edit `src/lib/mock-data.ts` and update the admin user's password field.

## Environment Variables

No environment variables are required for the demo. For production:

```env
DATABASE_URL="your-database-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Building for Production

```bash
npm run build
npm start
```

## License

Private project - ASLON Vendor Portal
