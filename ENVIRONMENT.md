# Environment Configuration

This project uses centralized environment configuration to eliminate duplication and improve maintainability.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Application URL (required for SEO and social sharing)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# JWT Secret (change this in production!)
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=development
```

## Production Configuration

For production deployment, update the following:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_JWT_SECRET=your-production-jwt-secret-key
NODE_ENV=production
```

## Centralized Configuration

All environment variables are accessed through `lib/config/env.ts`:

```typescript
import { ENV, getFullUrl, getAbsoluteUrl } from "@/lib/config/env";

// Use ENV.APP_URL instead of process.env.NEXT_PUBLIC_APP_URL
const url = ENV.APP_URL;

// Use helper functions for URL construction
const fullUrl = getFullUrl("/snippets/123");
const absoluteUrl = getAbsoluteUrl("/profile/username");
```

## Benefits

- ✅ **No duplication** of environment variable access
- ✅ **Type safety** with centralized configuration
- ✅ **Helper functions** for common URL operations
- ✅ **Easy maintenance** - change in one place
- ✅ **Better testing** with mockable configuration
