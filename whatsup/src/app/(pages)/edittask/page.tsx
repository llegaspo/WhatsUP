"use client";

import React, { useState } from "react";
import Menu from "@/components/menu/menu-texts";
import Link from "next/link";

export default function AddTask() {
  const [newTask, setNewTask] = useState({
    name: "",
    details: "",
    dueDate: "",
    priority: "medium",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New task submitted:", newTask);
    setNewTask({
      name: "",
      details: "",
      dueDate: "",
      priority: "medium",
    });
  };

  return (
    <Menu activeLink="calendar" openModal={() => {}}>
      <div className="flex flex-col md:flex-row items-start justify-center p-4 md:p-8 bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen font-sans w-full shadow-xl">
        <div className="bg-white shadow-lg rounded-md w-full md:w-150 p-6 h-auto">
          <div className="flex justify-between items-center mb-6 bg-[#8b0031] rounded-lg px-4 py-3">
            <h3 className="text-xl font-semibold text-white">Edit Task</h3>
            <Link href="/calendar" passHref>
              <button className="bg-white text-[#8b0031] p-2 rounded-full hover:bg-gray-100 transition-colors border-2 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Name*
              </label>
              <input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#8b0031] focus:border-[#8b0031]"
                placeholder="Enter task name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
                name="details"
                value={newTask.details}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#8b0031] focus:border-[#8b0031]"
                placeholder="Enter task details"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#8b0031] focus:border-[#8b0031]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#8b0031] focus:border-[#8b0031]"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/calendar" passHref>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#8b0031] hover:bg-[#6a0024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b0031]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Menu>
  );
}

