"use client";

import * as React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { DialogTitle } from "./ui/dialog";

const linksArr = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Features",
    link: "/features",
  },
];

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
        >
          Stride
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              {linksArr.map((item) => (
                <NavigationMenuItem key={item.link}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.link}
                      className="text-gray-300 hover:text-white transition"
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Links */}
          <SignedOut>
            <div className="flex gap-3">
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <UserButton />
            </div>
          </SignedIn>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md hover:bg-gray-800">
                <Menu className="h-6 w-6 text-gray-300" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 text-white p-4">
              <DialogTitle className="text-lg font-semibold">Menu</DialogTitle>
              <div className="flex flex-col gap-4 mt-6">
                {linksArr.map((item) => (
                  <Link
                    key={`${item.link}_mobile`}
                    href={item.link}
                    className="block text-gray-300 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}

                <SignedOut>
                  <div className="flex flex-col gap-2 mt-4">
                    <SignInButton mode="modal">
                      <Button className="w-full" variant="outline">
                        Sign In
                      </Button>
                    </SignInButton>
                    <Link href="/sign-up">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="flex flex-col gap-2 mt-4">
                    <Link href="/dashboard">
                      <Button className="w-full">Dashboard</Button>
                    </Link>
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
