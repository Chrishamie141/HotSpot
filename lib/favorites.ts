export type SavedVenue = {
  id: string;
  name: string;
  address: string;
  type: "restaurant" | "bar" | "club" | "lounge" | "other";
  rating: number | null;
  photoUrl?: string | null;
  lat?: number;
  lng?: number;
};

export const FAVORITES_STORAGE_KEY = "nightpulse:favorites:v1";

export function readFavorites(): SavedVenue[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeFavorites(venues: SavedVenue[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(venues));
}

export function toggleFavoriteVenue(venue: SavedVenue): SavedVenue[] {
  const current = readFavorites();
  const exists = current.some((item) => item.id === venue.id);
  const next = exists
    ? current.filter((item) => item.id !== venue.id)
    : [venue, ...current];

  writeFavorites(next);
  return next;
}

export function isVenueSaved(venueId: string) {
  return readFavorites().some((item) => item.id === venueId);
}
