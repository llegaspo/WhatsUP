"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import LoginModal from "@/components/modals/login";
import LogoutIcon from "@/components/ui/LogoutIcon";
import UserIcon from "@/components/ui/UserIcon";
import RegisterModal from "../modals/register";

interface MenuProps {
  children: ReactNode;
  activeLink: string;
}

export default function Menu({ children, activeLink }: MenuProps) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const user = session?.user;

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeLoginModal = () => setIsLoginOpen(false);
  const closeRegisterModal = () => setIsRegisterOpen(false);

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
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
              {isLoading ? (
                // Loading Skeleton
                <div className="h-10 w-10 animate-pulse rounded-full bg-red-800" />
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-500/50 bg-amber-400 text-lg font-black text-red-900 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 focus:outline-none"
                  >
                    {getUserInitial()}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-xl bg-white py-1 shadow-2xl ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-200">
                      <div className="border-b border-gray-100 px-4 py-3">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="truncate text-sm font-bold text-gray-900">
                          {user.name || "User"}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#B22222]"
                      >
                        Your Profile
                      </Link>

                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogoutIcon />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
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
          <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            More Info
          </span>
        </Link>
      </div>

      <LoginModal
        open={isLoginOpen}
        onClose={closeLoginModal}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal
        open={isRegisterOpen}
        onClose={closeRegisterModal}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}
