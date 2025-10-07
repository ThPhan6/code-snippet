# Code Snippets Platform

A modern web platform where developers can share code snippets, organize them by language and topic, and analyze time complexity. Built with Next.js 15 and TailwindCSS 4.

## Features

### Core Features

- 🔐 **Email/Password Authentication** - Secure user registration and login
- ✏️ **Full CRUD Operations** - Create, read, update, and delete code snippets
- 🏷️ **Language & Topic Organization** - Snippets organized by programming language, with titles as topics
- 👤 **Public User Profiles** - Showcase your snippets with shareable profile pages
- 🔗 **Shareable URLs** - Easy sharing for snippets, languages, and profiles
- 🔍 **SEO Optimized** - Enhanced discoverability with meta tags and structured data
- 🌍 **i18n Support** - Multi-language interface support
- 📱 **Mobile-First Design** - Fully responsive across all devices

### Bonus Features

- ⚡ **Algorithm Analyzer** - Get estimated time complexity analysis (O(n), O(n²), etc.)

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [TailwindnpmCSS 4](https://tailwindcss.com/)
- **Language**: TypeScript
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: NextAuth.js v5
- **Internationalization**: next-intl
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd code-snippets
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Important:** Change the JWT_SECRET to a random, secure string in production!

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

> **Note:** The app uses localStorage for data persistence. Mock data will be automatically seeded on first visit.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
code-snippets/
├── app/                    # Next.js app router
│   ├── [locale]/          # i18n routing
│   ├── api/               # API routes
│   └── components/        # React components
├── lib/                   # Utility functions and configurations
├── prisma/                # Database schema and migrations
├── messages/              # i18n translation files
└── public/                # Static assets
```

## Data Structure

All data is stored in browser localStorage:

- **User**: Authentication and profile data
- **Snippet**: Code snippets with metadata (language field + title as topic)
- No separate Tag entity needed - snippets are filtered by language field

### Default Credentials

For testing, use these pre-seeded accounts:

- Email: `demo@example.com` | Password: `demo123`
- Email: `john@example.com` | Password: `password123`

## Development Roadmap

See [requirements.md](./requirements.md) for the complete implementation plan and project phases.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and development.

---

## Original Requirements Summary

**Project Objective**: Build a web platform where developers can share code snippets, tag them by language and topic, and get basic time complexity analysis.

**Tech Stack**: Next.js + TailwindCSS

**Core Features**:

1. ✅ CRUD for code snippets (create, edit, delete)
2. ✅ Tag snippets by languages and topic
   - **Language** = `language` field (e.g., "JavaScript", "Python")
   - **Topic** = `title` field (title represents the topic/subject)
   - No complex Tag system needed!
3. 🔄 Public user profile displaying shared snippets (Phase 4)
4. 🔄 Shareable URLs for both snippets and languages (Phase 4)
5. Basic SEO implementation (Phase 6)
6. i18n support (Phase 7)
7. ✅ Email/password-based user authentication
8. Mobile-first, responsive design (at least one page) (Phase 8)

**Bonus Features**:

1. Add a simple algorithm analyzer to display estimated time complexity (e.g., O(n), O(n²)) (Phase 9)

---

## Phase 4 Focus: Shareable URLs & Public Profiles

Based on the original requirements, Phase 4 will implement:

### 1. Shareable URLs

- Clean, SEO-friendly URLs for snippets: `/snippets/[id]/[slug]`
- Language browsing pages: `/languages/[language]`
- Public profile URLs: `/profile/[username]`
- Copy-to-clipboard share button
- Social sharing metadata (Open Graph)

### 2. Public User Profiles

- Display user's public snippets
- Show user statistics (snippet count, languages used, join date)
- Grid/list view for snippets
- Mobile-responsive design
- Shareable profile links

### 3. Language Pages

- Browse all public snippets by language
- Filter and sort options
- Language statistics
- Shareable language URLs

**Note**: Inspired by platforms like [Codefile.io](https://codefile.io), where developers can easily share and showcase their code snippets with clean, shareable URLs.
