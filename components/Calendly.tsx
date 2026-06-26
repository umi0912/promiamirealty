"use client";
import { AGENT } from "@/lib/data";

export default function Calendly() {
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", overflow: "hidden" }}>
      <iframe src={`${AGENT.calendly}?embed_domain=promiamirealty.com&embed_type=Inline&hide_gdpr_banner=1&background_color=2C5A50&text_color=F2EFE6&primary_color=7FB3A7`} width="100%" height="640" frameBorder="0" title="Book a consultation" style={{ display: "block" }} />
    </div>
  );
}
