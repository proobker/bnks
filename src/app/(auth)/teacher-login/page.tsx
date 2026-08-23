// src/app/(auth)/teacher-login/page.tsx
import EmailAuthForm from '@/components/auth/EmailAuthForm';
import { authMetadata } from '@/layouts/auth-layout';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Login - EduFit Nepal",
  ...authMetadata,
};

export default function TeacherLoginPage() {
  return (
    <>
      <EmailAuthForm role="teacher" mode="login" />
    </>
  );
}
