# Alumni Connect

An alumni–student networking platform built as a 5th-semester minor project. Students can discover alumni, and admins can manage users and events through seed scripts.

## Structure
- `frontend/` — React + Vite web client styled with Tailwind CSS
- `backend/` — Node.js/Express REST API with data models and seed scripts (`seedUsers.js`, `seedAlumni.js`, `seedEvents.js`)

## Getting Started
**Backend**
```bash
cd backend
npm install
# configure environment variables (DB connection etc.)
node index.js
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
