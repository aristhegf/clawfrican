"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function TayoChat({ wa }: { wa: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Tayo, your Clawfrican pet consultant 🐾 What kind of companion are you dreaming of?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || "I'm here — tell me what you're looking for!" }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Connection hiccup — try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-bubble">
      {open && (
        <div className="chat-panel">
          {/* Header */}
          <div style={{ background: "var(--color-emerald)", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", color: "var(--color-cream)", fontSize: "1rem" }}>Tayo</p>
              <p style={{ color: "rgba(245,245,220,0.6)", fontSize: "0.75rem" }}>Pet Consultant · Clawfrican</p>
            </div>
            <div className="flex items-center gap-2">
              <a href={wa} target="_blank" rel="noopener noreferrer"
                style={{ background: "#25d366", color: "#fff", fontSize: "0.75rem", fontWeight: 600, padding: "0.3rem 0.75rem", borderRadius: 50, whiteSpace: "nowrap" }}>
                WhatsApp
              </a>
              <button onClick={() => setOpen(false)}
                style={{ color: "rgba(245,245,220,0.6)", fontSize: "1.25rem", lineHeight: 1, padding: "0 0.25rem" }}>
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: 320 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%",
                  padding: "0.625rem 0.875rem",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? "var(--color-emerald)" : "var(--color-cream)",
                  color: m.role === "user" ? "var(--color-cream)" : "var(--color-ink)",
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                  border: m.role === "assistant" ? "1px solid var(--color-line)" : "none",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ padding: "0.625rem 0.875rem", borderRadius: "16px 16px 16px 4px", background: "var(--color-cream)", border: "1px solid var(--color-line)", fontSize: "0.875rem", color: "rgba(20,16,8,0.4)" }}>
                  Tayo is thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--color-line)", display: "flex", gap: "0.5rem" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask Tayo anything…"
              style={{
                flex: 1, padding: "0.6rem 0.875rem", borderRadius: 50, border: "1px solid var(--color-line)",
                fontSize: "0.875rem", background: "var(--color-cream)", outline: "none", color: "var(--color-ink)",
                fontFamily: "var(--font-body)",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, borderRadius: "50%", background: "var(--color-gold)", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem",
                opacity: loading || !input.trim() ? 0.5 : 1, transition: "opacity 0.15s",
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setOpen((p) => !p)} aria-label="Chat with Tayo">
        {open ? "×" : "🐾"}
      </button>
    </div>
  );
}
