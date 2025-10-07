# Code Snippets Platform - Requirements & Implementation Plan

## Project Overview

A frontend-only web platform where developers can share code snippets, tag them by language and topic, and get basic time complexity analysis.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS 4
- **Language**: TypeScript
- **Data Storage**: localStorage (client-side persistence)
- **Authentication**: JWT-based with jsonwebtoken
- **Internationalization**: next-intl
- **Code Highlighting**: Prism.js
- **Deployment**: Vercel

---

## Phase 1: Project Setup & Foundation (Steps 1-3)

### Step 1: Install Core Dependencies ✅

- [x] Install next-intl for internationalization
- [x] Install react-icons for UI icons
- [x] Install zod for validation
- [x] Install react-hook-form for forms
- [x] Install date-fns for date formatting
- [x] Install prismjs for code highlighting
- [x] Install jsonwebtoken for JWT authentication
- [x] Install @types/jsonwebtoken for TypeScript types

### Step 2: Data Models & Storage Setup ✅

Create TypeScript interfaces and localStorage utilities:

- [x] **User Interface**

  - id, email, name, username, password
  - createdAt, updatedAt

- [x] **Snippet Interface**

  - id, title, description, code, language
  - authorId, isPublic, timeComplexity (optional)
  - createdAt, updatedAt
  - Note: `title` represents the topic, `language` is the programming language
  - No separate tags array needed - use language field for categorization

- [x] **localStorage Utilities**
  - Functions to save/load users and snippets
  - Mock data seeding for development
  - Helper functions for filtering snippets by language

### Step 3: Project Structure Setup ✅

Create the following directory structure:

```
app/
├── login/                # Login page
├── register/             # Register page
├── dashboard/            # User dashboard (requires auth)
├── snippets/
│   ├── new/              # Create new snippet
│   ├── [id]/             # View snippet details
│   │   └── edit/         # Edit snippet
│   └── [id]/[slug]/      # Shareable snippet URL with slug
├── languages/
│   └── [language]/       # Browse snippets by language
├── profile/
│   └── [username]/       # Public user profile
└── settings/             # User settings (requires auth)
components/
    ├── ui/               # Reusable UI components
    ├── snippets/         # Snippet-specific components
    ├── auth/             # Auth-specific components
    └── layout/           # Layout components
lib/
├── data/                 # Data management
│   ├── storage.ts        # localStorage helpers
│   ├── mock-data.ts      # Mock data for development
│   └── types.ts          # TypeScript interfaces
├── auth/                 # Authentication
│   ├── jwt.ts            # JWT utilities
│   └── auth-service.ts   # Auth functions
├── validations/          # Zod schemas
└── utils/                # Helper functions
messages/                 # i18n translations
├── en.json
└── es.json
```

---

## Phase 2: Core Features - Authentication (Steps 4-6)

### Step 4: JWT Authentication System

- [ ] Create JWT utilities (sign, verify, decode)
- [ ] Set up JWT_SECRET in environment variables
- [ ] Implement token storage in localStorage
- [ ] Create auth service functions (login, register, logout, getCurrentUser)

### Step 5: Mock User Data & Auth

- [ ] Create mock user data with pre-defined users
- [ ] Implement login function (validate credentials, create JWT)
- [ ] Implement register function (create new user, store in localStorage)
- [ ] Create auth context and hooks for React components
- [ ] Add session management

### Step 6: Authentication UI

- [ ] Create login page with email/password form
- [ ] Create registration page with validation
- [ ] Add form error handling and loading states
- [ ] Add password strength indicator on registration
- [ ] Implement logout functionality
- [ ] Create protected route middleware

---

## Phase 3: Core Features - Snippet CRUD (Steps 7-13)

### Step 7: Snippet Data Management

- [ ] Create snippet CRUD functions using localStorage
- [ ] Implement snippet filtering (by language, topic, author)
- [ ] Add search functionality (title, description, code)
- [ ] Create snippet validation schemas with Zod
- [ ] Add pagination utilities

### Step 8: Create Snippet Page

- [ ] Build form with:
  - Title input
  - Description textarea
  - Code editor (textarea with syntax highlighting preview)
  - Language selector (dropdown)
  - Topic/tag multi-select
  - Public/private toggle
- [ ] Client-side validation with zod + react-hook-form
- [ ] Add live code preview with syntax highlighting
- [ ] Success/error toast notifications
- [ ] Save to localStorage on submit

### Step 9: Snippet List/Dashboard Page

- [ ] Display user's snippets in responsive grid/list view
- [ ] Add filters: by language, by topic, by date
- [ ] Add search functionality
- [ ] Implement pagination
- [ ] Show snippet metadata (language, tags, date)
- [ ] Add action buttons (edit, delete, share)
- [ ] Mobile-first responsive design

### Step 10: Snippet Detail Page

- [ ] Display snippet with syntax-highlighted code
- [ ] Show title, description, author, date, tags
- [ ] Add copy-to-clipboard button
- [ ] Display time complexity (if available)
- [ ] Add edit/delete buttons (if owner)
- [ ] Implement shareable URL functionality
- [ ] Add dynamic meta tags for SEO

### Step 11: Edit Snippet Page

- [ ] Pre-populate form with existing snippet data
- [ ] Reuse create snippet form component
- [ ] Add confirmation before navigating away with unsaved changes
- [ ] Show last updated timestamp
- [ ] Update localStorage on save

### Step 12: Delete Snippet Functionality

- [ ] Add delete button with confirmation modal
- [ ] Remove from localStorage
- [ ] Redirect to dashboard after deletion
- [ ] Show success notification

### Step 13: Code Syntax Highlighting

- [ ] Install and configure Prism.js
- [ ] Support major languages: JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby
- [ ] Add theme support (light/dark mode)
- [ ] Add line numbers
- [ ] Add copy-to-clipboard button
- [ ] Responsive code blocks

---

## Phase 4: Shareable URLs & Public Profiles (Steps 14-16)

### Step 14: Shareable URLs for Snippets

- [ ] Implement clean, shareable URLs: `/snippets/[id]/[slug]`
- [ ] Create "Share" button component with copy-to-clipboard
- [ ] Add share success notification/toast
- [ ] Generate URL-friendly slugs from snippet titles
- [ ] Test URL sharing across different sessions/browsers
- [ ] Add social sharing preview (Open Graph tags)

### Step 15: Language Pages & Filtering

- [ ] Create dynamic route `/languages/[language]`
- [ ] Display all public snippets for a specific language
- [ ] Add language badge/icon component
- [ ] Show snippet count per language
- [ ] Implement sorting options (newest, oldest, most viewed)
- [ ] Add shareable URLs for language pages
- [ ] Add dynamic SEO meta tags for language pages

### Step 16: Public User Profiles

- [ ] Create dynamic route `/profile/[username]`
- [ ] Display user info: name, username, join date
- [ ] Show all public snippets by the user
- [ ] Display user statistics:
  - Total public snippets count
  - Languages used (with counts)
  - Most recent activity date
- [ ] Add grid/list view toggle for snippets
- [ ] Implement shareable profile URLs
- [ ] Add dynamic SEO meta tags for profiles
- [ ] Mobile-first responsive design

---

## Phase 5: User Settings & Management (Steps 17-18)

### Step 17: Profile Settings Page

- [ ] Create settings page for authenticated user (`/settings`)
- [ ] Update name and username fields
- [ ] Change password functionality
- [ ] Form validation with Zod
- [ ] Update localStorage on save
- [ ] Success/error notifications
- [ ] Preview how profile looks to others
- [ ] Delete account functionality (optional)

### Step 18: User Dashboard Enhancements

- [ ] Add "My Profile" link to view own public profile
- [ ] Show quick stats on dashboard:
  - Total snippets (public + private)
  - Most used languages
  - Recent activity
- [ ] Add quick actions: Create snippet, View profile
- [ ] Implement "Recently viewed" snippets section
- [ ] Add filter by public/private snippets

---

## Phase 6: SEO & Social Sharing (Steps 19-21)

### Step 19: SEO Implementation

- [ ] Generate dynamic metadata for snippet pages
  - Title: `{snippet.title} by @{author.username}`
  - Description: snippet description (first 160 chars)
  - OG tags for social sharing
  - Twitter Card tags
- [ ] Generate dynamic metadata for language pages
  - Title: `{Language} Code Snippets`
  - Description: `Browse {count} {language} code snippets`
  - Language-specific keywords
- [ ] Generate dynamic metadata for profile pages
  - Title: `@{username}'s Code Snippets`
  - Description: `{count} snippets in {languages}`
  - User-specific keywords
- [ ] Add sitemap.xml generation (optional)
- [ ] Add robots.txt
- [ ] Implement JSON-LD structured data for snippets

### Step 20: Social Sharing Optimization

- [ ] Add Open Graph meta tags for all public pages
  - og:title, og:description, og:image
  - og:type = "article" for snippets
- [ ] Add Twitter Card meta tags
  - twitter:card = "summary_large_image"
  - twitter:title, twitter:description
- [ ] Create default OG image for snippets (with code preview)
- [ ] Test sharing with Facebook/Twitter/LinkedIn preview tools
- [ ] Ensure proper fallbacks for missing data

### Step 21: URL Structure & Navigation

- [ ] Ensure all URLs are clean and semantic
  - `/snippets/[id]/[slug]` for snippet details
  - `/languages/[language]` for language pages
  - `/profile/[username]` for user profiles
- [ ] Add breadcrumb navigation
- [ ] Implement "Back to..." navigation links
- [ ] Add "Related snippets" section (same language/author)
- [ ] Create sitemap for all public URLs

---

## Phase 7: Internationalization (Steps 22-23)

### Step 22: i18n Setup with next-intl

- [ ] Install and configure next-intl
- [ ] Set up locale routing: `/en/...`, `/es/...`
- [ ] Configure middleware for locale detection
- [ ] Create translation message files:
  - Common UI elements
  - Auth pages
  - Form labels and validation errors
  - Navigation
  - Error messages
- [ ] Add language switcher component in navigation

### Step 23: i18n Implementation

- [ ] Translate all static text across the app
- [ ] Handle date/time localization with date-fns
- [ ] Test language switching functionality
- [ ] Save language preference to localStorage
- [ ] Ensure RTL support structure (optional)
- [ ] Test all pages in both languages

---

## Phase 8: Responsive Design & UX (Steps 24-25)

### Step 24: Mobile-First Responsive Design

- [ ] Ensure all pages are mobile-responsive
- [ ] Test on various screen sizes:
  - Mobile: 320px, 375px, 414px
  - Tablet: 768px, 834px
  - Desktop: 1024px, 1440px, 1920px
- [ ] Implement hamburger menu for mobile navigation
- [ ] Optimize touch targets (minimum 44x44px)
- [ ] Test form inputs on mobile devices
- [ ] Ensure code blocks are horizontally scrollable
- [ ] Test with real mobile devices

### Step 25: UI/UX Polish

- [ ] Implement consistent spacing and typography system
- [ ] Add loading states and skeleton screens
- [ ] Add empty states (no snippets, no results, no tags)
- [ ] Implement error boundaries
- [ ] Add toast notifications for all actions
- [ ] Ensure accessibility:
  - ARIA labels
  - Keyboard navigation
  - Focus management
  - Semantic HTML
- [ ] Add smooth transitions and animations
- [ ] Implement dark mode (optional)

---

## Phase 9: BONUS - Algorithm Complexity Analyzer (Steps 26-27)

### Step 26: Complexity Analyzer Implementation

Create a simple heuristic-based analyzer:

- [ ] Analyze code for common patterns:
  - Single loop → O(n)
  - Nested loops → O(n²), O(n³)
  - Binary search pattern → O(log n)
  - Recursive calls → Estimate based on pattern
  - Hash map/object lookups → O(1)
  - Sort operations → O(n log n)
- [ ] Support multiple languages:
  - JavaScript/TypeScript
  - Python
  - Java
  - (More if time permits)
- [ ] Return complexity estimate with explanation
- [ ] Handle edge cases and unknown patterns

### Step 27: Analyzer UI Integration

- [ ] Add "Analyze Complexity" button on create/edit page
- [ ] Display analysis result with explanation
  - Example: "Estimated: O(n²) - Nested loops detected"
- [ ] Save complexity result to snippet data
- [ ] Display complexity badge on snippet detail page
- [ ] Add complexity filter on snippet lists
- [ ] Show complexity in snippet cards
- [ ] Add help/info tooltip explaining Big O notation

---

## Success Criteria

- ✅ Users can register and login with email/password (JWT-based)
- ✅ Users can create, read, update, and delete code snippets
- ✅ Snippets are organized by language (field) and topic (title)
- ✅ Each user has a public profile displaying their public snippets
- ✅ Snippets, languages, and profiles have shareable URLs
- ✅ Basic SEO implementation with meta tags and structured data
- ✅ i18n support for at least 2 languages (English & Spanish)
- ✅ Mobile-first responsive design on all pages
- ✅ (Bonus) Basic algorithm complexity analyzer

---

## Development Timeline Estimate

- **Phase 1**: 0.5 day (Setup & Dependencies)
- **Phase 2**: 1-2 days (Authentication)
- **Phase 3**: 2-3 days (Snippet CRUD)
- **Phase 4**: 1-2 days (Shareable URLs & Public Profiles)
- **Phase 5**: 0.5-1 day (User Settings)
- **Phase 6**: 1-2 days (SEO & Social Sharing)
- **Phase 7**: 1-2 days (i18n)
- **Phase 8**: 1-2 days (Responsive & UX)
- **Phase 9**: 1-2 days (Bonus Analyzer)

**Total**: ~9-15 days of development

---

## Data Persistence Strategy

All data is stored in **localStorage** with the following keys:

- `authToken` - JWT token for current session
- `authCredentials` - User credentials (email/password) for demo auth
- `users` - Array of all user profiles (public data only)
- `snippets` - Array of all snippets
- `language` - User's preferred UI language (en/es)

**Simplified Data Model:**

- **No separate Tag entity** - Snippets are organized by:
  - `language` field (e.g., "JavaScript", "Python")
  - `title` field (which represents the topic/subject)
- Language pages aggregate snippets by the `language` field
- Search/filtering is done directly on snippet fields

**Shareable URLs Work Because:**

- Public snippets (`isPublic: true`) are stored in localStorage accessible to all users
- When sharing a URL, any user can view public snippets
- Pre-seeded mock data ensures consistent demo experience
- In production, this would be replaced with a backend database
