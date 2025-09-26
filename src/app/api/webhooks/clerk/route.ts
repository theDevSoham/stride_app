/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing Clerk webhook secret");
  }

  const payload = await req.text();
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  if (eventType === "user.created" || eventType === "user.updated") {
    await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      },
      create: {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      },
    });
  }

  if (eventType === "user.deleted") {
    await prisma.user.delete({
      where: { id: data.id },
    }).catch(() => {
      // User might already be gone, ignore
    });
  }

  return NextResponse.json({ success: true });
}
