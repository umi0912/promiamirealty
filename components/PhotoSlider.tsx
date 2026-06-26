"use client";
import { useState } from "react";

// Переиспользуемый фото-слайдер на карточке: стрелки (на hover) + точки, листание без перехода.
// Используется в каруселях/гридах листингов (investors, buyers, city, similar).
export default function PhotoSlider({
  photos,
  radius = 12,
  height,
  aspectRatio,
  children,
}: {
  photos: string[];
  radius?: number;
  height?: number | string;
  aspectRatio?: string;
  children?: React.ReactNode; // бейджи поверх (статус и т.п.)
}) {
  const pics = (photos && photos.length ? photos : [""]).slice(0, 10);
  const [pi, setPi] = useState(0);
  const nav = (e: React.MouseEvent, d: number) => {
    e.preventDefault(); e.stopPropagation();
    setPi(p => (p + d + pics.length) % pics.length);
  };
  return (
    <div className="psbox" style={{ position: "relative", width: "100%", height, aspectRatio, borderRadius: radius, overflow: "hidden", background: "var(--surface-2)" }}>
      <div className="scard-img" style={{ position: "absolute", inset: 0, backgroundImage: `url("${pics[pi]}")`, backgroundSize: "cover", backgroundPosition: "center", transition: "transform .5s cubic-bezier(.2,.7,.2,1)" }} />
      {children}
      {pics.length > 1 && (
        <>
          <button className="scard-arrow scard-prev" onClick={e => nav(e, -1)} aria-label="Previous photo">‹</button>
          <button className="scard-arrow scard-next" onClick={e => nav(e, 1)} aria-label="Next photo">›</button>
          <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5, zIndex: 2 }}>
            {pics.map((_, i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === pi ? "#fff" : "rgba(255,255,255,.5)", boxShadow: "0 1px 2px rgba(0,0,0,.4)" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
