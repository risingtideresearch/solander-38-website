import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
  }

  if (!process.env.BUTTONDOWN_API_KEY) {
    console.error("BUTTONDOWN_API_KEY is not set");
    return NextResponse.json({ error: "subscribe_failed" }, { status: 500 });
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

  console.error("Buttondown error:", res.status, JSON.stringify(data));

  // Buttondown returns errors as field-keyed objects, e.g. { email_address: ["...already subscribed..."] }
  // or as { code: "email_already_exists" }
  const code = typeof data.code === "string" ? data.code : "";
  const emailErrors: string[] = Array.isArray(data.email_address) ? data.email_address as string[] : [];
  const isAlreadySubscribed =
    code === "email_already_exists" ||
    emailErrors.some((e) => e.toLowerCase().includes("already"));

  if (isAlreadySubscribed) {
    return NextResponse.json({ error: "already_subscribed" }, { status: 400 });
  }

  if (code === "subscriber_blocked") {
    return NextResponse.json({ error: "subscriber_blocked" }, { status: 400 });
  }

  return NextResponse.json({ error: "subscribe_failed" }, { status: 500 });
}
