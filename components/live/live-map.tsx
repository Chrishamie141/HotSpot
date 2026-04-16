"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, MapPinned } from "lucide-react";
import { LiveVenue } from "@/lib/live/transform-live-venues";
import type { VenueType } from "@/lib/live/getVenueType";
import { classifyVenueType } from "@/lib/live/classifyVenueType";
import {
  createVenueMarkerDataUrl,
  createVenueMarkerElement,
  updateVenueMarkerElement,
} from "@/lib/live/createVenueMarker";

declare global {
  interface Window {
    google?: any;
    __nightPulseGoogleMapsPromise?: Promise<void>;
  }
}

type LiveMapProps = {
  venues: LiveVenue[];
  selectedVenueId: string | null;
  onSelectVenue: (venueId: string) => void;
  fallbackCenter: { lat: number; lng: number };
};

type MarkerRecord = {
  marker: any;
  venueType: VenueType;
  node?: HTMLDivElement;
  confidence: "high" | "medium" | "low";
  reason: string;
};

const MAP_SCRIPT_ID = "google-maps-script";


function loadGoogleMaps(apiKey: string): Promise<void> {
  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (window.__nightPulseGoogleMapsPromise) {
    return window.__nightPulseGoogleMapsPromise;
  }

  window.__nightPulseGoogleMapsPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(MAP_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      const poll = window.setInterval(() => {
        if (window.google?.maps) {
          window.clearInterval(poll);
          resolve();
        }
      }, 80);

      window.setTimeout(() => {
        window.clearInterval(poll);
        if (!window.google?.maps) {
          reject(new Error("Google Maps script did not finish loading."));
        }
      }, 6000);

      return;
    }

    const script = document.createElement("script");
    script.id = MAP_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Google Maps script."));
    document.body.appendChild(script);
  });

  return window.__nightPulseGoogleMapsPromise;
}
export function LiveMap({ venues, selectedVenueId, onSelectVenue, fallbackCenter }: LiveMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);

  const frameOneRef = useRef<number | null>(null);
  const frameTwoRef = useRef<number | null>(null);
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const markerRecordsRef = useRef<Map<string, MarkerRecord>>(new Map());

  const venuesWithCoords = useMemo(
    () => venues.filter((venue) => Number.isFinite(venue.lat) && Number.isFinite(venue.lng)),
    [venues]
  );

  const selectedVenue = useMemo(
    () => venuesWithCoords.find((venue) => venue.id === selectedVenueId) ?? null,
    [selectedVenueId, venuesWithCoords]
  );

  const mapCenter = useMemo(() => {
    if (selectedVenue) {
      return { lat: selectedVenue.lat, lng: selectedVenue.lng };
    }

    if (venuesWithCoords[0]) {
      return { lat: venuesWithCoords[0].lat, lng: venuesWithCoords[0].lng };
    }

    return fallbackCenter;
  }, [fallbackCenter, selectedVenue, venuesWithCoords]);

  const refreshMapLayout = () => {
    if (!window.google?.maps || !mapRef.current) return;

    const currentZoom = mapRef.current.getZoom() ?? 13;
    const currentCenter = mapRef.current.getCenter()?.toJSON() ?? mapCenter;

    window.google.maps.event.trigger(mapRef.current, "resize");
    mapRef.current.setCenter(currentCenter);
    mapRef.current.setZoom(currentZoom);
  };

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    const element = mapViewportRef.current;
    if (!element || !isClientReady) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width);
        const height = Math.floor(entry.contentRect.height);

        if (width > 0 && height > 0) {
          setContainerSize((previous) => {
            if (previous?.width === width && previous.height === height) {
              return previous;
            }

            return { width, height };
          });
        }
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [isClientReady]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || !isClientReady || !containerSize || !mapViewportRef.current) {
      return;
    }

    let cancelled = false;

    const initializeMap = async () => {
      try {
        await loadGoogleMaps(apiKey);
        if (cancelled || !window.google?.maps || !mapViewportRef.current) return;

        if (!mapRef.current) {
          const renderingType = window.google.maps.RenderingType;

          mapRef.current = new window.google.maps.Map(mapViewportRef.current, {
            center: mapCenter,
            zoom: 13,
            disableDefaultUI: false,
            clickableIcons: false,
            gestureHandling: "greedy",
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            ...(renderingType?.RASTER ? { renderingType: renderingType.RASTER } : {}),
          });

          infoWindowRef.current = new window.google.maps.InfoWindow();
          setIsMapReady(true);
        }

        frameOneRef.current = window.requestAnimationFrame(() => {
          frameTwoRef.current = window.requestAnimationFrame(() => {
            refreshMapLayout();
          });
        });
      } catch (error) {
        console.error("[live-map] failed to initialize Google Maps", error);
      }
    };

    initializeMap();

    return () => {
      cancelled = true;
      if (frameOneRef.current) window.cancelAnimationFrame(frameOneRef.current);
      if (frameTwoRef.current) window.cancelAnimationFrame(frameTwoRef.current);
    };
  }, [containerSize, isClientReady, mapCenter]);

  useEffect(() => {
    if (!window.google?.maps || !mapRef.current || !isMapReady) return;

    const nextIds = new Set(venuesWithCoords.map((venue) => venue.id));

    markerRecordsRef.current.forEach((record, venueId) => {
      if (!nextIds.has(venueId)) {
        if (typeof record.marker.setMap === "function") {
          record.marker.setMap(null);
        } else {
          record.marker.map = null;
        }
        markerRecordsRef.current.delete(venueId);
      }
    });

    const markerApi = window.google.maps.marker;
    const canUseAdvancedMarkers = Boolean(markerApi?.AdvancedMarkerElement && markerApi?.PinElement);

    venuesWithCoords.forEach((venue) => {
      if (markerRecordsRef.current.has(venue.id)) {
        return;
      }

      const classification = classifyVenueType({
        types: venue.sourceVenue.types,
        name: venue.name,
        aiClassification: venue.sourceVenue.aiClassification,
      });
      const venueType = classification.venueType;
      const isSelected = selectedVenueId === venue.id;

      let marker: any;
      let markerNode: HTMLDivElement | undefined;

      if (canUseAdvancedMarkers) {
        markerNode = createVenueMarkerElement(venueType, isSelected);

        marker = new markerApi.AdvancedMarkerElement({
          position: { lat: venue.lat, lng: venue.lng },
          map: mapRef.current,
          title: `${venue.name} (${classification.venueType})`,
          content: markerNode,
          zIndex: isSelected ? 999 : 1,
        });
      } else {
        const markerIcon = createVenueMarkerDataUrl(venueType, isSelected);

        marker = new window.google.maps.Marker({
          position: { lat: venue.lat, lng: venue.lng },
          map: mapRef.current,
          title: `${venue.name} (${classification.venueType})`,
          icon: {
            url: markerIcon.url,
            scaledSize: new window.google.maps.Size(markerIcon.size, markerIcon.size + 8),
            anchor: new window.google.maps.Point(markerIcon.size / 2, markerIcon.size),
          },
          zIndex: isSelected ? 999 : 1,
        });
      }

      marker.addListener("click", () => {
        onSelectVenue(venue.id);
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`<div style=\"color:#111;font-weight:600;\">${venue.name}</div>`);
          infoWindowRef.current.open({ map: mapRef.current, anchor: marker });
        }
      });

      markerRecordsRef.current.set(venue.id, {
        marker,
        node: markerNode,
        venueType,
        confidence: classification.confidence,
        reason: classification.reason,
      });
    });
  }, [isMapReady, onSelectVenue, selectedVenueId, venuesWithCoords]);

  useEffect(() => {
    if (!window.google?.maps || !mapRef.current || !isMapReady) return;

    markerRecordsRef.current.forEach((record, venueId) => {
      const isSelected = venueId === selectedVenueId;

      if (record.node) {
        updateVenueMarkerElement(record.node, record.venueType, isSelected);
        record.marker.zIndex = isSelected ? 999 : 1;
      } else {
        const markerIcon = createVenueMarkerDataUrl(record.venueType, isSelected);
        record.marker.setIcon({
          url: markerIcon.url,
          scaledSize: new window.google.maps.Size(markerIcon.size, markerIcon.size + 8),
          anchor: new window.google.maps.Point(markerIcon.size / 2, markerIcon.size),
        });
        record.marker.setZIndex(isSelected ? 999 : 1);
      }
    });

    if (selectedVenue) {
      mapRef.current.setCenter({ lat: selectedVenue.lat, lng: selectedVenue.lng });
      mapRef.current.setZoom(15);
      return;
    }

    if (venuesWithCoords.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      venuesWithCoords.forEach((venue) => {
        bounds.extend({ lat: venue.lat, lng: venue.lng });
      });
      mapRef.current.fitBounds(bounds, 48);
      return;
    }

    mapRef.current.setCenter(mapCenter);
    mapRef.current.setZoom(14);
  }, [isMapReady, mapCenter, selectedVenue, selectedVenueId, venuesWithCoords]);

  useEffect(() => {
    if (!containerSize) return;

    const timer = window.setTimeout(() => {
      refreshMapLayout();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [containerSize, isExpanded, mapCenter]);

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
          <MapPinned size={14} /> {venuesWithCoords.length} markers
        </span>
        <span>
          DPR: {isClientReady && typeof window !== "undefined" ? window.devicePixelRatio.toFixed(2) : "--"}
        </span>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-0">
        <div
          ref={mapViewportRef}
          className={`w-full overflow-hidden rounded-2xl bg-black ${isExpanded ? "h-[420px]" : "h-[280px] md:h-[320px] lg:h-[400px]"}`}
          style={{ imageRendering: "auto" }}
        />
      </div>

      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <p className="text-xs text-amber-200">Map unavailable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing.</p>
      )}
    </section>
  );
}
