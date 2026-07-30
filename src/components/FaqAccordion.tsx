"use client";

import { useState } from "react";

type FaqItem = { _id: string; question: string; answer: string; category?: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (!items.length) return null;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {items.map((item) => (
        <div key={item._id} className="faq-item">
          <button
            className="faq-question"
            onClick={() => setOpen(open === item._id ? null : item._id)}
            aria-expanded={open === item._id}
          >
            <span>{item.question}</span>
            <span
              style={{
                fontSize: "1.25rem",
                flexShrink: 0,
                transition: "transform 0.2s ease",
                transform: open === item._id ? "rotate(45deg)" : "rotate(0deg)",
                color: "var(--color-gold-deep)",
              }}
            >
              +
            </span>
          </button>
          <div
            className="faq-answer"
            style={{
              maxHeight: open === item._id ? "400px" : "0",
              paddingBottom: open === item._id ? "1.25rem" : "0",
              transition: "max-height 0.35s ease, padding 0.35s ease",
            }}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
