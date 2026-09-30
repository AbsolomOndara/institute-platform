# ICSF Platform Operations

## Local Windows setup

The project does not use XAMPP and must not be placed in `htdocs`. Store it in any normal development folder such as `C:\Dev Tasks\institute-platform`.

### Required software

1. Node.js 20 or newer
2. PostgreSQL 15 or newer
3. Git (recommended)

### Database

Create the database through pgAdmin or:

```powershell
psql -U postgres -c "CREATE DATABASE institute_db;"
```

### Backend

```powershell
cd "C:\Dev Tasks\institute-platform\server"
Copy-Item .env.example .env
npm install
npx prisma migrate dev --name initial
npm run db:seed
npm run dev
```

### Frontend

```powershell
cd "C:\Dev Tasks\institute-platform\client"
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. The API health check is `http://localhost:4000/api/health`.

## First system test

1. Sign in with the administrator email and password configured in `server/.env`.
2. Create a tutor and securely copy the one-time temporary password.
3. Assign the tutor to a published course.
4. Sign in as the tutor, change the temporary password, and add a module and lesson.
5. Register a student account and request the course.
6. Sign in as admin and approve the enrollment.
7. Return to the student account, open the course, and complete the lesson.

## External services and production configuration

### PostgreSQL hosting

Production requires a hosted PostgreSQL database. Put its connection URL in `server/.env` under `DATABASE_URL`. The source consumer is `server/prisma/schema.prisma` in the `datasource db` block.

### Transactional email

The current release shows a generated tutor password to the admin once. To email password setup or reset links, connect an email provider in `server/src/services/emailService.js`, then call that service from `server/src/controllers/adminController.js` after tutor creation. Add provider secrets to `server/.env`; never put them in React.

### File and video hosting

Tutors can enter video and resource URLs. For direct uploads, connect object storage (for example S3-compatible storage) in a new server-side upload service, call it from `server/src/routes/tutorRoutes.js`, and store only returned URLs in the existing `Lesson.videoUrl` and `Lesson.resourceUrl` fields.

### Official logo

Replace the text mark in `client/src/components/common/Navbar.jsx` after obtaining the official transparent PNG or SVG. Place it under `client/src/assets` and import it into the navbar.

### Hosting and HTTPS

Deploy `client` to a static frontend host and `server` to a Node.js host. Set `CLIENT_URL` in `server/.env` to the final frontend origin and `VITE_API_URL` in `client/.env` to the final API URL. HTTPS is required so the production session cookie in `server/src/config/session.js` can use its Secure flag.

### Domain and DNS

Point `www.icsf.co.ke` to the chosen frontend host and use a separate API hostname such as `api.icsf.co.ke`. DNS access is external to the codebase.

### Backups and monitoring

Enable automatic PostgreSQL backups and application error monitoring with the selected hosting providers. These are infrastructure settings rather than source-code changes.
