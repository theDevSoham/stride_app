"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Stride
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Stride is your ultimate task management companion, blending cutting-edge AI assistance with modern design to help you focus, organize, and achieve more every day.
            </p>
            <Button size="lg">Get Started</Button>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <Image
              src="/about-hero.png"
              alt="About Hero"
              width={500}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Story
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-400 mb-4">
              Founded in 2025, Stride started as a small project to help professionals manage their daily workflow seamlessly. Our mission is to make productivity intuitive, beautiful, and smart.
            </p>
            <p className="text-gray-400">
              With a dedicated team of developers, designers, and AI specialists, we combine technology and creativity to craft a tool that is not just functional but delightful to use.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image
              src="/team.png"
              alt="Team"
              width={500}
              height={350}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-2">Innovation</h3>
            <p className="text-gray-400">
              We embrace cutting-edge technology and creative thinking to deliver a product that feels modern and smart.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-2">User Focus</h3>
            <p className="text-gray-400">
              Everything we design is made with our users in mind. Simplicity and clarity are at the heart of our experience.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-2">Collaboration</h3>
            <p className="text-gray-400">
              We thrive on teamwork and transparency, believing that great ideas come from collective creativity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
