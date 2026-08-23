// src/app/(auth)/login/page.tsx
import EmailAuthForm from '@/components/auth/EmailAuthForm';
import { authMetadata } from '@/layouts/auth-layout';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - EduFit Nepal",
  ...authMetadata,
};

export default function LoginPage() {
  return (
    <>
      <EmailAuthForm mode="login" />
    </>
  );
}
