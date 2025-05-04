"use client";

import { Monitor, Plus, Settings, X } from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "@/types/Task";
import { formatDate, generateId } from "@/lib/common";
import { useEffect, useRef, useState } from "react";

import { PriorityBadge } from "./PriorityBadge";
import theme from "@/config/theme";

// Sample initial data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Research market trends",
    description: "Find latest market trends for our product category",
    status: "todo",
    priority: "high",
    dueDate: new Date(2025, 4, 10),
  },
  {
    id: "2",
    title: "Design new homepage",
    description: "Create wireframes for the new homepage layout",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(2025, 4, 15),
  },
  {
    id: "3",
    title: "Fix navigation bug",
    description: "Address the issue with dropdown menu in mobile view",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(2025, 4, 6),
  },
  {
    id: "4",
    title: "Update user documentation",
    description: "Update the user guide with new features",
    status: "todo",
    priority: "low",
    dueDate: new Date(2025, 4, 20),
  },
  {
    id: "5",
    title: "Prepare Q2 report",
    description: "Gather data and prepare quarterly report",
    status: "done",
    priority: "medium",
    dueDate: new Date(2025, 4, 2),
  },
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Form state
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const [newTaskPriority, setNewTaskPriority] =
    useState<TaskPriority>("medium");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("todo");
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>("");

  // Ref for form
  const formRef = useRef<HTMLDivElement>(null);

  // Handler for adding a new task
  const handleAddTask = () => {
    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: newTaskStatus,
      priority: newTaskPriority,
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
    };

    setTasks([...tasks, newTask]);
    resetForm();
    setIsAddingTask(false);
  };

  // Handler for updating a task
  const handleUpdateTask = () => {
    if (!editingTask) return;

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id
        ? {
            ...editingTask,
            title: newTaskTitle,
            description: newTaskDescription,
            priority: newTaskPriority,
            status: newTaskStatus,
            dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
          }
        : task
    );

    setTasks(updatedTasks);
    resetForm();
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
    setNewTaskPriority(task.priority);
    setNewTaskStatus(task.status);
    setNewTaskDueDate(
      task.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
    );
  };

  const resetForm = () => {
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
    setNewTaskStatus("todo");
    setNewTaskDueDate("");
  };

  // Click outside handler to close form
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsAddingTask(false);
        setEditingTask(null);
        resetForm();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Drag and drop handlers
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (status: TaskStatus) => {
    if (!draggedTask) return;

    const updatedTasks = tasks.map((task) =>
      task.id === draggedTask.id ? { ...task, status } : task
    );

    setTasks(updatedTasks);
    setDraggedTask(null);
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group tasks by status
  const todoTasks = filteredTasks.filter((task) => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "in-progress"
  );
  const doneTasks = filteredTasks.filter((task) => task.status === "done");

  // Task card component
  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div
      className="bg-white rounded-lg shadow p-4 mb-3 cursor-move"
      draggable
      onDragStart={() => handleDragStart(task)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800">{task.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleEditTask(task)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <Settings size={14} />
          </button>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="text-gray-400 hover:text-red-500 p-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      <div className="flex justify-between items-center">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className="text-xs text-gray-500">
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );

  // Form component
  const TaskForm = () => (
    <div
      ref={formRef}
      className={`fixed inset-0 flex items-center justify-center z-50`}
      style={{ backgroundColor: theme.light }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editingTask ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={() => {
              setIsAddingTask(false);
              setEditingTask(null);
              resetForm();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Task description"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={newTaskPriority}
                onChange={(e) =>
                  setNewTaskPriority(e.target.value as TaskPriority)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={editingTask ? handleUpdateTask : handleAddTask}
              disabled={!newTaskTitle}
              className={`w-full py-2 rounded-md text-white font-medium ${
                !newTaskTitle ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editingTask ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ backgroundColor: theme.white }}
    >
      {/* Header */}
      <header
        className="py-4 px-6 flex justify-between items-center shadow-sm"
        style={{ backgroundColor: theme.primary, color: theme.white }}
      >
        <div className="flex items-center">
          <Monitor className="mr-2" size={24} />
          <h1 className="text-xl font-semibold">Kanban Board</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-8 py-1 rounded-md text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center py-1 px-3 rounded-md text-sm font-medium"
            style={{ backgroundColor: theme.accent, color: theme.primary }}
          >
            <Plus size={16} className="mr-1" />
            Add Task
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div
            className="bg-gray-100 rounded-lg shadow p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("todo")}
            style={{ backgroundColor: theme.light }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-lg font-medium"
                style={{ color: theme.primary }}
              >
                To Do
              </h2>
              <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {todoTasks.length}
              </span>
            </div>
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            <button
              onClick={() => {
                setIsAddingTask(true);
                setNewTaskStatus("todo");
              }}
              className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
            >
              <Plus size={18} className="mr-1" />
              Add Task
            </button>
          </div>

          {/* In Progress Column */}
          <div
            className="bg-gray-100 rounded-lg shadow p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("in-progress")}
            style={{ backgroundColor: theme.light }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-lg font-medium"
                style={{ color: theme.primary }}
              >
                In Progress
              </h2>
              <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {inProgressTasks.length}
              </span>
            </div>
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            <button
              onClick={() => {
                setIsAddingTask(true);
                setNewTaskStatus("in-progress");
              }}
              className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
            >
              <Plus size={18} className="mr-1" />
              Add Task
            </button>
          </div>

          {/* Done Column */}
          <div
            className="bg-gray-100 rounded-lg shadow p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("done")}
            style={{ backgroundColor: theme.light }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-lg font-medium"
                style={{ color: theme.primary }}
              >
                Done
              </h2>
              <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {doneTasks.length}
              </span>
            </div>
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            <button
              onClick={() => {
                setIsAddingTask(true);
                setNewTaskStatus("done");
              }}
              className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
            >
              <Plus size={18} className="mr-1" />
              Add Task
            </button>
          </div>
        </div>
      </main>

      {/* Task form modal */}
      {(isAddingTask || editingTask) && <TaskForm />}
    </div>
  );
};

export { KanbanBoard };
