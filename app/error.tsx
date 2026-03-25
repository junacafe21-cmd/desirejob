'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-50">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertOctagon className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h1>
          <p className="text-gray-500 text-sm mb-8">
            We encountered an unexpected error while trying to load this page. Our team has been notified.
          </p>
          <button
            onClick={() => reset()}
            className="btn-primary w-full py-3.5 justify-center gap-2 group"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Try again
          </button>
          <div className="mt-6 text-sm text-gray-400">
            Or return to the <Link href="/" className="text-brand-orange hover:underline font-medium">Homepage</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
