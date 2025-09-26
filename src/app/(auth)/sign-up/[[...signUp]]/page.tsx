"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
