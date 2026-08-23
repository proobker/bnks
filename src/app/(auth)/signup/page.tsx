// src/app/(auth)/signup/page.tsx
import EmailAuthForm from '@/components/auth/EmailAuthForm';
import { authMetadata } from '@/layouts/auth-layout';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - EduFit Nepal",
  ...authMetadata,
};

export default function SignupPage() {
  return (
    <>
      <EmailAuthForm mode="signup" />
    </>
  );
}
