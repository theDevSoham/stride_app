"use client";

import React from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, CheckCircle, Clock, Tag, Database } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI-Powered Summaries",
      description: "Automatically generate concise task summaries using Gemini AI.",
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
    },
    {
      title: "Smart Notifications",
      description: "Stay on top of deadlines and priorities with intelligent reminders.",
      icon: <Clock className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Tag Management",
      description: "Organize tasks efficiently with customizable tags.",
      icon: <Tag className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Task Completion Tracking",
      description: "Monitor your workflow and track task progress easily.",
      icon: <CheckCircle className="w-6 h-6 text-yellow-500" />,
    },
    {
      title: "Cloud Sync & Storage",
      description: "Access your tasks from anywhere with seamless cloud synchronization.",
      icon: <Database className="w-6 h-6 text-red-500" />,
    },
  ];

  return (
    <div className="min-h-screen px-6 py-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Features That Boost Productivity</h1>
        <p className="text-lg text-gray-400">
          Stride combines AI and modern design to make managing your tasks simple, fun, and effective.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((f, idx) => (
          <Card key={idx} className="hover:shadow-xl transition cursor-pointer">
            <CardContent className="flex flex-col items-start gap-4">
              <div>{f.icon}</div>
              <CardTitle className="text-xl font-semibold">{f.title}</CardTitle>
              <CardDescription className="text-gray-600">{f.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to elevate your productivity?</h2>
        <p className="text-gray-400 mb-6">Join Stride and experience task management like never before.</p>
        <Link href="/sign-up">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-lg font-semibold shadow-lg hover:opacity-90 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
