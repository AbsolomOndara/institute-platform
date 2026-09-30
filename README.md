# Institute of Cybersecurity and Forensics

JavaScript starter for the Institute of Cybersecurity & Forensics (ICSF), the training arm of the Kenya Cyber Security and Forensic Association.

The public pages use the institute's approved brochure content and navy, red-orange, white, and gold visual direction.

## Stack

- Client: React, Vite, React Router, Axios
- Server: Node.js, Express, Prisma
- Database: PostgreSQL
- Authentication: database-backed sessions

## Roles

- Student: self-registers, requests enrollment, accesses approved courses.
- Tutor: created by an admin, manages assigned course content.
- Admin: manages accounts, courses, assignments, and enrollment approval.

## Start locally

1. Copy `server/.env.example` to `server/.env` and enter your PostgreSQL details.
2. In `server`, run `npm install`, `npx prisma migrate dev --name initial`, `npm run db:seed`, and `npm run dev`.
3. Copy `client/.env.example` to `client/.env`.
4. In `client`, run `npm install` and `npm run dev`.
5. Open `http://localhost:5173`.

## Included functionality

- Institutional public pages, catalogue, course details and contact enquiries
- Student self-registration and shared session-based login
- Student, tutor and administrator portals
- Admin-created tutor credentials with forced first-login password change
- Course creation, publishing and tutor assignment
- Student enrollment requests and admin approval/rejection/suspension
- Server-enforced lesson locking until an enrollment is active
- Tutor module and lesson management
- Student lesson completion and course progress
- Account suspension and live database role/status checks

See `OPERATIONS.md` for Windows setup, production requirements and external-service integration points.
