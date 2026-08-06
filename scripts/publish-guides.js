/**
 * Publishes the guide articles in guides-content.js to Sanity as `guide` documents.
 *
 * Usage:
 *   node scripts/publish-guides.js            (writes to Sanity)
 *   node scripts/publish-guides.js --dry-run   (prints what would be sent, no writes)
 *
 * Requires SANITY_WRITE_TOKEN in .env.local (an Editor-permission token from
 * sanity.io/manage). Reads project id / dataset from the same env vars the app uses.
 *
 * Idempotent: each document's _id is derived from its slug, so re-running this
 * script updates existing guides instead of creating duplicates.
 */

const fs = require("fs");
const path = require("path");
const { guides } = require("./guides-content.js");

// ── Load .env.local (no dotenv dependency needed) ──────────────────────────
function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-01";
const TOKEN = process.env.SANITY_WRITE_TOKEN;

const DRY_RUN = process.argv.includes("--dry-run");

if (!PROJECT_ID) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}
if (!TOKEN && !DRY_RUN) {
  console.error(
    "Missing SANITY_WRITE_TOKEN in .env.local.\n" +
      "Create an Editor-permission token at https://sanity.io/manage (project " +
      PROJECT_ID +
      " -> API -> Tokens) and add:\n\n  SANITY_WRITE_TOKEN=sk...\n\nto .env.local, then re-run this script."
  );
  process.exit(1);
}

// ── Minimal markdown -> Sanity Portable Text converter ──────────────────────
// Supports: ## / ### headings, blank-line-separated paragraphs, "- " bullet
// lists (consecutive lines), and nothing fancier. That's all the guide bodies use.

function randKey(prefix) {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`;
}

function textSpan(text) {
  return [{ _type: "span", _key: randKey("sp"), text, marks: [] }];
}

function block(style, text, extra) {
  return {
    _type: "block",
    _key: randKey("blk"),
    style,
    markDefs: [],
    children: textSpan(text),
    ...extra,
  };
}

function markdownToBlocks(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").trim().split("\n");
  const blocks = [];
  let paragraphBuf = [];
  let listBuf = [];

  function flushParagraph() {
    if (paragraphBuf.length) {
      blocks.push(block("normal", paragraphBuf.join(" ").trim()));
      paragraphBuf = [];
    }
  }
  function flushList() {
    if (listBuf.length) {
      const listKey = randKey("list");
      for (const item of listBuf) {
        blocks.push(
          block("normal", item, { listItem: "bullet", level: 1, _key: `${listKey}-${randKey("li")}` })
        );
      }
      listBuf = [];
    }
  }

  for (const raw of lines) {
    const line = raw.trim();

    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }

    const h2 = line.match(/^##\s+(.*)$/);
    const h3 = line.match(/^###\s+(.*)$/);
    const bullet = line.match(/^-\s+(.*)$/);
    const numbered = line.match(/^\d+\.\s+(.*)$/);

    if (h2) {
      flushParagraph();
      flushList();
      blocks.push(block("h2", h2[1].trim()));
    } else if (h3) {
      flushParagraph();
      flushList();
      blocks.push(block("h3", h3[1].trim()));
    } else if (bullet) {
      flushParagraph();
      listBuf.push(bullet[1].trim());
    } else if (numbered) {
      flushParagraph();
      listBuf.push(numbered[1].trim());
    } else {
      flushList();
      paragraphBuf.push(line);
    }
  }
  flushParagraph();
  flushList();

  return blocks;
}

// ── Build Sanity documents ──────────────────────────────────────────────────

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toDocument(guide) {
  const id = `guide-${slugify(guide.slug)}`;
  return {
    _id: id,
    _type: "guide",
    title: guide.title,
    slug: { _type: "slug", current: guide.slug },
    category: guide.category,
    excerpt: guide.excerpt,
    readTime: guide.readTime,
    featured: guide.featured,
    publishedAt: guide.publishedAt,
    body: markdownToBlocks(guide.body),
  };
}

async function main() {
  const documents = guides.map(toDocument);

  console.log(`Prepared ${documents.length} guide documents.`);
  for (const doc of documents) {
    console.log(`  - [${doc.category}] ${doc.title}  (${doc._id})`);
  }

  if (DRY_RUN) {
    console.log("\n--dry-run: not sending anything to Sanity.");
    console.log("\nSample document (first one):");
    console.log(JSON.stringify(documents[0], null, 2).slice(0, 2000));
    return;
  }

  const mutations = documents.map((doc) => ({ createOrReplace: doc }));
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;

  console.log(`\nPushing to Sanity project ${PROJECT_ID}, dataset ${DATASET}...`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations }),
  });

  const body = await res.json();

  if (!res.ok) {
    console.error("Sanity API error:", res.status, JSON.stringify(body, null, 2));
    process.exit(1);
  }

  console.log(`Success. ${body.results?.length ?? documents.length} documents created/updated.`);
}

main().catch((err) => {
  console.error("Publish failed:", err);
  process.exit(1);
});
