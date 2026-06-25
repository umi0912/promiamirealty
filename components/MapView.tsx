"use client";
import { useEffect, useRef } from "react";
import maplibregl, { Map as MlMap, GeoJSONSource, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouter } from "next/navigation";
import { type Listing, fmtPriceShort } from "@/lib/data";

// Реальная карта (MapLibre GL) с кластерами и ценами — как на SERHANT/Zillow.
// Тайлы CARTO Voyager — бесплатно, без токена. HTML-маркеры для полного контроля над pill-стилем.
const STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const MIAMI: [number, number] = [-80.19, 25.77];

function toGeoJSON(listings: Listing[]) {
  return {
    type: "FeatureCollection" as const,
    features: listings
      .filter(l => l.lat && l.lng)
      .map(l => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [l.lng, l.lat] },
        properties: { id: l.id, price: l.price, priceShort: fmtPriceShort(l.price) },
      })),
  };
}

export default function MapView({ listings }: { listings: Listing[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markers = useRef<Record<string, Marker>>({});
  const markersOnScreen = useRef<Record<string, Marker>>({});
  const router = useRouter();
  const listingsRef = useRef(listings);
  listingsRef.current = listings;

  // инициализация карты один раз
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      center: MIAMI,
      zoom: 9,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");

    map.on("load", () => {
      map.addSource("listings", {
        type: "geojson",
        data: toGeoJSON(listingsRef.current),
        cluster: true,
        clusterRadius: 60,
        clusterMaxZoom: 15,
      });
      // невидимый слой — нужен, чтобы querySourceFeatures работал
      map.addLayer({ id: "_pts", type: "circle", source: "listings", paint: { "circle-radius": 0, "circle-opacity": 0 } });

      const update = () => updateMarkers(map);
      map.on("render", () => { if (map.isSourceLoaded("listings")) update(); });
      map.on("moveend", update);
      fitTo(map, listingsRef.current);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // данные обновились → пере-данные + fitBounds
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("listings") as GeoJSONSource | undefined;
    if (src) { src.setData(toGeoJSON(listings)); fitTo(map, listings); }
  }, [listings]);

  function fitTo(map: MlMap, ls: Listing[]) {
    const pts = ls.filter(l => l.lat && l.lng);
    if (pts.length === 0) return;
    if (pts.length === 1) { map.easeTo({ center: [pts[0].lng, pts[0].lat], zoom: 13 }); return; }
    const b = new maplibregl.LngLatBounds();
    pts.forEach(l => b.extend([l.lng, l.lat]));
    map.fitBounds(b, { padding: 60, maxZoom: 14, duration: 500 });
  }

  // создание/обновление HTML-маркеров (кластеры + одиночные)
  function updateMarkers(map: MlMap) {
    const newMarkers: Record<string, Marker> = {};
    const features = map.querySourceFeatures("listings");

    for (const f of features) {
      const geom = f.geometry;
      if (geom.type !== "Point") continue;
      const coords = geom.coordinates as [number, number];
      const props = f.properties || {};
      const isCluster = props.cluster;
      const key = isCluster ? `c${props.cluster_id}` : `p${props.id}`;
      if (newMarkers[key]) continue;

      let marker = markers.current[key];
      if (!marker) {
        const el = isCluster
          ? clusterEl(props.point_count_abbreviated ?? props.point_count, () => {
              const src = map.getSource("listings") as GeoJSONSource;
              src.getClusterExpansionZoom(props.cluster_id).then(z => map.easeTo({ center: coords, zoom: z })).catch(() => {});
            })
          : priceEl(props.priceShort, () => router.push(`/listings/${props.id}`));
        marker = new maplibregl.Marker({ element: el }).setLngLat(coords);
        markers.current[key] = marker;
      } else {
        marker.setLngLat(coords);
      }
      newMarkers[key] = marker;
      if (!markersOnScreen.current[key]) marker.addTo(map);
    }
    // убрать ушедшие с экрана
    for (const key in markersOnScreen.current) {
      if (!newMarkers[key]) markersOnScreen.current[key].remove();
    }
    markersOnScreen.current = newMarkers;
  }

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", borderRadius: 16, overflow: "hidden" }} />
  );
}

// ---- HTML маркеры ----
function priceEl(label: string, onClick: () => void): HTMLElement {
  const el = document.createElement("button");
  el.textContent = label;
  el.style.cssText =
    "cursor:pointer;background:#fff;color:#2e1a4a;font-weight:700;font-size:12px;padding:5px 10px;border-radius:999px;border:1px solid rgba(46,26,74,.25);box-shadow:0 2px 8px rgba(0,0,0,.18);white-space:nowrap;font-family:Manrope,sans-serif;";
  el.addEventListener("click", e => { e.stopPropagation(); onClick(); });
  el.addEventListener("mouseenter", () => { el.style.background = "#2e1a4a"; el.style.color = "#fff"; el.style.zIndex = "10"; });
  el.addEventListener("mouseleave", () => { el.style.background = "#fff"; el.style.color = "#2e1a4a"; });
  return el;
}
function clusterEl(count: string | number, onClick: () => void): HTMLElement {
  const el = document.createElement("button");
  el.textContent = `${count} units`;
  el.style.cssText =
    "cursor:pointer;background:#2e1a4a;color:#fff;font-weight:700;font-size:12px;padding:6px 12px;border-radius:999px;border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.28);white-space:nowrap;font-family:Manrope,sans-serif;";
  el.addEventListener("click", e => { e.stopPropagation(); onClick(); });
  return el;
}
