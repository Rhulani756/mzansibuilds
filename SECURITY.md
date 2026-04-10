# Security Policy

## Supported Versions
We are currently actively developing the MzansiBuilds platform. Only the latest version of the `main` branch is supported for security updates.

## Reporting a Vulnerability
If you discover a security vulnerability within this project, please do not open a public issue. Instead, report it privately to the maintainer via the GitHub Security Advisory feature.

## Secure by Design
This project utilizes:
- **Zod** for strict schema validation on all API endpoints.
- **Prisma** to prevent SQL injection via parameterized queries.
- **GitHub CodeQL** for automated static analysis.
