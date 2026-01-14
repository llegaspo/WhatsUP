"use client";

import React, { useState } from "react";
import Menu from "@/components/menu/menu-texts";
import Link from "next/link";

const Icons = {
  ChevronLeft: () => (
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
        d="M15 19l-7-7 7-7"
      />
    </svg>
  ),
  ChevronRight: () => (
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
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
  Trash: () => (
    <svg
      className="w-3.5 h-3.5"
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
  Edit: () => (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  Plus: () => (
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
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  Check: () => (
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
};

export default function Calendar() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const today = new Date();

  const isViewingCurrentMonth =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const endPadding = 6 - lastDay.getDay();

    const dates = [];

    for (let i = startPadding; i > 0; i--) {
      const date = new Date(year, month, -i + 1);
      dates.push({ date, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      dates.push({ date, isCurrentMonth: true });
    }

    for (let i = 1; i <= endPadding; i++) {
      const date = new Date(year, month + 1, i);
      dates.push({ date, isCurrentMonth: false });
    }
    return dates;
  };

  const dates = getDaysInMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  const goToToday = () => setCurrentMonth(new Date());

  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Cover page sa 141",
      completed: false,
      priority: "medium",
      date: new Date().getDate(),
    },
    {
      id: 2,
      text: "Finalize project",
      completed: false,
      priority: "high",
      date: new Date().getDate() + 2,
    },
    {
      id: 3,
      text: "Team Meeting",
      completed: true,
      priority: "low",
      date: new Date().getDate() - 1,
    },
  ]);

  const promptDeleteTask = (id: number) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteTask = () => {
    if (taskToDelete !== null) {
      setTasks(tasks.filter((task) => task.id !== taskToDelete));
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-100";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-green-50 text-green-700 border-green-100";
    }
  };

  return (
    <Menu activeLink="calendar">
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col max-h-[600px] sticky top-24">
              <div className="p-4 bg-red-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    My Agenda
                  </h3>
                  <p className="text-red-200 text-[10px] opacity-80">
                    {tasks.filter((t) => !t.completed).length} Pending
                  </p>
                </div>
                <Link
                  href="/addtask"
                  className="bg-white/10 hover:bg-white/20 p-1.5 rounded transition-colors text-white"
                >
                  <Icons.Plus />
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${task.completed ? "bg-gray-50 border-gray-100 opacity-60" : "bg-white border-gray-100 hover:border-red-200 hover:shadow-sm"}`}
                    >
                      <button
                        onClick={() => toggleComplete(task.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-red-500"}`}
                      >
                        {task.completed && <Icons.Check />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${task.completed ? "line-through" : "text-gray-800"}`}
                        >
                          {task.text}
                        </p>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1 inline-block border ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <button
                        onClick={() => promptDeleteTask(task.id)}
                        className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-gray-400">
                    No tasks.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 flex justify-between items-center border-b border-gray-100">
                <h1 className="text-xl font-black text-gray-900">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  <span className="text-red-900">
                    {currentMonth.getFullYear()}
                  </span>
                </h1>

                <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-100">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-white rounded-md transition-all"
                  >
                    <Icons.ChevronLeft />
                  </button>
                  <button
                    onClick={goToToday}
                    className="px-3 py-1 text-xs font-bold text-gray-600 hover:text-red-700 uppercase tracking-wide"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-white rounded-md transition-all"
                  >
                    <Icons.ChevronRight />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-7 mb-2">
                  {days.map((day) => (
                    <div
                      key={day}
                      className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {dates.map(({ date, isCurrentMonth }, index) => {
                    const isToday =
                      isViewingCurrentMonth &&
                      date.getDate() === today.getDate() &&
                      isCurrentMonth;
                    const hasTask = tasks.some(
                      (t) =>
                        t.date === date.getDate() &&
                        isCurrentMonth &&
                        !t.completed,
                    );

                    return (
                      <div
                        key={index}
                        className={`
                                    relative h-16 md:h-24 p-2 rounded-lg border flex flex-col transition-all
                                    ${
                                      !isCurrentMonth
                                        ? "bg-gray-50/50 text-gray-300 border-transparent"
                                        : isToday
                                          ? "bg-red-50 border-red-200"
                                          : "bg-white text-gray-700 border-gray-100 hover:border-red-200"
                                    }
                                `}
                      >
                        <span
                          className={`text-sm font-bold ${isToday ? "text-red-700" : ""}`}
                        >
                          {date.getDate()}
                        </span>

                        {hasTask && (
                          <div className="mt-auto flex justify-end">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Task?
              </h3>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTask}
                  className="flex-1 px-3 py-2 bg-red-600 text-white font-bold rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Menu>
  );
}
