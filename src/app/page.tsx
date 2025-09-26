"use client";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">🚀 SmartTask</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-lg text-muted-foreground mb-6">
            Organize your tasks smartly, stay productive, and save time.
          </p>

          {/* Shown only to logged-out users */}
          <SignedOut>
            <div className="flex gap-4 justify-center">
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>

              <Button variant="secondary" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>

          {/* Shown only to logged-in users */}
          <SignedIn>
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl">Welcome back 👋</p>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <UserButton />
            </div>
          </SignedIn>
        </CardContent>
      </Card>
    </main>
  );
}
