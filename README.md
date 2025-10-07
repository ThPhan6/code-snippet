# Code Snippets Platform

A modern web platform where developers can share code snippets, organize them by language and topic, and analyze time complexity. Built with Next.js 15 and TailwindCSS 4.

## ✨ Features

### Core Features

- 🔐 **JWT Authentication** - Secure user registration and login with JWT tokens
- ✏️ **Full CRUD Operations** - Create, read, update, and delete code snippets
- 🏷️ **Language & Topic Organization** - Snippets organized by programming language, with titles as topics
- 👤 **Public User Profiles** - Showcase your snippets with shareable profile pages
- 🔗 **Shareable URLs** - Clean, SEO-friendly URLs for snippets, languages, and profiles
- 🔍 **Advanced SEO** - Dynamic meta tags, structured data, and sitemap generation
- 🌍 **i18n Support** - Multi-language interface support (English/Spanish)
- 📱 **Mobile-First Design** - Fully responsive across all devices
- 🎨 **Modern UI** - Beautiful interface with TailwindCSS 4
- ⚡ **Algorithm Complexity Analyzer** - Get estimated time complexity analysis (O(n), O(n²), etc.)

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Language**: TypeScript
- **Authentication**: JWT with jsonwebtoken
- **Data Storage**: localStorage (client-side)
- **Internationalization**: next-intl
- **Code Highlighting**: Prism.js
- **Forms**: React Hook Form + Zod validation
- **Icons**: React Icons
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd code-snippets
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the project root:

```env
# Application URL (required for SEO and social sharing)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# JWT Secret (change this in production!)
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=development
```

> **Important:** Change the JWT_SECRET to a random, secure string in production!

### Environment Configuration

This project uses centralized environment configuration. See [ENVIRONMENT.md](./ENVIRONMENT.md) for detailed setup instructions.

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

## 📁 Project Structure

```
code-snippets/
├── app/
│   ├── dashboard/                 # User dashboard (protected)
│   ├── languages/[language]/      # Language browsing pages
│   ├── login/                     # Authentication pages
│   ├── register/                  # User registration
│   ├── profile/[username]/        # Public user profiles
│   ├── snippets/                  # Snippet management
│   │   ├── new/                   # Create new snippet
│   │   ├── [id]/[slug]/           # View snippet (SEO-friendly URLs)
│   │   └── [id]/edit/             # Edit snippet
│   ├── sitemap.xml/               # Dynamic sitemap generation
│   ├── robots.txt                 # SEO robots file
│   ├── layout.tsx                 # Root layout with SEO
│   └── page.tsx                   # Home page
├── components/
│   ├── auth/                      # Authentication components
│   │   ├── LoginForm.tsx          # Login form
│   │   └── RegisterForm.tsx       # Registration form
│   ├── snippets/                  # Snippet components
│   │   ├── SnippetCard.tsx        # Snippet display card
│   │   └── SnippetForm.tsx        # Create/edit form
│   ├── ui/                        # Reusable UI components
│   │   ├── ComplexityAnalyzer.tsx # Algorithm complexity analyzer
│   │   ├── LanguageBadge.tsx      # Language display badge
│   │   ├── LanguageSelector.tsx   # Language selection
│   │   └── ShareButton.tsx        # Social sharing button
│   └── ErrorBoundary.tsx          # Error handling
├── lib/                           # Core Utilities
│   ├── analysis/                  # Algorithm analysis
│   │   └── complexity-analyzer.ts # Time complexity analyzer
│   ├── auth/                      # Authentication system
│   │   ├── auth-context.tsx       # React context
│   │   ├── auth-service.ts        # Auth business logic
│   │   ├── jwt.ts                 # JWT utilities
│   │   └── protected-route.tsx    # Route protection
│   ├── config/                    # Configuration
│   │   └── env.ts                 # Centralized environment config
│   ├── data/                      # Data management
│   │   ├── mock-data.ts           # Development mock data
│   │   ├── storage.ts             # localStorage utilities
│   │   └── types.ts               # TypeScript interfaces
│   ├── i18n/                      # Internationalization
│   │   ├── context.tsx            # i18n React context
│   │   └── translations.ts         # Translation files
│   ├── seo/                       # SEO optimization
│   │   ├── metadata.ts            # Dynamic meta tags
│   │   ├── structured-data.ts     # JSON-LD structured data
│   │   └── sitemap.ts             # Sitemap generation
│   ├── snippets/                 # Snippet management
│   │   └── snippet-service.ts     # CRUD operations
│   ├── utils/                     # Helper functions
│   │   └── helpers.ts             # Utility functions
│   ├── validations/               # Form validation
│   │   └── schemas.ts             # Zod schemas
│   └── init-app.ts               # App initialization
├── messages/                      # i18n translation files
├── public/                        # Static assets
├── .env.local                     # Environment variables (create this)
├── ENVIRONMENT.md                 # Environment setup guide
├── requirements.md                # Project requirements
└── README.md                      # This file
```

## 📊 Data Structure

All data is stored in browser localStorage:

- **User**: Authentication and profile data
- **Snippet**: Code snippets with metadata (language field + title as topic)

## 🔧 Development

### Key Features Implemented

- ✅ **JWT Authentication System** - Complete user registration and login
- ✅ **CRUD Operations** - Full snippet management
- ✅ **SEO Optimization** - Dynamic meta tags, structured data, sitemap
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Algorithm Analysis** - Time complexity analyzer
- ✅ **Internationalization** - Multi-language support
- ✅ **Environment Configuration** - Centralized config management

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow TypeScript best practices
2. Use ESLint for code quality
3. Maintain responsive design
4. Test all functionality
5. Update documentation

## 📄 License

MIT License - feel free to use this project for learning and development.
