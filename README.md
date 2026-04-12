<div align="center">

# 🏗️ MzansiBuilds

**A modern web platform built to connect, collaborate, and celebrate builders. Share your progress, showcase your projects on the Live Feed, and build in public.**

[🌐 Live Website](https://mzansibuilds-web-git.vercel.app/) • [🐛 Report Bug](https://github.com/Rhulani756/mzansibuilds/issues) • [📖  Documentation](https://github.com/Rhulani756/mzansibuilds/issues)

</div>

---

## 🛠️ System Architecture & Tech Stack

MzansiBuilds is engineered as a highly scalable **Turborepo** monorepo, separating UI components, database schemas, and web applications for maximum maintainability.

**Core Technologies:**
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion
- **Backend & Auth:** Supabase, PostgreSQL
- **ORM:** Prisma
- **Infrastructure:** Vercel

---

## 🛡️ Security Architecture

Security is baked into the platform from the database layer up to the edge network, ensuring user data and project integrity are strictly protected.

- **Authentication:** Powered by Supabase Auth, utilizing secure, HTTP-only cookies and JWTs for session management.
- **Data Authorization:** PostgreSQL **Row Level Security (RLS)** ensures users can only mutate their own projects and profiles at the database level.
- **Server-Side Validation:** All Next.js Server Actions enforce strict input validation before interacting with the Prisma client, preventing injection attacks and malformed data.
- **Environment Protection:** Sensitive credentials and database URLs are isolated in Vercel's encrypted environment variables, never exposed to the client bundle.

---

## 🧪 Testing Strategy

A rigorous testing pyramid guarantees that core features (like authentication and project creation) remain stable as the platform scales. (To see more info: **[View testing documentation](https://github.com/Rhulani756/mzansibuilds/tree/main/docs)**)

- **Unit Testing (Jest):** Validates isolated utility functions, custom hooks, and complex UI state logic.
- **Integration Testing:** Tests the "handshake" between Next.js Server Actions and the Dockerized Postgres database to ensure data integrity during mutations.
- **End-to-End Testing (Playwright):** Simulates real user journeys in a headless Chromium browser, verifying critical paths such as user onboarding, logging in, and publishing a project to the Celebration Wall.


---

## ⚙️ Automation & CI/CD Pipeline

**[View GitHub Actions](https://github.com/Rhulani756/mzansibuilds/actions)**

A cornerstone of this platform is its robust, automated Continuous Integration and Continuous Deployment (CI/CD) pipeline, ensuring zero breaking changes reach production.

**Automated Workflow:**
1. **Static Analysis:** ESLint strict-mode verification across all packages.
2. **Test Execution:** Automated runs of the Jest and Playwright test suites.
3. **Database Migration:** Prisma schema verification and deployment preparations.
4. **Deployment:** Automated promotion to Vercel upon passing all integration checks.

---

## 🚀 Deployment

### 🌐 Live System

**Production Deployment:** [MzansiBuilds on Vercel](https://mzansibuilds-web-git.vercel.app/)

The platform utilizes Vercel's Edge Network for global state distribution and Next.js serverless functions for optimized, low-latency rendering.

---

## 📦 Installation Instructions

### System Requirements
- **Node.js** 20+
- **npm**
- **PostgreSQL** (or a Supabase Project)

### Quick Start

```bash
# Clone the repository
git clone [https://github.com/Rhulani756/mzansibuilds.git](https://github.com/Rhulani756/mzansibuilds.git)
cd mzansibuilds

# Install dependencies across the monorepo
npm install

# Setup Environment Variables (apps/web/.env)
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
# DATABASE_URL=your_db_connection

# Generate Prisma Client & Push Schema
npx turbo run build --filter=database

# Start the development server
npx turbo run dev
