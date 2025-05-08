import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    // Validate request - you could add an API key check here for production
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get path from query params or default to revalidating everything
    const path = request.nextUrl.searchParams.get("path") || "/";

    // Revalidate the path
    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      message: `Revalidated path: ${path}`,
      date: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error revalidating:", error);
    return NextResponse.json(
      {
        revalidated: false,
        message: "Error revalidating",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
