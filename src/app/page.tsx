"use client";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-gray-900 text-white p-6 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400">
          🚀 SmartTask
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Organize your tasks efficiently, boost productivity, and never miss a
          deadline. SmartTask adapts to your workflow to save time and reduce
          stress.
        </p>

        {/* Auth Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white transition">
                Sign In
              </Button>
            </SignInButton>

            <Button variant="outline" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <UserButton />
          </SignedIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
        <Card className="bg-gray-800 hover:bg-gray-700 transition-shadow shadow-lg">
          <CardHeader>
            <CardTitle>📅 Smart Scheduling</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Automatically organize tasks by priority and deadlines, ensuring
              you focus on what matters most.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 hover:bg-gray-700 transition-shadow shadow-lg">
          <CardHeader>
            <CardTitle>⚡ Boost Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Insights, reminders, and smart suggestions help you get more done
              in less time.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 hover:bg-gray-700 transition-shadow shadow-lg">
          <CardHeader>
            <CardTitle>🔒 Secure & Private</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Your tasks are encrypted and private, giving you peace of mind
              while you organize your day.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Footer CTA for signed-out users */}
      <SignedOut>
        <section className="text-center max-w-3xl">
          <p className="text-xl md:text-2xl mb-4">
            Start organizing your life today!
          </p>
          <div className="flex justify-center gap-4">
            <SignInButton mode="modal">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Sign In
              </Button>
            </SignInButton>
            <Button variant="outline" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </section>
      </SignedOut>
    </main>
  );
}
