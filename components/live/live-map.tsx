"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, MapPinned } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  const selectedVenue = useMemo(
    () => venues.find((venue) => venue.id === selectedVenueId) ?? null,
    [selectedVenueId, venues]
  );

  const mapCenter = useMemo(() => {
    if (selectedVenue) {
      return { lat: selectedVenue.lat, lng: selectedVenue.lng };
    }

    if (venues[0]) {
      return { lat: venues[0].lat, lng: venues[0].lng };
    }

    return fallbackCenter;
  }, [fallbackCenter, selectedVenue, venues]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapElementRef.current) return;

    const initializeMap = () => {
      if (!window.google || !mapElementRef.current) return;

      if (!mapRef.current) {
        mapRef.current = new window.google.maps.Map(mapElementRef.current, {
          center: mapCenter,
          zoom: 13,
          disableDefaultUI: false,
          clickableIcons: false,
          gestureHandling: "greedy",
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
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

      venues.forEach((venue) => {
        const isSelected = selectedVenueId === venue.id;

        const marker = new window.google.maps.Marker({
          position: { lat: venue.lat, lng: venue.lng },
          map: mapRef.current,
          title: venue.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: isSelected ? "#22d3ee" : "#f472b6",
            fillOpacity: 0.95,
            strokeColor: "#ffffff",
            strokeWeight: isSelected ? 2 : 1,
            scale: isSelected ? 10 : 8,
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
      });

      if (selectedVenue) {
        mapRef.current.setCenter({ lat: selectedVenue.lat, lng: selectedVenue.lng });
        mapRef.current.setZoom(15);
      } else if (venues.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        venues.forEach((venue) => {
          bounds.extend({ lat: venue.lat, lng: venue.lng });
        });
        mapRef.current.fitBounds(bounds, 48);
      } else {
        mapRef.current.setCenter(mapCenter);
        mapRef.current.setZoom(14);
      }

      window.google.maps.event.trigger(mapRef.current, "resize");
      mapRef.current.setCenter(mapCenter);
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
  }, [mapCenter, onSelectVenue, selectedVenue, selectedVenueId, venues]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const handleResize = () => {
      window.google.maps.event.trigger(mapRef.current, "resize");
      mapRef.current.setCenter(mapCenter);
    };

    const timeout = window.setTimeout(handleResize, 120);
    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [isExpanded, mapCenter]);

  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-[#090d18] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold sm:text-lg">Live map</h3>
        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          className="inline-flex min-h-9 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 text-xs text-zinc-200"
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {isExpanded ? "Collapse map" : "Tap to expand map"}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span className="inline-flex items-center gap-1">
          <MapPinned size={14} /> {venues.length} markers
        </span>
        <span>Pinch / drag to explore</span>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div
          ref={mapElementRef}
          className={`w-full ${isExpanded ? "h-[420px]" : "h-[280px] md:h-[320px] lg:h-[400px]"}`}
          style={{ imageRendering: "auto" }}
        />
      </div>

      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <p className="text-xs text-amber-200">Map unavailable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing.</p>
      )}
    </section>
  );
}
