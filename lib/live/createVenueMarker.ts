import { VenueType } from "@/lib/live/getVenueType";

type MarkerVisual = {
  fill: string;
  ring: string;
};

const VISUALS: Record<VenueType, MarkerVisual> = {
  restaurant: { fill: "#f97316", ring: "rgba(249,115,22,0.45)" },
  bar: { fill: "#f59e0b", ring: "rgba(245,158,11,0.45)" },
  club: { fill: "#a855f7", ring: "rgba(168,85,247,0.5)" },
  other: { fill: "#06b6d4", ring: "rgba(6,182,212,0.45)" },
};

const SHAPES: Record<VenueType, { viewBox: string; body: string }> = {
  restaurant: {
    viewBox: "0 0 36 36",
    body: '<circle cx="18" cy="18" r="13.5" />',
  },
  bar: {
    viewBox: "0 0 36 36",
    body: '<rect x="5" y="7" width="26" height="22" rx="8" ry="8" />',
  },
  club: {
    viewBox: "0 0 36 36",
    body: '<polygon points="18,3 31,11 31,25 18,33 5,25 5,11" />',
  },
  other: {
    viewBox: "0 0 36 44",
    body: '<path d="M18 3C10.3 3 4 9.2 4 16.9c0 9.4 9.5 17.8 12.8 20.5a1.8 1.8 0 0 0 2.3 0C22.5 34.7 32 26.3 32 16.9 32 9.2 25.7 3 18 3z" />',
  },
};

const ICONS: Record<VenueType, string> = {
  restaurant:
    '<path d="M12 10v9M16 10v9M14 10v20M21 10v9a3.5 3.5 0 0 0 3.5 3.5H25M25 10v20" />',
  bar:
    '<path d="M12 10h12M14 10v5l-3 4h14l-3-4v-5M18 19v8" />',
  club:
    '<path d="M14 24V11l10-2v11"/><circle cx="12" cy="24" r="2.5"/><circle cx="22" cy="22" r="2.5"/>',
  other:
    '<circle cx="18" cy="16" r="4"/><path d="M18 24v6"/>',
};

function markerSvg(type: VenueType, selected: boolean) {
  const visual = VISUALS[type];
  const shape = SHAPES[type];
  const iconStroke = type === "bar" ? "#1f2937" : "#f8fafc";
  const ringWidth = selected ? 3 : 2;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="${shape.viewBox}" width="${selected ? 42 : 36}" height="${selected ? 50 : 44}" fill="none" role="img" aria-label="${type} marker">
    <g filter="url(#shadow)">
      <g fill="${visual.fill}" stroke="#ffffff" stroke-width="${ringWidth}">
        ${shape.body}
      </g>
      <g stroke="${iconStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
        ${ICONS[type]}
      </g>
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
  node.style.width = selected ? "42px" : "36px";
  node.style.height = selected ? "50px" : "44px";
  node.style.transform = "translateY(-4px)";
  node.style.willChange = "auto";
  node.innerHTML = markerSvg(type, selected);
  return node;
}

export function updateVenueMarkerElement(node: HTMLDivElement, type: VenueType, selected: boolean) {
  node.style.width = selected ? "42px" : "36px";
  node.style.height = selected ? "50px" : "44px";
  node.innerHTML = markerSvg(type, selected);
}

export function createVenueMarkerDataUrl(type: VenueType, selected: boolean) {
  const svg = markerSvg(type, selected);
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
  return {
    url: `data:image/svg+xml,${encoded}`,
    size: selected ? 42 : 36,
  };
}
