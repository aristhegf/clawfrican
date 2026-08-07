"use client";

import { useRef, useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: 12,
  border: "1px solid var(--color-line)",
  background: "#fff",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  color: "var(--color-ink)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  marginBottom: "0.5rem",
  color: "rgba(20,16,8,0.7)",
};

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  function removePhoto() {
    setPhoto(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setStatus("error");
      setErrorMessage("Please choose a star rating.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData();
    formData.set("name", name);
    formData.set("location", location);
    formData.set("quote", quote);
    formData.set("rating", String(rating));
    if (photo) formData.set("photo", photo);

    try {
      const res = await fetch("/api/reviews", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          textAlign: "center",
          background: "#fff",
          border: "1px solid var(--color-line)",
          borderRadius: 18,
          padding: "3rem 2rem",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🐾</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", marginBottom: "0.75rem" }}>
          Thank you!
        </h3>
        <p style={{ color: "rgba(20,16,8,0.6)", fontSize: "0.95rem", lineHeight: 1.65 }}>
          Your review has been submitted and is being looked over. Once approved, it will appear on this page.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        border: "1px solid var(--color-line)",
        borderRadius: 18,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      {/* Honeypot — hidden from real users, bots often fill it */}
      <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label style={labelStyle} htmlFor="rf-rating">
          Your rating
        </label>
        <div style={{ display: "flex", gap: "0.375rem" }} id="rf-rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              style={{
                fontSize: "1.75rem",
                lineHeight: 1,
                color: (hoverRating || rating) >= n ? "var(--color-gold)" : "rgba(20,16,8,0.2)",
                transition: "color 0.15s ease, transform 0.15s ease",
                transform: hoverRating === n ? "scale(1.12)" : "scale(1)",
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="rf-name">
          Your name
        </label>
        <input
          id="rf-name"
          name="name"
          type="text"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Amaka O."
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="rf-location">
          Location <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
        </label>
        <input
          id="rf-location"
          name="location"
          type="text"
          maxLength={60}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Lagos"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="rf-quote">
          Your review
        </label>
        <textarea
          id="rf-quote"
          name="quote"
          required
          minLength={10}
          maxLength={1000}
          rows={5}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Tell us about your companion and your experience with Clawfrican."
          style={{ ...inputStyle, resize: "vertical", fontFamily: "var(--font-body)" }}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="rf-photo">
          Photo <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
        </label>
        {photoPreview ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid var(--color-line)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <button
              type="button"
              onClick={removePhoto}
              style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-bronze)" }}
            >
              Remove photo
            </button>
          </div>
        ) : (
          <input
            ref={fileInputRef}
            id="rf-photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ fontSize: "0.875rem" }}
          />
        )}
      </div>

      {status === "error" && (
        <p style={{ color: "#b91c1c", fontSize: "0.875rem", fontWeight: 600 }}>{errorMessage}</p>
      )}

      <button type="submit" className="btn btn-gold" disabled={status === "submitting"} style={{ justifyContent: "center" }}>
        {status === "submitting" ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
