"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  const testError = () => {
    try {
      throw new Error("Test error from client component!");
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const testUncaughtError = () => {
    throw new Error("Uncaught error - will be caught by Sentry!");
  };

  const testMessage = () => {
    Sentry.captureMessage("Test message from client!", "info");
  };

  const testBreadcrumb = () => {
    Sentry.addBreadcrumb({
      category: "user-action",
      message: "User clicked test breadcrumb button",
      level: "info",
    });
    alert("Breadcrumb added! Trigger an error to see it in Sentry.");
  };

  const testCustomContext = () => {
    Sentry.setUser({ id: "test-user-123", email: "test@example.com" });
    Sentry.setTag("page", "home");
    Sentry.setContext("custom_context", {
      feature: "sentry-testing",
      count: count,
    });
    alert("Custom context set! Check Sentry after triggering an error.");
  };

  return (
    <div className="font-sans min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Sentry Next.js Test App
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Counter Test
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Increment
            </button>
            <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              {count}
            </span>
            <button
              onClick={() => setCount(count - 1)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Decrement
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Sentry Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={testError}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Test Caught Error
            </button>
            <button
              onClick={testUncaughtError}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Test Uncaught Error
            </button>
            <button
              onClick={testMessage}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Send Message
            </button>
            <button
              onClick={testBreadcrumb}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Add Breadcrumb
            </button>
            <button
              onClick={testCustomContext}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
            >
              Set Custom Context
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-100">
            Features Being Tested:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Error capturing (caught and uncaught)</li>
            <li>Custom messages</li>
            <li>Breadcrumbs for debugging</li>
            <li>User context and custom tags</li>
            <li>Session replay (configured)</li>
            <li>Performance monitoring (tracesSampleRate: 1.0)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
