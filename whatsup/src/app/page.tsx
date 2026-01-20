"use client";

import { useState, useEffect, useRef } from "react";
import Menu from "@/components/menu/menu-texts";
import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
  id: string;
  imageSrc: string;
  date: string;
  org: string;
  orgLink?: string;
  title: string;
  description: string;
  link: string;
}

export default function Overview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const images = ["/scifed.jpg", "/set.jpg", "/kapehan.jpg"];

  useEffect(() => {
    const loadEvents = () => {
      try {
        const storedEvents =
          typeof window !== "undefined" ? localStorage.getItem("events") : null;
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents);
          const sortedEvents = [...parsedEvents].sort((a: any, b: any) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          setEvents(sortedEvents);
        }
      } catch (e) {
        console.error("Failed to parse events", e);
      }
    };

    loadEvents();
    window.addEventListener("storage", loadEvents);
    return () => window.removeEventListener("storage", loadEvents);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 6000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  return (
    <Menu activeLink="overview">
      <div className="flex flex-col min-h-screen bg-slate-50">
        <div className="relative w-full h-[85vh] overflow-hidden bg-black group">
          {images.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover opacity-70"
                priority={index === 0}
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-black/70 to-black/20" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              What's <span className="text-amber-400">UP?</span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-100 font-light mb-8 max-w-3xl drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Mga Iskolar ng Bayan
            </p>
            <p className="text-gray-200 max-w-2xl text-sm md:text-base leading-relaxed hidden md:block animate-in fade-in duration-1000 delay-300 drop-shadow">
              Interested to know the various activities and announcements the UP
              Cebu organization have in store for us? You came to the right
              place! Get connected and stay informed.
            </p>

            <Link
              href="/events"
              className="mt-8 px-8 py-3 bg-amber-500 text-red-900 font-bold rounded-full hover:bg-amber-400 hover:scale-105 transition-all shadow-lg shadow-amber-500/30 animate-in fade-in duration-1000 delay-500"
            >
              Explore Events
            </Link>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-20"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-20"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
                  idx === currentIndex
                    ? "bg-amber-400 w-8"
                    : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="w-full bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900">
                  Latest Updates
                </h2>
                <div className="h-1 w-20 bg-red-900 mt-2 rounded-full"></div>
              </div>
              <Link
                href="/events"
                className="hidden md:flex items-center text-red-900 font-bold hover:text-red-700 transition-colors gap-1"
              >
                View All <span className="text-lg">→</span>
              </Link>
            </div>

            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.slice(0, 3).map((event, index) => (
                  <div
                    key={event.id || index}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full hover:-translate-y-1"
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                      <img
                        src={event.imageSrc}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-red-900 shadow-sm uppercase tracking-wide">
                        {formatDate(event.date)}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-2">
                        {event.orgLink ? (
                          <a
                            href={event.orgLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-amber-600 uppercase tracking-wider hover:underline"
                          >
                            {event.org}
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                            {event.org}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-900 transition-colors">
                        {event.link ? (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {event.title}
                          </a>
                        ) : (
                          event.title
                        )}
                      </h3>

                      <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                        {event.description}
                      </p>

                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-bold text-red-900 hover:text-red-700 mt-auto"
                        >
                          Read More
                          <svg
                            className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-dashed border-gray-300 text-center">
                <p className="text-gray-400">
                  No announcements yet. Check back later!
                </p>
              </div>
            )}

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/events"
                className="inline-block px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-50"
              >
                View All Announcements
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Menu>
  );
}
