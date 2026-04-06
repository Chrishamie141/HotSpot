"use client";

import { useEffect, useRef } from "react";
import { ExploreVenue } from "@/lib/explore/types";

declare global {
  interface Window {
    google?: any;
  }
}

type ExploreMapPanelProps = {
  center: { lat: number; lng: number };
  venues: ExploreVenue[];
  selectedVenueId: string | null;
  onSelectVenue: (venueId: string) => void;
};

export function ExploreMapPanel({ center, venues, selectedVenueId, onSelectVenue }: ExploreMapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    const scriptId = "google-maps-script";
    const initMap = () => {
      if (!window.google || !mapRef.current) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#0b1020" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#d4d4d8" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#181f33" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#13254f" }] }
        ]
      });

      const infoWindow = new window.google.maps.InfoWindow();

      venues.forEach((venue) => {
        const isSelected = selectedVenueId === venue.id;
        const marker = new window.google.maps.Marker({
          position: { lat: venue.lat, lng: venue.lng },
          map,
          title: venue.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: isSelected ? "#22d3ee" : "#f472b6",
            fillOpacity: 0.95,
            strokeColor: "#fff",
            strokeWeight: 1,
            scale: isSelected ? 9 : 7
          }
        });

        marker.addListener("click", () => {
          onSelectVenue(venue.id);
          infoWindow.setContent(`<div style=\"color:#111827;font-weight:600;\">${venue.name}</div><div style=\"color:#4b5563;\">${venue.address}</div>`);
          infoWindow.open({ map, anchor: marker });
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
    }, 250);

    return () => clearInterval(poll);
  }, [center, onSelectVenue, selectedVenueId, venues]);

  return <div ref={mapRef} className="glass h-[72vh] w-full overflow-hidden rounded-3xl" />;
}
