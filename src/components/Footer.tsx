"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-2">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">Stride</h2>
          <p className="mt-2 text-sm text-gray-400 max-w-xs">
            Simplify productivity with AI-powered task management.
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              {
                name: "Github",
                svg: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 .297a12 12 0 0 0-3.792 23.392c.6.11.82-.26.82-.577v-2.18c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.086 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997.107-.775.42-1.305.763-1.605-2.665-.304-5.466-1.334-5.466-5.93 0-1.31.467-2.382 1.236-3.222-.124-.303-.535-1.523.118-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 6 0c2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.244 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.804 5.624-5.475 5.922.432.373.816 1.102.816 2.222v3.293c0 .319.218.694.826.576A12.003 12.003 0 0 0 12 .297Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                link: "https://github.com/theDevSoham",
              },
              {
                name: "LinkedIn",
                svg: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M4.98 3.5a2.5 2.5 0 1 1-.001 5.001A2.5 2.5 0 0 1 4.98 3.5ZM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-.9 1.7-1.8 3.4-1.8 3.6 0 4.3 2.3 4.3 5.2V21h-4v-5.3c0-1.3 0-3-1.8-3s-2 1.4-2 2.9V21H9z" />
                  </svg>
                ),
                link: "https://linkedin.com/in/thedevsoham",
              },
              {
                name: "Twitter",
                svg: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                ),
                link: "https://x.com/SohamDa86358244",
              },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.link}
                aria-label={item.name}
                className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{item.name}</span>
                {item.svg}
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="grid grid-cols-1 md:grid-cols-2 text-sm justify-end">
          <div className="hidden md:block"></div>
          <div>
            <h3 className="text-white font-semibold mb-2">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-sm text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4 px-6 max-w-7xl mx-auto">
        <p>&copy; {new Date().getFullYear()} Stride. All rights reserved.</p>
      </div>
    </footer>
  );
}
