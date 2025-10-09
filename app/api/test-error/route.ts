import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    throw new Error("Test error from API route!");
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Server error captured by Sentry" },
      { status: 500 }
    );
  }
}
