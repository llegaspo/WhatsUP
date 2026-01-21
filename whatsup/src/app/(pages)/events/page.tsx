"use client";

import { useState, useEffect } from "react";
import Menu from "@/components/menu/menu-texts";
import { v4 as uuidv4 } from "uuid";
import Icons from "@/components/events/icons";
import EventCard, { EventCardProps } from "@/components/events/eventCards";
import EventFormModal from "@/components/events/eventModal";
import { useSession } from "next-auth/react";

export default function Events() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fullScreenEvent, setFullScreenEvent] = useState<null | EventCardProps>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const emptyEventState = {
    title: "",
    description: "",
    org: "",
    orgLink: "",
    imageSrc: "",
    date: "",
    link: "",
  };

  const [formData, setFormData] =
    useState<Omit<EventCardProps, "id">>(emptyEventState);

  const defaultEvents: EventCardProps[] = [
    {
      id: "1",
      imageSrc: "/scifed.jpg",
      date: "2025-05-15",
      org: "UP Cebu Official",
      orgLink: "https://www.facebook.com/upcebuofficial",
      title: "Annual Research Symposium 2025",
      description:
        "Join the academic community as we explore groundbreaking research. Innovation starts here. Lorem ipsum dolor sit amet.",
      link: "https://facebook.com/",
    },
    {
      id: "2",
      imageSrc: "/set.jpg",
      date: "2025-05-13",
      org: "Sciences Federation",
      orgLink: "https://www.facebook.com/sciencesfed",
      title: "Science Week: Opening Gala",
      description:
        "A night of celebration for the sciences. Dress code is formal. Food and drinks will be served.",
      link: "https://facebook.com/",
    },
    {
      id: "3",
      imageSrc: "/kapehan.jpg",
      date: "2025-05-10",
      org: "Computer Science Guild",
      orgLink: "https://www.facebook.com/UPCSG",
      title: "Tech Talk: The Future of AI",
      description:
        "Inviting all CS students to a discussion on Generative AI and Ethics.",
      link: "https://facebook.com/",
    },
  ];

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("events");
        setEvents(saved ? JSON.parse(saved) : defaultEvents);
      }
    } catch {
      setEvents(defaultEvents);
    }
  }, []);

  const handleSaveNew = () => {
    if (!session) return;
    if (!formData.title || !formData.description || !formData.date) return;
    const newEventWithId = { id: uuidv4(), ...formData };
    const updated = [newEventWithId, ...events];
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
    setFormData(emptyEventState);
    setShowModal(false);
  };

  const handleUpdate = () => {
    if (!session) return;
    if (editingIndex === null) return;
    const updatedEvents = [...events];
    updatedEvents[editingIndex] = {
      ...updatedEvents[editingIndex],
      ...formData,
    };
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setEditModalOpen(false);
    setEditingIndex(null);
    setFormData(emptyEventState);
  };

  const openEditModal = (index: number) => {
    if (!session) return;
    setEditingIndex(index);
    const { id, ...rest } = events[index];
    setFormData({ ...rest, orgLink: rest.orgLink || "" });
    setEditModalOpen(true);
  };

  const handleRemove = (index: number) => {
    if (!session) return;
    if (window.confirm("Delete this event?")) {
      const updated = events.filter((_, i) => i !== index);
      setEvents(updated);
      localStorage.setItem("events", JSON.stringify(updated));
    }
  };

  const filteredAndSortedEvents = [...events]
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.org.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <Menu activeLink="events">
      <div className="min-h-screen bg-slate-50 relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-red-50 to-transparent pointer-events-none" />

        <main className="mx-auto w-full relative">
          <div className="relative bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white pb-24 pt-12 px-6 shadow-xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-red-950/30 border border-red-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase">
                Campus Updates
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white drop-shadow-sm">
                Events &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
                  Announcements
                </span>
              </h1>
              <p className="text-red-100 text-lg max-w-2xl font-light">
                Stay connected with the pulse of the university. Discover
                seminars, gatherings, and official announcements from student
                orgs.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
            <div className="bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-1/2 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-red-600">
                  <Icons.Search />
                </div>
                <input
                  type="text"
                  placeholder="Search for events..."
                  className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl text-gray-700 placeholder-gray-400 focus:bg-gray-50 focus:outline-none transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto px-2 pb-2 md:pb-0">
                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Sort By
                  </span>
                  <select
                    className="bg-transparent border-none text-sm font-bold text-gray-800 focus:ring-0 cursor-pointer outline-none"
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as "newest" | "oldest")
                    }
                  >
                    <option value="newest">Latest Date</option>
                    <option value="oldest">Oldest Date</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredAndSortedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedEvents.map((event, index) => (
                  <EventCard
                    key={event.id || index}
                    {...event}
                    onImageClick={(src) => setPreviewImage(src)}
                    onReadMore={(e) => setFullScreenEvent(e)}
                    onRemove={
                      session
                        ? () => handleRemove(events.indexOf(event))
                        : undefined
                    }
                    onEdit={
                      session
                        ? () => openEditModal(events.indexOf(event))
                        : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-white p-6 rounded-full shadow-lg mb-6">
                  <div className="text-gray-300 w-16 h-16">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  No events found
                </h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                  We couldnt find any events matching your search. Try adjusting
                  keywords.
                </p>
              </div>
            )}
          </div>

          {session && (
            <button
              onClick={() => {
                setFormData(emptyEventState);
                setShowModal(true);
              }}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 z-40 group"
            >
              <Icons.Plus />
            </button>
          )}

          <EventFormModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSaveNew}
            title="Create New Event"
            data={formData}
            setData={setFormData}
          />

          <EventFormModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSave={handleUpdate}
            title="Edit Event"
            data={formData}
            setData={setFormData}
          />

          {previewImage && (
            <div
              className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 cursor-zoom-out animate-in fade-in duration-200"
              onClick={() => setPreviewImage(null)}
            >
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border-4 border-white/10"
              />
            </div>
          )}

          {fullScreenEvent && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-white animate-in slide-in-from-bottom-10 duration-300">
              <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center z-50 shadow-sm">
                <button
                  onClick={() => setFullScreenEvent(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-900 transition-colors font-bold text-sm uppercase tracking-wide"
                >
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </button>
                <div className="flex gap-3">
                  {fullScreenEvent.link && (
                    <a
                      href={fullScreenEvent.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                      View Post <Icons.External />
                    </a>
                  )}
                </div>
              </div>

              <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                      {fullScreenEvent.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Date
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {new Date(fullScreenEvent.date).toLocaleDateString(
                            undefined,
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <div className="h-8 w-px bg-gray-200"></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Organizer
                        </span>
                        <span className="text-red-700 font-bold">
                          {fullScreenEvent.org}
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-lg prose-red max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {fullScreenEvent.description}
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="sticky top-24">
                      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-red-900/20 border border-gray-100 bg-white p-2">
                        <img
                          src={fullScreenEvent.imageSrc}
                          className="w-full h-auto rounded-xl"
                          alt={fullScreenEvent.title}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </Menu>
  );
}
