import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentry Next.js Test App",
  description: "Testing Sentry features with Next.js",
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
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-6xl mx-auto flex gap-6">
            <a href="/" className="hover:text-blue-400 transition-colors">
              Home
            </a>
            <a href="/todo" className="hover:text-blue-400 transition-colors">
              📋 Todo App
            </a>
            <a
              href="/server-page"
              className="hover:text-blue-400 transition-colors"
            >
              Server Component
            </a>
            <a
              href="/api/test-error"
              className="hover:text-blue-400 transition-colors"
              target="_blank"
            >
              API Error Test
            </a>
            <a
              href="/api/test-performance"
              className="hover:text-blue-400 transition-colors"
              target="_blank"
            >
              API Performance Test
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
