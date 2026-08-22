// src/app/(auth)/student-login/page.tsx
import StudentGoogleButton from '@/components/auth/StudentGoogleButton';
import { authMetadata } from '@/layouts/auth-layout';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Login - EduFit Nepal",
  ...authMetadata,
};

export default function StudentLoginPage() {
  return (
    <>
      <StudentGoogleButton />
    </>
  );
}