// src/app/(auth)/teacher-login/page.tsx
import TeacherLoginForm from '@/components/auth/TeacherLoginForm';
import { authMetadata } from '@/layouts/auth-layout';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Login - EduFit Nepal",
  ...authMetadata,
};

export default function TeacherLoginPage() {
  return (
    <>
      <TeacherLoginForm />
    </>
  );
}