"use client";

import { useState } from "react";
import Menu from "@/components/menu/menu-texts";
import { useSession } from "next-auth/react";
import { PriorityType } from "@prisma/client";
import Icons from "@/components/calendar/icons";
import TaskModal from "@/components/calendar/taskModal";

interface ToDoItem {
  id: string;
  userID: string;
  fbID: string;
  title: string;
  description: string | null;
  dueDate: Date;
  createdAt: Date;
  priority: PriorityType;
  completed?: boolean;
}

export default function Calendar() {
  const { data: session } = useSession();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tasks, setTasks] = useState<ToDoItem[]>([
    {
      id: "cuid_mock_1",
      userID: "user_1",
      fbID: "fb_post_1",
      title: "Enrollment Day",
      description: "Go to AS Hall and bring your form 5",
      dueDate: new Date(),
      createdAt: new Date(),
      priority: PriorityType.URGENT,
      completed: false,
    },
    {
      id: "cuid_mock_2",
      userID: "user_1",
      fbID: "fb_post_2",
      title: "Official Deadling of Enrollment",
      description:
        "Please ensure to be properly enrolled by this time to avoid being delayed. Thank you.",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      createdAt: new Date(),
      priority: PriorityType.IMPORTANT,
      completed: false,
    },
  ]);

  const today = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveTask = (partialTask: Partial<ToDoItem>) => {
    const newTask: ToDoItem = {
      id: `cuid_${Date.now()}`,
      userID: session?.user?.email || "unknown_user",
      fbID: "temp_fb_id",
      title: partialTask.title!,
      description: partialTask.description || null,
      dueDate: partialTask.dueDate!,
      createdAt: new Date(),
      priority: partialTask.priority!,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleComplete = (id: string) => {
    if (!session) return;
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const removeTask = (id: string) => {
    if (confirm("Delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    return tasks.filter(
      (t) =>
        new Date(t.dueDate).getDate() === date.getDate() &&
        new Date(t.dueDate).getMonth() === date.getMonth() &&
        new Date(t.dueDate).getFullYear() === date.getFullYear(),
    );
  };

  return (
    <Menu activeLink="calendar">
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          {session && (
            <div className="w-full md:w-80 flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-500 hidden md:block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col max-h-[600px] sticky top-24">
                <div className="p-4 bg-[#89132f] text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      My Agenda
                    </h3>
                    <p className="text-white/70 text-[10px]">
                      {tasks.filter((t) => !t.completed).length} Pending
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDate(today);
                      setIsModalOpen(true);
                    }}
                    className="bg-white/10 hover:bg-white/20 p-1.5 rounded transition-colors text-white"
                  >
                    <Icons.Plus />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                  {tasks.length > 0 ? (
                    tasks
                      .sort(
                        (a, b) =>
                          new Date(a.dueDate).getTime() -
                          new Date(b.dueDate).getTime(),
                      )
                      .map((task) => (
                        <div
                          key={task.id}
                          className={`group flex items-start gap-3 p-3 rounded-lg border transition-all ${task.completed ? "bg-gray-50 border-gray-100 opacity-60" : "bg-white border-gray-100 hover:border-red-200 hover:shadow-sm"}`}
                        >
                          <button
                            onClick={() => toggleComplete(task.id)}
                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-red-500"}`}
                          >
                            {task.completed && <Icons.Check />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-semibold truncate ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                            >
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${getPriorityStyles(task.priority)}`}
                              >
                                {task.priority}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(task.dueDate).toLocaleDateString(
                                  undefined,
                                  { month: "short", day: "numeric" },
                                )}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTask(task.id)}
                            className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Icons.Trash />
                          </button>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-10 flex flex-col items-center justify-center text-gray-400">
                      <Icons.Calendar />
                      <span className="text-xs mt-2">No tasks yet.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 gap-4">
                <h1 className="text-xl font-black text-gray-900">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  <span className="text-[#89132f]">
                    {currentMonth.getFullYear()}
                  </span>
                </h1>
                <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-100 shadow-sm">
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1,
                          1,
                        ),
                      )
                    }
                    className="p-1.5 text-gray-600 hover:text-[#89132f] hover:bg-white rounded-md transition-all"
                  >
                    <Icons.ChevronLeft />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="px-3 py-1 text-xs font-bold text-gray-600 hover:text-[#89132f] uppercase tracking-wide"
                  >
                    Today
                  </button>
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1,
                          1,
                        ),
                      )
                    }
                    className="p-1.5 text-gray-600 hover:text-[#89132f] hover:bg-white rounded-md transition-all"
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
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();

                    const dayTasks = tasks.filter(
                      (t) =>
                        new Date(t.dueDate).getDate() === date.getDate() &&
                        new Date(t.dueDate).getMonth() === date.getMonth() &&
                        new Date(t.dueDate).getFullYear() ===
                          date.getFullYear(),
                    );

                    return (
                      <div
                        key={index}
                        onClick={() => handleDateClick(date)}
                        className={`
                          relative h-20 md:h-28 p-2 rounded-lg border flex flex-col transition-all group cursor-pointer
                          ${!isCurrentMonth ? "bg-gray-50/30 text-gray-300 border-transparent" : isToday ? "bg-red-50 border-red-200 shadow-sm" : "bg-white text-gray-700 border-gray-100"}
                          hover:border-[#89132f]/50 hover:shadow-md hover:-translate-y-0.5
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-sm font-bold ${isToday ? "text-[#89132f]" : ""}`}
                          >
                            {date.getDate()}
                          </span>

                          {session ? (
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#89132f]">
                              <Icons.Plus />
                            </span>
                          ) : (
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 scale-75">
                              <Icons.Calendar />
                            </span>
                          )}
                        </div>

                        <div className="mt-auto flex flex-col gap-1 overflow-hidden">
                          {dayTasks.slice(0, 2).map((task) => (
                            <div
                              key={task.id}
                              className="text-[9px] truncate px-1 rounded bg-gray-100 text-gray-600 border border-gray-200"
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-[9px] text-gray-400 pl-1">
                              +{dayTasks.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          dayTasks={getTasksForDate(selectedDate)}
          canEdit={!!session}
          onSave={handleSaveTask}
        />
      </div>
    </Menu>
  );
}
