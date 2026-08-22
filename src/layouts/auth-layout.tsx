// src/layouts/auth-layout.tsx
import { Metadata } from 'next';

export const authMetadata: Metadata = {
  description: 'EduFit Nepal - School decision intelligence platform',
  keywords: ['education', 'assessment', 'school management', 'EdTech'],
  openGraph: {
    title: 'EduFit Nepal',
    description: 'School decision intelligence platform',
    url: 'https://edufitnepal.com',
    siteName: 'EduFit Nepal',
  },
  twitter: {
    site: '@edufitnepal',
    card: 'summary_large_image',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            EduFit Nepal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            School decision intelligence platform
          </p>
        </div>
        <div className="mt-8 space-y-6">{children}</div>
      </div>
    </div>
  );
}