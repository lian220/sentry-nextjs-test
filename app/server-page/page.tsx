import * as Sentry from "@sentry/nextjs";

async function fetchData() {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { data: "Server-side rendered data", timestamp: new Date().toISOString() };
}

export default async function ServerPage() {
  try {
    const result = await fetchData();

    return (
      <div className="font-sans min-h-screen p-8 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
        <main className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-900 dark:text-white">
            Server Component Test
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Server-Side Data
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-purple-900 dark:text-purple-100">
              Server Component Features:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-purple-800 dark:text-purple-200">
              <li>Server-side error tracking</li>
              <li>Performance monitoring for server components</li>
              <li>Automatic request context capture</li>
            </ul>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}
