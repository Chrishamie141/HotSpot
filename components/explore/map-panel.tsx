"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

type MapPanelProps = {
  center: { lat: number; lng: number };
  venues: Array<{ id: string; name: string; lat: number; lng: number }>;
};

export function MapPanel({ center, venues }: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    const scriptId = "google-maps-script";
    const initMap = () => {
      if (!window.google || !mapRef.current) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#111827" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#e4e4e7" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#1f2937" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#172554" }] }
        ]
      });

      venues.forEach((venue) => {
        new window.google!.maps.Marker({
          position: { lat: venue.lat, lng: venue.lng },
          map,
          title: venue.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#f472b6",
            fillOpacity: 0.9,
            strokeColor: "#fff",
            strokeWeight: 1,
            scale: 7
          }
        });
      });
    };

    if (window.google) {
      initMap();
      return;
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
      return;
    }

    const poll = setInterval(() => {
      if (window.google) {
        initMap();
        clearInterval(poll);
      }
    }, 200);

    return () => clearInterval(poll);
  }, [center, venues]);

  return <div ref={mapRef} className="glass h-[72vh] w-full overflow-hidden rounded-3xl" />;
}
