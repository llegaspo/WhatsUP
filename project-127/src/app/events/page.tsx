"use client";

import React, { useState, useEffect } from "react";
import Menu from "@/components/menu/menu-texts";
import { v4 as uuidv4 } from "uuid";

interface EventCardProps {
  id: string;
  imageSrc: string;
  date: string;
  org: string;
  orgLink?: string;
  title: string;
  description: string;
  link: string;
  onReadMore?: (event: EventCardProps) => void;
  onImageClick?: (imageSrc: string) => void;
  onRemove?: () => void;
  onEdit?: () => void;
}

const Icons = {
  Search: () => (
    <svg
      className="w-5 h-5 text-red-800"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Calendar: () => (
    <svg
      className="w-4 h-4 mr-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  Edit: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  ),
  Trash: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  Plus: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  External: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  ),
  Sort: () => (
    <svg
      className="w-5 h-5 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
      />
    </svg>
  ),
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
};

const getYear = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : date.getFullYear();
};

const EventCard: React.FC<EventCardProps> = (props) => {
  const {
    imageSrc,
    date,
    org,
    orgLink,
    title,
    description,
    link,
    onReadMore,
    onImageClick,
    onRemove,
    onEdit,
  } = props;
  const previewLength = 100;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-1">
      {(onRemove || onEdit) && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white/90 backdrop-blur text-gray-600 rounded-full p-2 hover:bg-amber-50 hover:text-amber-600 shadow-sm border border-gray-200 transition-colors"
            >
              <Icons.Edit />
            </button>
          )}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="bg-white/90 backdrop-blur text-gray-600 rounded-full p-2 hover:bg-red-50 hover:text-red-600 shadow-sm border border-gray-200 transition-colors"
            >
              <Icons.Trash />
            </button>
          )}
        </div>
      )}

      <div
        className="relative aspect-video overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => onImageClick?.(imageSrc)}
      >
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x200?text=Event";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden text-center min-w-[3.5rem]">
          <div className="bg-red-700 text-white text-[10px] uppercase font-bold py-0.5 px-2 tracking-wide">
            {getYear(date)}
          </div>
          <div className="px-2 py-1">
            <div className="text-sm font-bold text-gray-900 leading-tight">
              {formatDate(date).split(" ")[1]}
            </div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase">
              {formatDate(date).split(" ")[0]}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col relative">
        <div className="mb-3">
          {orgLink ? (
            <a
              href={orgLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[10px] font-bold text-white uppercase tracking-wider bg-gradient-to-r from-red-800 to-red-600 px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              {org}
            </a>
          ) : (
            <span className="inline-block text-[10px] font-bold text-white uppercase tracking-wider bg-gradient-to-r from-red-800 to-red-600 px-3 py-1 rounded-full shadow-sm">
              {org}
            </span>
          )}
        </div>

        <h3 className="text-lg font-extrabold text-gray-800 mb-2 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>

        <p className="text-sm text-gray-600 flex-grow leading-relaxed mb-4 line-clamp-3">
          {description.length > previewLength
            ? `${description.substring(0, previewLength)}...`
            : description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-gray-200">
          <button
            onClick={() => onReadMore?.(props)}
            className="text-xs font-bold text-gray-500 hover:text-red-700 flex items-center group/btn uppercase tracking-wide transition-colors"
          >
            Read More
            <span className="ml-1 bg-gray-100 rounded-full p-1 group-hover/btn:bg-red-50 group-hover/btn:translate-x-1 transition-all">
              <svg
                className="w-3 h-3"
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
            </span>
          </button>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="External Link"
            >
              <Icons.External />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Events() {
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
  const [formData, setFormData] = useState(emptyEventState);

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
      link: "https://facebook.com/example-post",
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
      link: "https://facebook.com/example-post",
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
      link: "https://facebook.com/example-post",
    },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("events");
      setEvents(saved ? JSON.parse(saved) : defaultEvents);
    } catch (e) {
      setEvents(defaultEvents);
    }
  }, []);

  const handleSaveNew = () => {
    if (!formData.title || !formData.description || !formData.date) return;
    const newEventWithId = { id: uuidv4(), ...formData };
    const updated = [newEventWithId, ...events];
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
    setFormData(emptyEventState);
    setShowModal(false);
  };

  const handleUpdate = () => {
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
    setEditingIndex(index);
    const { id, ...rest } = events[index];
    setFormData({ ...rest, orgLink: rest.orgLink || "" });
    setEditModalOpen(true);
  };

  const handleRemove = (index: number) => {
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

  const EventFormModal = ({
    isOpen,
    onClose,
    onSave,
    title,
    data,
    setData,
  }: any) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 bg-gradient-to-r from-red-900 to-red-800 text-white flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              &times;
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Title
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Organization
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={data.org}
                  onChange={(e) => setData({ ...data, org: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Description
              </label>
              <textarea
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                rows={4}
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Image URL
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={data.imageSrc}
                onChange={(e) => setData({ ...data, imageSrc: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Org Link
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={data.orgLink}
                  onChange={(e) =>
                    setData({ ...data, orgLink: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Post Link
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={data.link}
                  onChange={(e) => setData({ ...data, link: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button
              className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 bg-gradient-to-r from-red-900 to-red-800 text-white font-medium rounded-lg hover:shadow-lg transform active:scale-95 transition-all"
              onClick={onSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Menu activeLink="events" openModal={() => {}}>
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
                    onRemove={() => handleRemove(events.indexOf(event))}
                    onEdit={() => openEditModal(events.indexOf(event))}
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
                  We couldn't find any events matching your search. Try
                  adjusting keywords.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setFormData(emptyEventState);
              setShowModal(true);
            }}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 z-40 group"
          >
            <Icons.Plus />
          </button>

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
