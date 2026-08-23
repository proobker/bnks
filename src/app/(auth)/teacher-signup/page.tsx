// src/app/(auth)/teacher-signup/page.tsx
import EmailAuthForm from '@/components/auth/EmailAuthForm';
import { authMetadata } from '@/layouts/auth-layout';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Sign Up - EduFit Nepal",
  ...authMetadata,
};

export default function TeacherSignupPage() {
  return (
    <>
      <EmailAuthForm role="teacher" mode="signup" />
    </>
  );
}
