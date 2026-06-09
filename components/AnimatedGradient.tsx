"use client";

// Лёгкий анимированный sunset-градиент (CSS, без WebGL и без тяжёлых blur-слоёв).
// Один перетекающий слой вместо нескольких размытых пятен — заметно легче для мобильных.

export default function AnimatedGradient({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", ...style }}
    >
      <div
        className="sunset-anim"
        style={{ position: "absolute", inset: "-10%", filter: "blur(30px)", opacity: 0.4 }}
      />
    </div>
  );
}
