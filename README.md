# HireLens AI

HireLens AI is a modern AI-powered recruitment platform that helps recruiters manage open roles, review candidates, and track hiring outcomes without spreadsheet chaos. The MVP includes authenticated candidate and recruiter experiences, resume upload and parsing, AI match analysis against job descriptions, and recruiter pipeline management.

## Features

- Candidate and recruiter authentication using JWT cookies
- Recruiter job CRUD (create, edit, close)
- Kanban pipeline: Applied → Shortlisted → Interview → Offer → Hired / Rejected
- PDF and DOCX resume upload with 10MB limit
- AI-powered scoring using OpenAI-compatible API or fallback heuristic analysis
- Responsive, modern SaaS dashboard UI with light/dark mode
- Seed users for both roles for local development and demos

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- JWT auth via cookie-based session
- PDF/DOCX parsing via pdf-parse + mammoth
- OpenAI-compatible API support for resume-job matching

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```bash
   JWT_SECRET=your-super-secret-key
   OPENAI_API_KEY=your_openai_key_here
   ```

3. Run the app:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Seed accounts

The app includes demo credentials for local testing:

- Candidate: ava@northstar.ai / password123
- Recruiter: olivia@hirelens.ai / password123

## Demo flow

1. Sign in as recruiter.
2. Create or review a job from the recruiter dashboard.
3. Sign in as candidate.
4. Browse jobs and apply with a PDF or DOCX resume.
5. Review AI analysis, match score, strengths, missing skills, and suggestions.
6. Use recruiter tools to update candidate status in the pipeline.

## Deployment

### Vercel

1. Push this repo to GitHub.
2. Import the repository into Vercel.
3. Set environment variables:
   - JWT_SECRET
   - OPENAI_API_KEY
4. Deploy.

### Render

1. Create a new Web Service on Render.
2. Connect the GitHub repository.
3. Set the build command:

   ```bash
   npm install && npm run build
   ```

4. Set the start command:

   ```bash
   npm run start
   ```

5. Add environment variables for `JWT_SECRET` and `OPENAI_API_KEY`.

## Notes

- The current MVP uses an in-memory store for demo data.
- For production, replace this with a database such as PostgreSQL or Prisma.
- The AI engine uses OpenAI-compatible API when configured; otherwise it falls back to a deterministic heuristic scoring model.
