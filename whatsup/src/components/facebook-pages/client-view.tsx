"use client";

import { useState, useEffect } from "react";
import Menu from "@/components/menu/menu-texts";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export type PageTypeKey =
  | "admin"
  | "organizations"
  | "federations"
  | "academic";

export interface FbPage {
  id: string;
  name: string;
  image: string;
  link: string;
}

interface Props {
  initialData: Record<PageTypeKey, FbPage[]>;
}

export default function FacebookPagesClient({ initialData }: Props) {
  const [fbPages, setFbPages] =
    useState<Record<PageTypeKey, FbPage[]>>(initialData);
  const [hasMounted, setHasMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    image: "",
    link: "",
    type: "admin" as PageTypeKey,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fbPages");
      if (saved) {
        try {
          setFbPages(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse fbPages:", e);
        }
      }
      setHasMounted(true);
    }
  }, []);

  useEffect(() => {
    if (hasChanges) {
      localStorage.setItem("fbPages", JSON.stringify(fbPages));
      setHasChanges(false);
    }
  }, [fbPages, hasChanges]);

  const handleAddPage = () => {
    if (!form.name || !form.image || !form.link) return;

    const newPage = {
      id: editingId || uuidv4(),
      name: form.name,
      image: form.image,
      link: form.link,
    };

    let updated: Record<PageTypeKey, FbPage[]>;
    setFbPages((prev) => {
      if (editingId) {
        updated = { ...prev };
        for (const type in updated) {
          const index = updated[type as PageTypeKey].findIndex(
            (p) => p.id === editingId,
          );
          if (index !== -1) {
            updated[type as PageTypeKey][index] = newPage;
            break;
          }
        }
      } else {
        updated = {
          ...prev,
          [form.type]: [...prev[form.type], newPage],
        };
      }
      return updated;
    });

    setHasChanges(true);
    setShowModal(false);
    setForm({ id: "", name: "", image: "", link: "", type: "admin" });
    setEditingId(null);
  };

  const handleRemovePage = (type: PageTypeKey, id: string) => {
    if (window.confirm("Are you sure you want to remove this page?")) {
      setFbPages((prev) => ({
        ...prev,
        [type]: prev[type].filter((page) => page.id !== id),
      }));
      setHasChanges(true);
    }
  };

  const handleEditPage = (page: FbPage, type: PageTypeKey) => {
    setForm({
      id: page.id,
      name: page.name,
      image: page.image,
      link: page.link,
      type,
    });
    setEditingId(page.id);
    setShowModal(true);
  };

  const filteredPages = (pages: FbPage[]) => {
    return pages.filter(
      (page) =>
        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.link.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  if (!hasMounted) return null;

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      <Menu activeLink="fb-pages">
        <main className="flex-grow p-8 mx-auto max-w-7xl w-full">
          <div className="flex flex-col items-center justify-center mb-10 space-y-4">
            <h1 className="text-4xl font-extrabold text-[#89132f] text-center tracking-tight">
              UP Cebu Facebook Pages
            </h1>
            <p className="text-gray-500 text-center max-w-xl">
              Directory of official student organizations, federations, and
              administrative offices.
            </p>

            <div className="relative w-full max-w-md mt-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search organizations or offices..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#89132f] focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-12">
            {Object.entries(fbPages).map(([section, pages]) => {
              const visiblePages = filteredPages(pages);
              if (visiblePages.length === 0) return null;

              return (
                <div
                  key={section}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-[#89132f] rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">
                      {section === "organizations"
                        ? "Student Organizations"
                        : section === "federations"
                          ? "College Federations"
                          : section === "academic"
                            ? "Academic Organizations"
                            : section.replace(/^\w/, (c) => c.toUpperCase())}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {visiblePages.map((page) => (
                      <div
                        key={page.id}
                        className="group relative flex flex-col items-center bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      >
                        {/* Action Buttons (Visible on Hover) */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditPage(page, section as PageTypeKey);
                            }}
                            className="bg-white text-gray-500 p-1.5 rounded-full shadow hover:text-[#89132f] hover:bg-red-50 transition-colors"
                            title="Edit"
                          >
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
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemovePage(section as PageTypeKey, page.id);
                            }}
                            className="bg-white text-gray-500 p-1.5 rounded-full shadow hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove"
                          >
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
                          </button>
                        </div>

                        <Link
                          href={page.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center w-full text-center h-full"
                        >
                          <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner group-hover:border-[#89132f]/10 transition-colors">
                            <Image
                              src={page.image}
                              alt={page.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>

                          <span className="text-sm font-semibold text-gray-800 line-clamp-3 group-hover:text-[#89132f] transition-colors">
                            {page.name}
                          </span>

                          <span className="mt-auto pt-3 text-xs text-[#89132f] opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-1">
                            Visit Page
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
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </Menu>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 bg-[#89132f] hover:bg-[#6d0f25] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 group"
      >
        <svg
          className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300"
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
        <span className="absolute right-full mr-4 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Add Page
        </span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#89132f] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Edit Facebook Page" : "Add New Page"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. UP Cebu Student Council"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89132f] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    placeholder="/images/example.jpg"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89132f] focus:border-transparent transition-all"
                  />
                  <div className="h-12 w-12 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                    {form.image && (
                      <img
                        src={form.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook Link
                </label>
                <input
                  type="text"
                  placeholder="https://facebook.com/..."
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89132f] focus:border-transparent transition-all"
                />
              </div>

              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          type: e.target.value as PageTypeKey,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#89132f] focus:border-transparent transition-all"
                    >
                      <option value="admin">Admin</option>
                      <option value="organizations">
                        Student Organizations
                      </option>
                      <option value="federations">College Federations</option>
                      <option value="academic">Academic Organizations</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 pt-0 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setForm({
                    id: "",
                    name: "",
                    image: "",
                    link: "",
                    type: "admin",
                  });
                  setEditingId(null);
                }}
                className="px-5 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPage}
                className="px-5 py-2.5 bg-[#89132f] text-white font-medium rounded-lg hover:bg-[#6d0f25] shadow-lg shadow-red-900/20 transition-all"
              >
                {editingId ? "Save Changes" : "Add Page"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
