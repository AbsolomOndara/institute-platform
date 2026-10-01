# ICSF Frontend

Standalone React frontend for the Institute of Cybersecurity & Forensics.

## Run

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173`.

## Build

```powershell
npm.cmd run build
```

The production output is created in `dist`.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Select **Vite** as the framework preset.
4. Use `npm run build` as the build command and `dist` as the output directory.
5. Deploy. The included `vercel.json` keeps React routes working when a page is refreshed directly.

For a manual deployment with the Vercel CLI, run `npx vercel` in this folder and follow the prompts.

## Backend connection

Public institutional content is built into the frontend from the approved ICSF brochure. Authentication, shared records, approvals, contact enquiries and protected lessons use the service files under `src/services` and connect to the separately deployed ICSF backend.

Set:

```env
VITE_API_URL=https://your-api-domain.example/api
```

Add `VITE_API_URL` under **Project Settings → Environment Variables** in Vercel when the separate backend is available, then redeploy.

No passwords, database connection strings or private credentials belong in this frontend project.

The backend must permit the exact Vercel frontend origin through its `CLIENT_URL` setting. Axios is already configured with `withCredentials: true`, so the secure session cookie is included with API requests.
