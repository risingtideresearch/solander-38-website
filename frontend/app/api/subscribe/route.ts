import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email }),
    });
  } catch (err) {
    console.error("Buttondown fetch error:", err);
    return NextResponse.json({ error: "subscribe_failed" }, { status: 500 });
  }

  if (res.ok) return NextResponse.json({ ok: true });

  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    // non-JSON error body
  }

  const code = typeof data.code === "string" ? data.code : "";

  if (code === "email_already_exists") {
    return NextResponse.json({ error: "already_subscribed" }, { status: 400 });
  }

  if (code === "subscriber_blocked") {
    return NextResponse.json({ error: "subscriber_blocked" }, { status: 400 });
  }

  console.error("Buttondown error:", res.status, data);
  return NextResponse.json({ error: "subscribe_failed" }, { status: 500 });
}
