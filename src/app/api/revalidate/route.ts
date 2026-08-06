import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Known Sanity document types this app fetches with a matching `tags: [type]`
// in sanityFetch (see src/lib/queries.ts). Keep this in sync with that file.
const KNOWN_TAGS = ["pet", "guide", "testimonial", "faq", "siteSettings", "aboutPage"];

// On-demand ISR revalidation. Point a Sanity webhook at this URL
// (Project -> API -> Webhooks) with:
//   URL: https://clawfrican.com/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
//   Trigger on: Create, Update, Delete
//   Filter: (leave blank, or _type in ["pet","guide","testimonial","faq","siteSettings","aboutPage"])
// so edits in Studio show up on the live site within seconds instead of
// waiting for the hourly ISR window.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const expected = process.env.SANITY_REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  let type: string | undefined;
  try {
    const body = await req.json();
    type = body?._type;
  } catch {
    // No/invalid JSON body — fall back to a `?tag=` query param for manual triggers.
    type = req.nextUrl.searchParams.get("tag") ?? undefined;
  }

  if (!type || !KNOWN_TAGS.includes(type)) {
    return NextResponse.json(
      { revalidated: false, message: `Missing or unknown type. Expected one of: ${KNOWN_TAGS.join(", ")}` },
      { status: 400 }
    );
  }

  revalidateTag(type, "max");
  return NextResponse.json({ revalidated: true, tag: type, now: Date.now() });
}
