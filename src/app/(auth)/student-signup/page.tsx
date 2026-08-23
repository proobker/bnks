// src/app/(auth)/student-signup/page.tsx
import EmailAuthForm from '@/components/auth/EmailAuthForm';
import { authMetadata } from '@/layouts/auth-layout';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Sign Up - EduFit Nepal",
  ...authMetadata,
};

export default function StudentSignupPage() {
  return (
    <>
      <EmailAuthForm role="student" mode="signup" />
    </>
  );
}
