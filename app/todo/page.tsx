"use client";

import * as Sentry from "@sentry/nextjs";
import { useState, useEffect } from "react";

type Category = "work" | "personal" | "shopping";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: Category;
  createdAt: number;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("work");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("todos");
      if (saved) {
        setTodos(JSON.parse(saved));
      }
      setIsLoading(false);
    } catch (error) {
      Sentry.captureException(error, {
        tags: { feature: "todo-load" },
      });
      setIsLoading(false);
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("todos", JSON.stringify(todos));
      } catch (error) {
        Sentry.captureException(error, {
          tags: { feature: "todo-save" },
        });
      }
    }
  }, [todos, isLoading]);

  const addTodo = () => {
    if (!inputText.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText,
      completed: false,
      category: selectedCategory,
      createdAt: Date.now(),
    };

    setTodos([...todos, newTodo]);
    setInputText("");

    Sentry.addBreadcrumb({
      category: "todo",
      message: `Added todo: ${inputText}`,
      level: "info",
      data: { category: selectedCategory },
    });
  };

  const deleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    setTodos(todos.filter((t) => t.id !== id));

    Sentry.addBreadcrumb({
      category: "todo",
      message: `Deleted todo: ${todo?.text}`,
      level: "info",
    });
  };

  const toggleComplete = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    Sentry.addBreadcrumb({
      category: "todo",
      message: `Toggling complete for: ${todo.text}`,
      level: "info",
      data: {
        todoId: id,
        currentState: todo.completed,
      },
    });

    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const updateCategory = (id: string, newCategory: Category) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    Sentry.addBreadcrumb({
      category: "todo",
      message: `Updating category for: ${todo.text}`,
      level: "info",
      data: {
        todoId: id,
        oldCategory: todo.category,
        newCategory,
      },
    });

    setTodos(
      todos.map((t) => (t.id === id ? { ...t, category: newCategory } : t))
    );
  };

  // 🐛 BUG: This function will crash when trying to access properties on null
  const clearCompleted = () => {
    Sentry.addBreadcrumb({
      category: "todo",
      message: "Attempting to clear completed tasks",
      level: "info",
      data: {
        totalTodos: todos.length,
        completedCount: todos.filter((t) => t.completed).length,
      },
    });

    // 🐛 Intentional bug: This will cause a null reference error
    const completedTodos = todos.filter((t) => t.completed);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let buggyVariable: any = null;

    // This line will crash because we're trying to access .length on null
    if (completedTodos.length > 0) {
      // Setting to null intentionally to cause error
      buggyVariable = null;
      // 🐛 This will throw "Cannot read properties of null"
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const crashPoint = buggyVariable.nonExistentProperty.length;

      setTodos(todos.filter((t) => !t.completed));
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesCategory =
      filterCategory === "all" || todo.category === filterCategory;
    const matchesSearch =
      searchQuery === "" ||
      todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    work: todos.filter((t) => t.category === "work").length,
    personal: todos.filter((t) => t.category === "personal").length,
    shopping: todos.filter((t) => t.category === "shopping").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Smart Todo App
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your tasks with categories and tracking
          </p>
        </header>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Tasks
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-purple-600">{stats.work}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Work</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-pink-600">
              {stats.personal}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Personal
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-orange-600">
              {stats.shopping}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Shopping
            </div>
          </div>
        </div>

        {/* Add Todo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Add New Task
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="work">💼 Work</option>
              <option value="personal">🏠 Personal</option>
              <option value="shopping">🛒 Shopping</option>
            </select>
            <button
              onClick={addTodo}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterCategory("work")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterCategory === "work"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                }`}
              >
                💼 Work
              </button>
              <button
                onClick={() => setFilterCategory("personal")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterCategory === "personal"
                    ? "bg-pink-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                }`}
              >
                🏠 Personal
              </button>
              <button
                onClick={() => setFilterCategory("shopping")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterCategory === "shopping"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                }`}
              >
                🛒 Shopping
              </button>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search tasks..."
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Tasks ({filteredTodos.length})
            </h2>
            {stats.completed > 0 && (
              <button
                onClick={clearCompleted}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Clear Completed ({stats.completed})
              </button>
            )}
          </div>
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-xl">No tasks found</p>
              <p className="text-sm mt-2">Add a new task to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p
                      className={`text-lg ${
                        todo.completed
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {todo.text}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <select
                    value={todo.category}
                    onChange={(e) =>
                      updateCategory(todo.id, e.target.value as Category)
                    }
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  >
                    <option value="work">💼 Work</option>
                    <option value="personal">🏠 Personal</option>
                    <option value="shopping">🛒 Shopping</option>
                  </select>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bug Trigger Instructions */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            🐛 Hidden Bug Challenge
          </h3>
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            Try this: Complete at least one task, then click the &quot;Clear
            Completed&quot; button. The app will crash with an error! Check Sentry to
            see the full stack trace and breadcrumb history.
          </p>
        </div>
      </div>
    </div>
  );
}
