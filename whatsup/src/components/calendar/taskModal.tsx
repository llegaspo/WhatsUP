import { useState, useEffect } from "react";
import { PriorityType } from "@prisma/client";
import Icons from "@/components/calendar/icons";

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

export const getPriorityStyles = (priority: PriorityType) => {
  switch (priority) {
    case PriorityType.URGENT:
      return "bg-red-50 text-red-700 border-red-200";
    case PriorityType.IMPORTANT:
      return "bg-amber-50 text-amber-700 border-amber-200";
    case PriorityType.LATER:
      return "bg-slate-50 text-slate-600 border-slate-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  dayTasks: ToDoItem[];
  canEdit: boolean;
  onSave: (task: Partial<ToDoItem>) => void;
}

export default function TaskModal({
  isOpen,
  onClose,
  selectedDate,
  dayTasks,
  canEdit,
  onSave,
}: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: PriorityType.URGENT,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        priority: PriorityType.URGENT,
      });
    }
  }, [isOpen, selectedDate]);

  if (!isOpen || !selectedDate) return null;

  const formattedDisplayDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) return alert("Title is required");

    const payload: Partial<ToDoItem> = {
      title: formData.title,
      description: formData.description || null,
      dueDate: selectedDate,
      priority: formData.priority,
      createdAt: new Date(),
    };

    onSave(payload);
    setFormData({
      title: "",
      description: "",
      priority: PriorityType.URGENT,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="bg-[#89132f] p-6 text-white flex justify-between items-start flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">
              {canEdit ? "Manage Events" : "Events Details"}
            </h2>
            <div className="flex items-center gap-2 text-red-100 mt-1 text-sm font-medium">
              <Icons.Calendar />
              {formattedDisplayDate}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <Icons.Close />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              {dayTasks.length > 0
                ? `Scheduled Events (${dayTasks.length})`
                : "Schedule"}
            </h3>

            <div className="space-y-3">
              {dayTasks.length > 0 ? (
                dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-gray-50 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4
                        className={`font-semibold text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                      >
                        {task.title}
                      </h4>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getPriorityStyles(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <Icons.Empty />
                  <p className="text-gray-400 text-sm mt-2">
                    No events scheduled for this day.
                  </p>
                </div>
              )}
            </div>
          </div>

          {canEdit && <div className="border-t border-gray-100 my-6"></div>}

          {canEdit ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-sm font-bold text-gray-800 mb-4">
                Add New Task
              </h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Task Title..."
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89132f] text-sm"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    placeholder="Description (Optional)..."
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89132f] resize-none text-sm"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      Object.keys(PriorityType) as Array<
                        keyof typeof PriorityType
                      >
                    ).map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            priority: type,
                          })
                        }
                        className={`
                          px-2 py-2 rounded-lg text-[10px] sm:text-xs font-bold border transition-all
                          ${
                            formData.priority === PriorityType[type]
                              ? "bg-gray-800 text-white border-gray-800 shadow-sm"
                              : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }
                        `}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-xs rounded flex items-center gap-2">
              <span className="font-bold">Note:</span> Log in to add new events.
            </div>
          )}
        </div>

        {canEdit && (
          <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-bold text-xs hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#89132f] hover:bg-[#700f26] text-white font-bold text-xs rounded-lg shadow-md transition-all"
            >
              Save Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
