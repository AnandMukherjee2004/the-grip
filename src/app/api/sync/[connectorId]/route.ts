import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ connectorId: string }> }
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { connectorId } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const internalSecret = process.env.INTERNAL_SECRET || "";

  try {
    const res = await fetch(`${apiUrl}/api/v1/sync/${connectorId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
        "x-internal-secret": internalSecret,
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Proxy sync error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to trigger sync" },
      { status: 500 }
    );
  }
}
