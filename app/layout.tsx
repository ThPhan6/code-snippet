import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth/auth-context";
import { I18nProvider } from "../lib/i18n/context";
import { initializeApp } from "../lib/init-app";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ENV } from "../lib/config/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Code Snippets Platform",
    template: "%s | Code Snippets Platform",
  },
  description:
    "Share and discover code snippets with the developer community. Browse programming examples, learn from developers, and showcase your code.",
  keywords: [
    "code snippets",
    "programming",
    "developer tools",
    "code examples",
    "programming languages",
    "software development",
  ],
  authors: [{ name: "Code Snippets Platform" }],
  creator: "Code Snippets Platform",
  publisher: "Code Snippets Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(ENV.APP_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Code Snippets Platform",
    description:
      "Share and discover code snippets with the developer community",
    siteName: "Code Snippets Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Snippets Platform",
    description:
      "Share and discover code snippets with the developer community",
    creator: "@codesnippets",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <I18nProvider>
            <AuthProvider>
              <AppInitializer />
              {children}
            </AuthProvider>
          </I18nProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

// Component to initialize app data on client side
function AppInitializer() {
  if (typeof window !== "undefined") {
    initializeApp();
  }
  return null;
}
