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
    icon: '<path d="M13 11v10M16 11v10M14.5 11v16M23 11v8a3 3 0 0 0 3 3h.5M26.5 11v16"/>',
  },
  bar: {
    fill: "#f59e0b",
    ring: "rgba(245,158,11,0.45)",
    stroke: "#111827",
    icon: '<path d="M13 11h14l-5 7v6m-4 0h8M18 24h-4"/><path d="M18 24V18"/>',
  },
  club: {
    fill: "#a855f7",
    ring: "rgba(168,85,247,0.48)",
    stroke: "#f5f3ff",
    icon: '<path d="M16 25V13l9-2v11"/><circle cx="14" cy="25" r="2.4"/><circle cx="23" cy="23" r="2.4"/>',
  },
  lounge: {
    fill: "#5eead4",
    ring: "rgba(94,234,212,0.42)",
    stroke: "#083344",
    icon: '<path d="M12 18c2-2 4-2 6 0s4 2 6 0"/><path d="M12 22c2-2 4-2 6 0s4 2 6 0"/><path d="M15 14c1.2-1.4 2.4-1.4 3.6 0"/>',
  },
  other: {
    fill: "#22d3ee",
    ring: "rgba(34,211,238,0.38)",
    stroke: "#ecfeff",
    icon: '<path d="M20 12.2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M20 21v6"/>',
  },
};

function markerSvg(type: VenueType, selected: boolean) {
  const visual = VISUALS[type];
  const size = selected ? 40 : 34;
  const ring = selected ? 2.6 : 2;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 44" width="${size}" height="${size + 6}" fill="none" role="img" aria-label="${type} marker">
    <defs>
      <filter id="marker-shadow" x="-35%" y="-35%" width="170%" height="190%">
        <feDropShadow dx="0" dy="4" stdDeviation="2.6" flood-color="${selected ? visual.ring : "rgba(0,0,0,0.32)"}" flood-opacity="1"/>
      </filter>
    </defs>
    <g filter="url(#marker-shadow)">
      <circle cx="20" cy="18" r="12" fill="${visual.fill}" stroke="#ffffff" stroke-width="${ring}"/>
      <g stroke="${visual.stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${visual.icon}</g>
    </g>
  </svg>`;
}

export function createVenueMarkerElement(type: VenueType, selected: boolean) {
  const node = document.createElement("div");
  node.style.width = selected ? "40px" : "34px";
  node.style.height = selected ? "46px" : "40px";
  node.style.transform = "translateY(-3px)";
  node.innerHTML = markerSvg(type, selected);
  return node;
}

export function updateVenueMarkerElement(node: HTMLDivElement, type: VenueType, selected: boolean) {
  node.style.width = selected ? "40px" : "34px";
  node.style.height = selected ? "46px" : "40px";
  node.innerHTML = markerSvg(type, selected);
}

export function createVenueMarkerDataUrl(type: VenueType, selected: boolean) {
  const svg = markerSvg(type, selected);
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
  return {
    url: `data:image/svg+xml,${encoded}`,
    size: selected ? 40 : 34,
  };
}
