export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatPrice(price?: string): string {
  return price || "Price on enquiry";
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    available: "Available",
    reserved: "Reserved",
    "new-arrival": "New Arrival",
    "coming-soon": "Coming Soon",
    sold: "Sold",
  };
  return map[status] ?? status;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    available: "#22c55e",
    reserved: "#eab308",
    "new-arrival": "#3b82f6",
    "coming-soon": "#a855f7",
    sold: "#6b7280",
  };
  return map[status] ?? "#22c55e";
}

export function stars(rating: number): string {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
}
