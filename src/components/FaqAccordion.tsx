"use client";

import { useState } from "react";

type FaqItem = { _id: string; question: string; answer: string; category?: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (!items.length) return null;

  return (
    <>
      {items.map((item) => {
        const isOpen = open === item._id;
        return (
          <div key={item._id} className={`faq-item${isOpen ? " open" : ""}`}>
            <button
              className="faq-question"
              onClick={() => setOpen(isOpen ? null : item._id)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
            </button>
            {isOpen && <div className="faq-answer">{item.answer}</div>}
          </div>
        );
      })}
    </>
  );
}
