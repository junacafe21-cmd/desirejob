import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Desire Job Hub – Nepal's Premier Job Portal",
  description:
    "Find your dream job in Nepal. Desire Job Hub connects talented professionals with top companies across Nepal. Search and apply for jobs in Kathmandu, Pokhara, and beyond.",
  keywords: "Nepal jobs, job portal Nepal, hire in Nepal, Kathmandu jobs, career Nepal",
  openGraph: {
    title: "Desire Job Hub – Nepal's Premier Job Portal",
    description: "Find your dream job in Nepal. Connect with top companies.",
    type: "website",
    locale: "en_NP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '14px',
            },
            success: {
              style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
              iconTheme: { primary: '#16a34a', secondary: '#fff' },
            },
            error: {
              style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
              iconTheme: { primary: '#dc2626', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
