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
  selectedVenueId: string | null;
  onMarkerSelect: (venueId: string) => void;
};

export function MapPanel({ center, venues, selectedVenueId, onMarkerSelect }: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    const scriptId = "google-maps-script";
    const initMap = () => {
      if (!window.google || !mapRef.current) return;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: [
            { elementType: "geometry", stylers: [{ color: "#111827" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#e4e4e7" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1f2937" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#172554" }] },
          ],
        });
      }

      const map = mapInstanceRef.current;
      map.setCenter(center);

      const validIds = new Set(venues.map((venue) => venue.id));
      markersRef.current.forEach((marker, id) => {
        if (!validIds.has(id)) {
          marker.setMap(null);
          markersRef.current.delete(id);
        }
      });

      venues.forEach((venue) => {
        if (markersRef.current.has(venue.id)) return;

        const marker = new window.google.maps.Marker({
          position: { lat: venue.lat, lng: venue.lng },
          map,
          title: venue.name,
        });

        marker.addListener("click", () => onMarkerSelect(venue.id));
        markersRef.current.set(venue.id, marker);
      });

      markersRef.current.forEach((marker, id) => {
        const active = id === selectedVenueId;
        marker.setIcon({
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: active ? "#22d3ee" : "#f472b6",
          fillOpacity: active ? 1 : 0.9,
          strokeColor: "#fff",
          strokeWeight: active ? 2 : 1,
          scale: active ? 9 : 7,
        });
        marker.setZIndex(active ? 999 : 1);
      });

      const selectedVenue = venues.find((venue) => venue.id === selectedVenueId);
      if (selectedVenue) {
        map.panTo({ lat: selectedVenue.lat, lng: selectedVenue.lng });
      }
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
  }, [center, onMarkerSelect, selectedVenueId, venues]);

  return <div ref={mapRef} className="glass h-[60vh] w-full overflow-hidden rounded-3xl md:h-[72vh]" />;
}
