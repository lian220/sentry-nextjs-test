import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  const transaction = Sentry.startSpan(
    {
      op: "test",
      name: "Performance Test Transaction",
    },
    async () => {
      // Simulate some work
      await new Promise((resolve) => setTimeout(resolve, 500));

      const childSpan = Sentry.startInactiveSpan({
        op: "db.query",
        name: "Simulated Database Query",
      });

      await new Promise((resolve) => setTimeout(resolve, 200));
      childSpan?.end();

      return NextResponse.json({
        message: "Performance test completed",
        timestamp: new Date().toISOString(),
      });
    }
  );

  return transaction;
}
