"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapPinned } from "lucide-react";
import { Card } from "@/components/ui";
import { LiveVenue } from "@/lib/live/transform-live-venues";

declare global {
  interface Window {
    google?: any;
  }
}

type LiveMapProps = {
  venues: LiveVenue[];
  selectedVenueId: string | null;
  onSelectVenue: (venueId: string) => void;
  fallbackCenter: { lat: number; lng: number };
};

const MAP_SCRIPT_ID = "google-maps-script";

export function LiveMap({ venues, selectedVenueId, onSelectVenue, fallbackCenter }: LiveMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  const mapCenter = useMemo(() => {
    const selectedVenue = venues.find((venue) => venue.id === selectedVenueId);
    if (selectedVenue) {
      return { lat: selectedVenue.lat, lng: selectedVenue.lng };
    }

    const firstVenue = venues[0];
    if (firstVenue) {
      return { lat: firstVenue.lat, lng: firstVenue.lng };
    }

    return fallbackCenter;
  }, [fallbackCenter, selectedVenueId, venues]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapElementRef.current) return;

    const initializeMap = () => {
      if (!window.google || !mapElementRef.current) return;
      if (!mapRef.current) {
        mapRef.current = new window.google.maps.Map(mapElementRef.current, {
          center: mapCenter,
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#111827" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#e4e4e7" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1f2937" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#172554" }] },
          ],
        });
        infoWindowRef.current = new window.google.maps.InfoWindow();
      }

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();

      const bounds = new window.google.maps.LatLngBounds();

      venues.forEach((venue) => {
        const selected = selectedVenueId === venue.id;
        const marker = new window.google.maps.Marker({
          position: { lat: venue.lat, lng: venue.lng },
          map: mapRef.current,
          title: venue.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: selected ? "#22d3ee" : "#f472b6",
            fillOpacity: 0.95,
            strokeColor: "#ffffff",
            strokeWeight: selected ? 2 : 1,
            scale: selected ? 9 : 7,
          },
        });

        marker.addListener("click", () => {
          onSelectVenue(venue.id);
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(`<div style=\"color:#111;font-weight:600;\">${venue.name}</div>`);
            infoWindowRef.current.open({ map: mapRef.current, anchor: marker });
          }
        });

        markersRef.current.set(venue.id, marker);
        bounds.extend(marker.getPosition());
      });

      if (venues.length > 1) {
        mapRef.current.fitBounds(bounds, 48);
      } else {
        mapRef.current.setCenter(mapCenter);
        mapRef.current.setZoom(14);
      }
    };

    if (window.google) {
      initializeMap();
      return;
    }

    if (!document.getElementById(MAP_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = MAP_SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
      return;
    }

    const poll = setInterval(() => {
      if (window.google) {
        initializeMap();
        clearInterval(poll);
      }
    }, 200);

    return () => clearInterval(poll);
  }, [fallbackCenter, mapCenter, onSelectVenue, selectedVenueId, venues]);

  return (
    <Card className="rounded-2xl p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold sm:text-lg">Live map</h3>
        <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
          <MapPinned size={14} /> {venues.length} markers
        </span>
      </div>
      <div
        ref={mapElementRef}
        className="h-[240px] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 sm:h-[290px] lg:h-[360px]"
      />
      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <p className="mt-2 text-xs text-amber-200">Map unavailable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing.</p>
      )}
    </Card>
  );
}
