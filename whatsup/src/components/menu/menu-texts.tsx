"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState } from "react";
import LoginModal from "@/components/modals/login";

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

interface MenuProps {
  children: ReactNode;
  activeLink: string;
}

export default function Menu({ children, activeLink }: MenuProps) {
  // --- State ---
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleLoginClick = () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (email === "admin@legaspo.com" && password === "legaspo123") {
      setIsLoggedIn(true);
      setError("");
      setOpen(false);
    } else {
      setError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  const closeModal = () => {
    setOpen(false);
    setError("");
  };

  const getLinkClass = (linkName: string) => {
    const baseClass =
      "relative px-3 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-300 rounded-lg group";
    const activeClass = "text-amber-400 bg-white/10 shadow-inner";
    const inactiveClass = "text-red-100 hover:text-white hover:bg-white/5";

    return `${baseClass} ${activeLink === linkName ? activeClass : inactiveClass}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full bg-red-900/95 backdrop-blur-md border-b border-red-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/appicon.png"
                  alt="What's UP Logo"
                  fill
                  className="object-contain drop-shadow-md"
                />
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                What's <span className="text-amber-400">UP?</span>
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <Link href="/" className={getLinkClass("overview")}>
                Overview
                {activeLink === "overview" && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                )}
              </Link>
              <Link href="/calendar" className={getLinkClass("calendar")}>
                Calendar
                {activeLink === "calendar" && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                )}
              </Link>
              <Link href="/events" className={getLinkClass("events")}>
                Events
                {activeLink === "events" && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                )}
              </Link>
            </nav>

            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="text-xs text-red-200 font-medium uppercase tracking-wider">
                      Welcome
                    </p>
                    <p className="text-sm font-bold text-white">Admin</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 bg-red-950 text-red-200 rounded-full hover:bg-red-800 hover:text-white transition-colors border border-red-800"
                    title="Logout"
                  >
                    <LogoutIcon />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-500/30 bg-gradient-to-r from-red-950 to-red-900 text-amber-50 font-bold text-sm shadow-md hover:shadow-amber-500/20 hover:border-amber-500/60 hover:text-amber-400 transition-all duration-300"
                >
                  <UserIcon />
                  <span>Log in</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full">{children}</main>

      <div className="fixed bottom-6 left-6 z-40">
        <Link
          href="/fb-pages"
          className="group relative flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg shadow-black/10 hover:shadow-xl hover:scale-110 transition-all duration-300 border border-gray-100 overflow-hidden"
        >
          <Image
            src="/icon.png"
            alt="Information"
            width={28}
            height={28}
            className="opacity-80 group-hover:opacity-100 transition-opacity"
          />
          {/* Tooltip */}
          <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            More Info
          </span>
        </Link>
      </div>

      {/* --- Login Modal --- */}
      <LoginModal
        open={open}
        onClose={closeModal}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        handleLoginClick={handleLoginClick}
      />
    </div>
  );
}

