"use client";
import { useState, useMemo } from "react";
import Menu from "@/components/menu/menu-texts";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/server/client";
import { PageType } from "@prisma/client";
import Icons from "@/components/facebook-pages/icons";
import SkeletonCard from "@/components/facebook-pages/skeletonCard";

type PageTypeKey = "admin" | "organizations" | "federations" | "academic";

interface FbPage {
  id: string;
  name: string;
  image: string;
  link: string;
}

export default function FacebookPages() {
  const {
    data: pagesData,
    isLoading,
    refetch,
  } = trpc.fbPage.fetchAll.useQuery();

  const createMutation = trpc.fbPage.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowModal(false);
      resetForm();
    },
  });

  const deleteMutation = trpc.fbPage.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const updateMutation = trpc.fbPage.update.useMutation({
    onSuccess: () => {
      refetch();
      setShowModal(false);
    },
  });

  const fbPages = useMemo(() => {
    const grouped: Record<PageTypeKey, FbPage[]> = {
      admin: [],
      organizations: [],
      federations: [],
      academic: [],
    };

    if (!pagesData || !Array.isArray(pagesData)) return grouped;

    pagesData.forEach((page) => {
      const formatted: FbPage = {
        id: page.pageName,
        name: page.pageName,
        image: page.image || "/upcebu.jpg",
        link: page.url,
      };

      switch (page.type) {
        case "ADMIN":
          grouped.admin.push(formatted);
          break;
        case "ORGANIZATION":
          grouped.organizations.push(formatted);
          break;
        case "FEDERATION":
          grouped.federations.push(formatted);
          break;
        case "ACADEMIC":
          grouped.academic.push(formatted);
          break;
      }
    });
    return grouped;
  }, [pagesData]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    image: "",
    link: "",
    type: "admin" as PageTypeKey,
  });

  const resetForm = () => {
    setForm({ name: "", image: "", link: "", type: "admin" });
    setEditingId(null);
  };

  const handleAddPage = () => {
    if (!form.name || !form.link) return;
    const payload = {
      pageName: editingId || form.name,
      url: form.link,
      type: form.type.toUpperCase() as PageType,
      image: form.image,
    };

    if (editingId) {
      updateMutation.mutate({ ...payload, pageName: editingId });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleRemovePage = (id: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      deleteMutation.mutate({ pageName: id });
    }
  };

  const handleEditPage = (page: FbPage, type: PageTypeKey) => {
    setForm({ name: page.name, image: page.image, link: page.link, type });
    setEditingId(page.id);
    setShowModal(true);
  };

  const filteredPages = (pages: FbPage[]) => {
    return pages.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900">
      <Menu activeLink="fb-pages">
        <main className="flex-grow p-6 md:p-10 mx-auto max-w-7xl w-full">
          <div className="flex flex-col items-center justify-center mb-12 space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#89132f] tracking-tight text-center">
              UP Cebu Facebook Pages
            </h1>

            <div className="relative w-full max-w-lg group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Search for a page..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#89132f]/20 focus:border-[#89132f] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(fbPages).map(([section, pages]) => {
                const visible = filteredPages(pages);
                if (visible.length === 0) return null;

                return (
                  <div
                    key={section}
                    className="animate-in fade-in duration-500"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold capitalize text-gray-800">
                        {section}
                      </h2>
                      <div className="h-px bg-gray-200 flex-grow rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {visible.map((page) => (
                        <div
                          key={page.id}
                          className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPage(page, section as any);
                              }}
                              className="p-2 bg-white text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full shadow-sm border border-gray-100 transition-colors"
                              title="Edit"
                            >
                              <Icons.Edit />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePage(page.id);
                              }}
                              className="p-2 bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full shadow-sm border border-gray-100 transition-colors"
                              title="Delete"
                            >
                              <Icons.Trash />
                            </button>
                          </div>

                          <Link
                            href={page.link}
                            target="_blank"
                            className="flex flex-col items-center w-full text-center group-hover:opacity-90"
                          >
                            <div className="relative w-28 h-28 mb-4 p-1 rounded-full border-2 border-gray-100 bg-white shadow-inner">
                              <Image
                                src={page.image}
                                alt={page.name}
                                fill
                                className="object-cover rounded-full"
                              />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                              {page.name}
                            </h3>
                            <div className="mt-2 flex items-center text-xs font-medium text-[#89132f]">
                              Visit Page <Icons.ExternalLink />
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {!isLoading &&
                Object.values(fbPages).every(
                  (p) => filteredPages(p).length === 0,
                ) && (
                  <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">
                      No pages found matching "{searchQuery}"
                    </p>
                  </div>
                )}
            </div>
          )}
        </main>
      </Menu>

      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="fixed bottom-8 right-8 bg-[#89132f] text-white w-14 h-14 rounded-full shadow-lg shadow-[#89132f]/40 flex items-center justify-center hover:scale-110 hover:bg-[#a01636] transition-all duration-300 z-40"
        aria-label="Add Page"
      >
        <Icons.Plus />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              {editingId ? "Edit Page Details" : "Add New Page"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Name
                </label>
                <input
                  disabled={!!editingId}
                  placeholder="e.g., UP Cebu Student Council"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#89132f] focus:border-transparent transition-all disabled:opacity-60"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  placeholder="https://..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#89132f] focus:border-transparent transition-all"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook Link
                </label>
                <input
                  placeholder="https://facebook.com/..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#89132f] focus:border-transparent transition-all"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
              </div>

              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#89132f] focus:border-transparent transition-all appearance-none"
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value as any })
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="organizations">Organizations</option>
                      <option value="federations">Federations</option>
                      <option value="academic">Academic</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPage}
                className="px-6 py-2.5 bg-[#89132f] hover:bg-[#700f26] text-white font-medium rounded-lg shadow-md transition-colors"
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
