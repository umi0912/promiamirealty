"use client";
import { AGENT } from "@/lib/data";

export default function Calendly() {
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", overflow: "hidden" }}>
      <iframe src={`${AGENT.calendly}?hide_gdpr_banner=1&background_color=14100C&text_color=F5EFE9&primary_color=D85A30`} width="100%" height="640" frameBorder="0" title="Book a consultation" style={{ display: "block" }} />
    </div>
  );
}
