"use client";

import React, { useState, useEffect } from "react";
import Menu from "@/components/menu/menu-texts";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

type PageType = "admin" | "organizations" | "federations" | "academic";

interface FbPage {
  id: string;
  name: string;
  image: string;
  link: string;
}

const initialFbPages: Record<PageType, FbPage[]> = {
  admin: [
    {
      id: "1",
      name: "University of the Philippines Cebu",
      image: "/upcebu.jpg",
      link: "https://www.facebook.com/upcebuofficial",
    },
    {
      id: "2",
      name: "UP Cebu Office of the University Registrar",
      image: "/our.jpg",
      link: "https://www.facebook.com/our.upcebu",
    },
    {
      id: "3",
      name: "UP Cebu Office of Student Affairs",
      image: "/osa.jpg",
      link: "https://www.facebook.com/osa.upcebu",
    },
    {
      id: "4",
      name: "UP Cebu Teaching and Learning Resource Center",
      image: "/tlrc.jpg",
      link: "https://www.facebook.com/upcebutlrc",
    },
  ],
  organizations: [
    {
      id: "5",
      name: "UP Cebu University Student Council",
      image: "/upcusc.jpg",
      link: "https://www.facebook.com/upcebuofficial",
    },
    {
      id: "6",
      name: "Unified Student Organizations",
      image: "/uniso.jpg",
      link: "https://www.facebook.com/upcuniso ",
    },
    {
      id: "7",
      name: "UP Cebu Tug-A  ni",
      image: "/tugani.jpg",
      link: "https://www.facebook.com/upcebutugani",
    },
    {
      id: "8",
      name: "UP Cebu University Student Council",
      image: "/upcusc.jpg",
      link: "https://www.facebook.com/upcebuofficial",
    },
  ],
  federations: [
    {
      id: "9",
      name: "UP Cebu Sciences Federation",
      image: "/scions.jpg",
      link: "https://www.facebook.com/upcebuofficial",
    },
    {
      id: "10",
      name: "UP Cebu College of Social Sciences",
      image: "/socsci.jpg",
      link: "https://www.facebook.com/upcebusocsci",
    },
    {
      id: "11",
      name: "UP Cebu College of Communication Art and Design",
      image: "/ccad.jpg",
      link: "https://www.facebook.com/ccadupcebu",
    },
    {
      id: "12",
      name: "UP Cebu School of Management",
      image: "/som.jpg",
      link: "https://www.facebook.com/upcebusom",
    },
  ],
  academic: [],
};

export default function FacebookPages() {
  const [fbPages, setFbPages] =
    useState<Record<PageType, FbPage[]>>(initialFbPages);
  const [hasMounted, setHasMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    image: "",
    link: "",
    type: "admin" as PageType,
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
          console.error("Failed to parse fbPages from localStorage:", e);
        }
      }
      setHasMounted(true);
    }
  }, []);

  // Save to localStorage whenever fbPages change
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

    let updated: Record<PageType, FbPage[]>;
    setFbPages((prev) => {
      if (editingId) {
        updated = { ...prev };
        for (const type in updated) {
          const index = updated[type as PageType].findIndex(
            (p) => p.id === editingId,
          );
          if (index !== -1) {
            updated[type as PageType][index] = newPage;
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

  const handleRemovePage = (type: PageType, id: string) => {
    if (window.confirm("Are you sure you want to remove this page?")) {
      setFbPages((prev) => ({
        ...prev,
        [type]: prev[type].filter((page) => page.id !== id),
      }));
      setHasChanges(true);
    }
  };

  const handleEditPage = (page: FbPage, type: PageType) => {
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

  return (
    <div className="relative flex flex-col min-h-screen">
      <Menu activeLink="fb-pages">
        <main className="flex-grow p-8 mx-auto max-w-7xl w-full">
          <h1 className="text-4xl font-bold text-[#89132f] text-center mb-6">
            UP Cebu Facebook Pages
          </h1>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search pages..."
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {Object.entries(fbPages).map(([section, pages]) => (
            <div key={section} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 capitalize text-red-800">
                {section === "organizations"
                  ? "Student Organizations"
                  : section === "federations"
                    ? "College Federations"
                    : section == "academic"
                      ? "Academic Organizations"
                      : section.replace(/^\w/, (c) => c.toUpperCase())}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center text-gray-500">
                {filteredPages(pages).map((page) => (
                  <div
                    key={page.id}
                    className="relative flex flex-col items-center"
                  >
                    <div className="absolute top-0 right-0 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditPage(page, section as PageType);
                        }}
                        className="bg-white text-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-xs z-10 hover:bg-gray-100 hover:text-blue-500 border border-gray-300"
                        title="Edit page"
                      >
                        ✎
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemovePage(section as PageType, page.id);
                        }}
                        className="bg-white text-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-xs z-10 hover:bg-gray-100 hover:text-red-500 border border-gray-300"
                        title="Remove page"
                      >
                        ×
                      </button>
                    </div>
                    <Link
                      href={page.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 w-full text-xs"
                    >
                      <img
                        src={page.image}
                        alt={page.name}
                        width={200}
                        height={200}
                        className="rounded-full"
                      />
                      <span>{page.name}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </Menu>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-red-900 hover:bg-red-800 text-white text-3xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
      >
        +
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Facebook Page" : "Add Facebook Page"}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Page Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Facebook Link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {!editingId && (
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as PageType })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="organizations">Student Organizations</option>
                  <option value="federations">College Federations</option>
                  <option value="academic">Academic Organizations</option>
                </select>
              )}
              <div className="flex justify-end gap-2">
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
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPage}
                  className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800"
                >
                  {editingId ? "Save Changes" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

