import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    const body = await request.json();
    const { method, request_ids, form_data, shared_at } = body;

    // Validate required fields
    if (!method || !["whatsapp", "email", "copy"].includes(method)) {
      return NextResponse.json(
        { error: "Invalid share method" },
        { status: 400 }
      );
    }

    if (!request_ids || !Array.isArray(request_ids) || request_ids.length === 0) {
      return NextResponse.json(
        { error: "Missing request_ids" },
        { status: 400 }
      );
    }

    // Log the share action
    // In production, you would save this to a database
    const logEntry = {
      slug,
      method,
      request_ids,
      form_data: form_data,
      shared_at: shared_at || new Date().toISOString(),
      user_agent: request.headers.get("user-agent") || "unknown",
      ip: request.headers.get("x-forwarded-for") || "unknown",
    };

    console.log("[SHARE_LOG]", JSON.stringify(logEntry));

    // TODO: Save to database
    // await prisma.shareLog.create({ data: logEntry });

    return NextResponse.json({ success: true, logId: `share_${Date.now()}` });
  } catch (error) {
    console.error("Share log error:", error);
    return NextResponse.json(
      { error: "Failed to log share" },
      { status: 500 }
    );
  }
}