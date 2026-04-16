import type { VenueType } from "@/lib/live/getVenueType";

type MarkerVisual = {
  fill: string;
  ring: string;
  icon: string;
  stroke: string;
};

const VISUALS: Record<VenueType, MarkerVisual> = {
  restaurant: {
    fill: "#f97316",
    ring: "rgba(249,115,22,0.42)",
    stroke: "#fff7ed",
    icon: '<path d="M13.6 10.8v10.8M16.8 10.8v10.8M15.2 10.8v16.2M23.4 10.8v8.2a3 3 0 0 0 3 3h.5M26.9 10.8v16.2"/>',
  },
  bar: {
    fill: "#f59e0b",
    ring: "rgba(245,158,11,0.45)",
    stroke: "#111827",
    icon: '<path d="M13.4 11.2h13.2l-4.8 6.8v6.4m-3.6 0h7.4M18.2 24.4h-3.6"/><path d="M18.2 24.4v-6.3"/>',
  },
  club: {
    fill: "#a855f7",
    ring: "rgba(168,85,247,0.48)",
    stroke: "#f5f3ff",
    icon: '<path d="M16.2 25.6V12.8l8.8-2v11.5"/><circle cx="14.2" cy="25.6" r="2.4"/><circle cx="23" cy="23.3" r="2.4"/>',
  },
  lounge: {
    fill: "#5eead4",
    ring: "rgba(94,234,212,0.42)",
    stroke: "#083344",
    icon: '<path d="M16.2 27.2c-2.2-1.7-2-4 .4-5.8 2.2-1.7 2.5-4.1.5-6"/><path d="M20.3 28.4c-2.2-1.9-2.1-4.2.3-6.2 2.3-1.9 2.6-4.5.5-6.5"/><path d="M24.2 27c-1.8-1.5-1.8-3.5.2-5.2 2-1.6 2.4-3.6.7-5.4"/>',
  },
  other: {
    fill: "#22d3ee",
    ring: "rgba(34,211,238,0.38)",
    stroke: "#ecfeff",
    icon: '<path d="M20 11.8a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6z"/><path d="M20 21.3v5.3"/>',
  },
};

const BASE_SIZE = 38;
const SELECTED_SIZE = 44;
const BASE_HEIGHT = 44;
const SELECTED_HEIGHT = 50;

function markerSvg(type: VenueType, selected: boolean) {
  const visual = VISUALS[type];
  const size = selected ? SELECTED_SIZE : BASE_SIZE;
  const ring = selected ? 2.7 : 2.2;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 44" width="${size}" height="${size + 6}" fill="none" role="img" aria-label="${type} marker">
    <defs>
      <filter id="marker-shadow" x="-35%" y="-35%" width="170%" height="190%">
        <feDropShadow dx="0" dy="4" stdDeviation="2.6" flood-color="${selected ? visual.ring : "rgba(0,0,0,0.32)"}" flood-opacity="1"/>
      </filter>
    </defs>
    <g filter="url(#marker-shadow)">
      <circle cx="20" cy="18" r="13.4" fill="${visual.fill}" stroke="#ffffff" stroke-width="${ring}"/>
      <g stroke="${visual.stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${visual.icon}</g>
    </g>
  </svg>`;
}

export function createVenueMarkerElement(type: VenueType, selected: boolean) {
  const node = document.createElement("div");
  node.style.width = selected ? `${SELECTED_SIZE}px` : `${BASE_SIZE}px`;
  node.style.height = selected ? `${SELECTED_HEIGHT}px` : `${BASE_HEIGHT}px`;
  node.style.transform = "translateY(-3px)";
  node.innerHTML = markerSvg(type, selected);
  return node;
}

export function updateVenueMarkerElement(node: HTMLDivElement, type: VenueType, selected: boolean) {
  node.style.width = selected ? `${SELECTED_SIZE}px` : `${BASE_SIZE}px`;
  node.style.height = selected ? `${SELECTED_HEIGHT}px` : `${BASE_HEIGHT}px`;
  node.innerHTML = markerSvg(type, selected);
}

export function createVenueMarkerDataUrl(type: VenueType, selected: boolean) {
  const svg = markerSvg(type, selected);
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
  return {
    url: `data:image/svg+xml,${encoded}`,
    size: selected ? SELECTED_SIZE : BASE_SIZE,
  };
}
