import type { VenueType } from "@/lib/live/getVenueType";

type MarkerVisual = {
  fill: string;
  ring: string;
  iconStroke: string;
};

const VISUALS: Record<VenueType, MarkerVisual> = {
  restaurant: {
    fill: "#fb923c",
    ring: "rgba(251,146,60,0.42)",
    iconStroke: "#fff7ed",
  },
  bar: {
    fill: "#f59e0b",
    ring: "rgba(245,158,11,0.45)",
    iconStroke: "#111827",
  },
  club: {
    fill: "#a855f7",
    ring: "rgba(168,85,247,0.5)",
    iconStroke: "#f5f3ff",
  },
  other: {
    fill: "#22d3ee",
    ring: "rgba(34,211,238,0.42)",
    iconStroke: "#ecfeff",
  },
};

const SHAPES: Record<VenueType, { viewBox: string; body: string }> = {
  restaurant: {
    viewBox: "0 0 40 44",
    body: '<path d="M20 4C10.8 4 4 10.3 4 18.7c0 8.5 7.2 13.5 12.1 16.8l2.8 1.9a2 2 0 0 0 2.2 0l2.8-1.9C28.8 32.2 36 27.2 36 18.7 36 10.3 29.2 4 20 4z"/>',
  },
  bar: {
    viewBox: "0 0 40 44",
    body: '<path d="M8 7h24a4 4 0 0 1 4 4v12c0 2.7-1.8 5.1-4.3 5.8L24 31.1V36a4 4 0 0 1-4 4h0a4 4 0 0 1-4-4v-4.9l-7.7-2.3A6 6 0 0 1 4 23V11a4 4 0 0 1 4-4z"/>',
  },
  club: {
    viewBox: "0 0 40 44",
    body: '<path d="M20 3.5 34 11v14L20 40.5 6 25V11z"/>',
  },
  other: {
    viewBox: "0 0 40 44",
    body: '<path d="M20 3C11.2 3 4 10.1 4 18.8c0 10.6 10.3 17.9 14 20.3a3.4 3.4 0 0 0 4 0c3.7-2.4 14-9.7 14-20.3C36 10.1 28.8 3 20 3z"/>',
  },
};

const ICONS: Record<VenueType, string> = {
  restaurant:
    '<circle cx="20" cy="19" r="6"/><path d="M11 12v14M14.5 12v14M12.75 12v20M26 12v8a3.5 3.5 0 0 0 3.5 3.5H30M30 12v20"/>',
  bar:
    '<path d="M13 12h14l-4.8 6.8a3 3 0 0 0-.55 1.7V31M20 31h6M20 31h-6"/><path d="M16 14h8"/>',
  club:
    '<path d="M16 27V14l10-2v12"/><circle cx="14" cy="27" r="2.8"/><circle cx="24" cy="25" r="2.8"/>',
  other:
    '<path d="M20 12.5a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Z"/><path d="M20 23.5v6"/><path d="M17.2 26.3h5.6"/>',
};

function markerSvg(type: VenueType, selected: boolean) {
  const visual = VISUALS[type];
  const shape = SHAPES[type];
  const ringWidth = selected ? 3 : 2;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="${shape.viewBox}" width="${selected ? 44 : 38}" height="${selected ? 52 : 46}" fill="none" role="img" aria-label="${type} marker">
    <g filter="url(#shadow)">
      <g fill="${visual.fill}" stroke="#ffffff" stroke-width="${ringWidth}">${shape.body}</g>
      <g stroke="${visual.iconStroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none">${ICONS[type]}</g>
    </g>
    <defs>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="${selected ? visual.ring : "rgba(0,0,0,0.35)"}" flood-opacity="1"/>
      </filter>
    </defs>
  </svg>`;
}

export function createVenueMarkerElement(type: VenueType, selected: boolean) {
  const node = document.createElement("div");
  node.style.display = "block";
  node.style.width = selected ? "44px" : "38px";
  node.style.height = selected ? "52px" : "46px";
  node.style.transform = "translateY(-4px)";
  node.innerHTML = markerSvg(type, selected);
  return node;
}

export function updateVenueMarkerElement(node: HTMLDivElement, type: VenueType, selected: boolean) {
  node.style.width = selected ? "44px" : "38px";
  node.style.height = selected ? "52px" : "46px";
  node.innerHTML = markerSvg(type, selected);
}

export function createVenueMarkerDataUrl(type: VenueType, selected: boolean) {
  const svg = markerSvg(type, selected);
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
  return {
    url: `data:image/svg+xml,${encoded}`,
    size: selected ? 44 : 38,
  };
}
