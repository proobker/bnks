import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import NavAuth from '@/components/auth/NavAuth';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduFit Nepal - EdTech Readiness Platform",
  description: "Helping schools avoid failed EdTech investments by analyzing readiness and student access",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="red" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {/* Navigation */}
          <nav className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href="/" className="text-xl font-bold text-primary tracking-tight">
                    EduFit Nepal
                  </a>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <a
                      href="/assessment"
                      className="px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:text-primary-hover hover:bg-slate-50"
                    >
                      School Assessment
                    </a>
                    <a
                      href="/student"
                      className="px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:text-primary-hover hover:bg-slate-50"
                    >
                      Student Survey
                    </a>
                    <a
                      href="/recommendations"
                      className="px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:text-primary-hover hover:bg-slate-50"
                    >
                      Recommendations
                    </a>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <NavAuth />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
        </AuthProvider>
      </body>
    </html>
  );
}