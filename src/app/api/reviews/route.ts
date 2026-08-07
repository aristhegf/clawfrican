import { NextRequest, NextResponse } from "next/server";
import { projectId, dataset, apiVersion } from "@/sanity/env";

const TOKEN = process.env.SANITY_WRITE_TOKEN;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  if (!TOKEN || !projectId) {
    return NextResponse.json({ error: "Reviews are temporarily unavailable. Please try again later." }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Honeypot: a hidden field real visitors never fill in. If it's filled,
  // pretend success so bots don't learn to skip it.
  const honeypot = String(form.get("company") || "").trim();
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const name = String(form.get("name") || "").trim();
  const location = String(form.get("location") || "").trim();
  const quote = String(form.get("quote") || "").trim();
  const rating = Number(form.get("rating"));
  const photo = form.get("photo");

  if (!name || name.length > 80) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!quote || quote.length < 10) {
    return NextResponse.json({ error: "Please write a few words about your experience." }, { status: 400 });
  }
  if (quote.length > 1000) {
    return NextResponse.json({ error: "That review is a little long — please keep it under 1000 characters." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Please choose a rating between 1 and 5 stars." }, { status: 400 });
  }

  let photoAssetId: string | undefined;

  if (photo instanceof File && photo.size > 0) {
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json({ error: "Photo must be an image file." }, { status: 400 });
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "That photo is too large — please use one under 8MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await photo.arrayBuffer());
    const uploadRes = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/assets/images/${dataset}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": photo.type },
      body: buffer,
    });

    if (!uploadRes.ok) {
      console.error("Sanity image upload failed:", await uploadRes.text());
      return NextResponse.json({ error: "We couldn't upload your photo. Please try again." }, { status: 502 });
    }
    const uploadBody = await uploadRes.json();
    photoAssetId = uploadBody?.document?._id;
  }

  const doc: Record<string, unknown> = {
    _type: "testimonial",
    name,
    quote,
    rating,
    status: "pending",
  };
  if (location) doc.location = location;
  if (photoAssetId) doc.photo = { _type: "image", asset: { _type: "reference", _ref: photoAssetId } };

  const mutateRes = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations: [{ create: doc }] }),
  });

  if (!mutateRes.ok) {
    console.error("Sanity mutate failed:", await mutateRes.text());
    return NextResponse.json({ error: "Something went wrong saving your review. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
