import Link from 'next/link'

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to the Hackathon Starter
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        A boilerplate for building full-stack apps with Vite, React, Supabase, and more.
      </p>
      <div className="space-x-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}