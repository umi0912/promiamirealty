"use client";
import { useEffect, useRef } from "react";
import maplibregl, { Map as MlMap, GeoJSONSource, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouter } from "next/navigation";
import { type Listing, fmtPrice, fmtPriceShort } from "@/lib/data";

// Реальная карта (MapLibre GL) с кластерами, ценами и popup-тултипами — как Zillow/SERHANT.
// Стиль: MapTiler (если задан ключ — Google-подобный вид) иначе CARTO Voyager (бесплатно, без ключа).
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";
const STYLE = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`
  : "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const MIAMI: [number, number] = [-80.19, 25.77];

type Props = { id: string; price: number; priceShort: string; beds: number; baths: number; sqft: number; status: string; photo: string; addr: string };

function toGeoJSON(listings: Listing[]) {
  return {
    type: "FeatureCollection" as const,
    features: listings.filter(l => l.lat && l.lng).map(l => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [l.lng, l.lat] },
      properties: {
        id: l.id, price: l.price, priceShort: fmtPriceShort(l.price),
        beds: l.beds, baths: l.baths, sqft: l.sqft, status: l.status,
        photo: l.photos[0] || "", addr: `${l.address}${l.city ? ", " + l.city : ""}`,
      } as Props,
    })),
  };
}

export default function MapView({ listings }: { listings: Listing[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markers = useRef<Record<string, Marker>>({});
  const markersOnScreen = useRef<Record<string, Marker>>({});
  const popupRef = useRef<Popup | null>(null);
  const router = useRouter();
  const listingsRef = useRef(listings);
  listingsRef.current = listings;

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
        clusterMaxZoom: 16,
      });
      map.addLayer({ id: "_pts", type: "circle", source: "listings", paint: { "circle-radius": 0, "circle-opacity": 0 } });

      const update = () => updateMarkers(map);
      map.on("render", () => { if (map.isSourceLoaded("listings")) update(); });
      map.on("moveend", update);
      fitTo(map, listingsRef.current);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

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

  // popup со списком листингов (1 — одиночный, N — кластер)
  function openPopup(map: MlMap, coords: [number, number], items: Props[]) {
    popupRef.current?.remove();
    const box = document.createElement("div");
    box.style.cssText = "max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;font-family:Manrope,sans-serif;";
    items.forEach(p => box.appendChild(cardRow(p, () => { popupRef.current?.remove(); router.push(`/listings/${p.id}`); })));
    popupRef.current = new maplibregl.Popup({ offset: 18, maxWidth: "300px", closeButton: true })
      .setLngLat(coords).setDOMContent(box).addTo(map);
  }

  function updateMarkers(map: MlMap) {
    const newMarkers: Record<string, Marker> = {};
    const features = map.querySourceFeatures("listings");

    for (const f of features) {
      if (f.geometry.type !== "Point") continue;
      const coords = f.geometry.coordinates as [number, number];
      const props = f.properties || {};
      const isCluster = props.cluster;
      const key = isCluster ? `c${props.cluster_id}` : `p${props.id}`;
      if (newMarkers[key]) continue;

      let marker = markers.current[key];
      if (!marker) {
        const el = isCluster
          ? clusterEl(props.point_count_abbreviated ?? props.point_count, () => {
              const src = map.getSource("listings") as GeoJSONSource;
              src.getClusterLeaves(props.cluster_id, 30, 0)
                .then(leaves => openPopup(map, coords, leaves.map(l => l.properties as Props)))
                .catch(() => {});
            })
          : priceEl(props.priceShort, () => openPopup(map, coords, [props as Props]));
        marker = new maplibregl.Marker({ element: el }).setLngLat(coords);
        markers.current[key] = marker;
      } else {
        marker.setLngLat(coords);
      }
      newMarkers[key] = marker;
      if (!markersOnScreen.current[key]) marker.addTo(map);
    }
    for (const key in markersOnScreen.current) {
      if (!newMarkers[key]) markersOnScreen.current[key].remove();
    }
    markersOnScreen.current = newMarkers;
  }

  return <div ref={containerRef} style={{ width: "100%", height: "100%", borderRadius: 16, overflow: "hidden" }} />;
}

// ---- popup карточка листинга ----
function cardRow(p: Props, onClick: () => void): HTMLElement {
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:10px;padding:8px;border-radius:10px;cursor:pointer;align-items:center;";
  row.addEventListener("mouseenter", () => (row.style.background = "#f3f0f7"));
  row.addEventListener("mouseleave", () => (row.style.background = "transparent"));
  row.addEventListener("click", onClick);

  const img = document.createElement("div");
  img.style.cssText = `width:74px;height:56px;border-radius:8px;flex-shrink:0;background:#ece9f3 center/cover no-repeat;${p.photo ? `background-image:url(${p.photo});` : ""}`;

  const info = document.createElement("div");
  info.style.cssText = "min-width:0;flex:1;";
  const specs = [p.beds ? `${p.beds} bd` : "", p.baths ? `${p.baths} ba` : "", p.sqft ? `${Number(p.sqft).toLocaleString()} sqft` : ""].filter(Boolean).join(" · ");
  info.innerHTML =
    `<div style="font-size:15px;font-weight:700;color:#160d24;font-family:'Space Grotesk',sans-serif;">${fmtPrice(p.price)}</div>` +
    `<div style="font-size:12px;color:#6f6580;margin-top:2px;">${specs}</div>` +
    `<div style="font-size:11px;font-weight:700;letter-spacing:.04em;color:#2e1a4a;margin-top:3px;text-transform:uppercase;">${p.status || "Active"}</div>`;

  row.appendChild(img); row.appendChild(info);
  return row;
}

// ---- маркеры ----
function priceEl(label: string, onClick: () => void): HTMLElement {
  const el = document.createElement("button");
  el.textContent = label;
  el.style.cssText = "cursor:pointer;background:#fff;color:#2e1a4a;font-weight:700;font-size:12px;padding:5px 10px;border-radius:999px;border:1px solid rgba(46,26,74,.25);box-shadow:0 2px 8px rgba(0,0,0,.18);white-space:nowrap;font-family:Manrope,sans-serif;";
  el.addEventListener("click", e => { e.stopPropagation(); onClick(); });
  el.addEventListener("mouseenter", () => { el.style.background = "#2e1a4a"; el.style.color = "#fff"; el.style.zIndex = "10"; });
  el.addEventListener("mouseleave", () => { el.style.background = "#fff"; el.style.color = "#2e1a4a"; });
  return el;
}
function clusterEl(count: string | number, onClick: () => void): HTMLElement {
  const el = document.createElement("button");
  el.textContent = `${count} units`;
  el.style.cssText = "cursor:pointer;background:#2e1a4a;color:#fff;font-weight:700;font-size:12px;padding:6px 12px;border-radius:999px;border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.28);white-space:nowrap;font-family:Manrope,sans-serif;";
  el.addEventListener("click", e => { e.stopPropagation(); onClick(); });
  return el;
}
