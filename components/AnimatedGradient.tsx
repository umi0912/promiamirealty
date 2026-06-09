"use client";

// Лёгкий анимированный sunset-градиент в стиле Stripe (CSS, без WebGL).
// Накладывается фоном на hero-секции, мягко перетекает между цветами палитры.
// Размытые цветовые пятна создают эффект "живого" фона; для скорости — чистый CSS.

export default function AnimatedGradient({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", ...style }}
    >
      {/* базовый перетекающий градиент */}
      <div className="sunset-anim" style={{ position: "absolute", inset: "-30%", filter: "blur(60px)", opacity: 0.45 }} />
      {/* отдельные цветовые пятна для глубины */}
      <div className="glow-pulse" style={{ position: "absolute", top: "-10%", left: "8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,116,44,0.55), transparent 70%)", filter: "blur(40px)" }} />
      <div className="glow-pulse" style={{ position: "absolute", bottom: "-15%", right: "5%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.45), transparent 70%)", filter: "blur(50px)", animationDelay: "2s" }} />
      <div className="glow-pulse" style={{ position: "absolute", top: "30%", right: "30%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,179,71,0.35), transparent 70%)", filter: "blur(45px)", animationDelay: "4s" }} />
    </div>
  );
}
