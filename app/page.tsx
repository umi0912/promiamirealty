"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ScopeBar, useScope } from "@/components/dashboard/ScopeBar";
import { resolveScope } from "@/lib/dashboard/scope";
import { LocationKpiCard } from "@/components/dashboard/LocationKpiCard";
import { InfoTooltip } from "@/components/dashboard/InfoTooltip";
import { ArrowUp, ArrowDown, Minus, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import NewCustomerKpiDrawer from "./components/NewCustomerKpiDrawer";
import ClassPassDrawer from "./components/ClassPassDrawer";
import { ClassPassCard } from "@/components/dashboard/ClassPassCard";

export const dynamic = "force-dynamic";

const ORG_ID = "b38a6b50-763a-4c1f-858f-8f7d84083d4a";

export default function DashboardPageWrapper() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--ink-3)] mt-1">Loading…</p>
      </header>
      <div className="text-center text-[var(--ink-4)] py-20 flex items-center justify-center gap-2">
        <Loader2 size={18} className="animate-spin" />
        Loading…
      </div>
    </div>
  );
}

type LocationKpi = {
  location_id: string;
  location_name: string;
  revenue: number;
  gross_sales: number;
  discounts: number;
  refunds: number;
  refunds_count: number;
  gift_card_sales: number;
  training_sales: number;
  net_sales: number;
  gift_cards_sold: number;
  tips: number;
  transactions: number;
  total_bookings: number;
  accepted_bookings: number;
  cancelled_by_customer: number;
  cancelled_by_seller: number;
  no_shows: number;
  cancelled_total: number;
  cancel_pct: number;
  new_clients: number;
  repeat_clients: number;
  avg_check: number;
};

type ApiResponse = {
  ok: boolean;
  current: { byLocation: LocationKpi[]; all: any };
  previous: { byLocation: LocationKpi[]; all: any };
};

type LocationFilter = "all" | "union" | "pacific";

function deltaPct(curr: number, prev: number): number {
  if (!prev || prev === 0) return 0;
  return Math.round(((curr - prev) / prev) * 100 * 10) / 10;
}

function formatMoney(n: number): string {
  const v = Number(n);
  if (!Number.isFinite(v)) return "$0";
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function Delta({ delta, inverted = false }: { delta: number; inverted?: boolean }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-[var(--ink-4)]">
        <Minus size={12} strokeWidth={2.5} />
        0%
      </span>
    );
  }
  const isPositive = inverted ? delta < 0 : delta > 0;
  const color = isPositive ? "var(--pos)" : "var(--neg)";
  const Icon = delta > 0 ? ArrowUp : ArrowDown;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-medium"
      style={{ color }}
    >
      <Icon size={12} strokeWidth={2.5} />
      {Math.abs(delta)}%
    </span>
  );
}

function KpiCard({
  label,
  value,
  delta,
  inverted = false,
  hint,
  tooltip,
  loading = false,
}: {
  label: string;
  value: string;
  delta: number;
  inverted?: boolean;
  hint?: string;
  tooltip?: { label: string; formula?: string; description?: string };
  loading?: boolean;
}) {
  return (
    <div className={`rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 hover:shadow-[var(--shadow-md)] transition-all ${loading ? "opacity-50" : ""}`}>
      <div className="flex items-center text-xs uppercase tracking-wider text-[var(--ink-4)] font-medium mb-2">
        <span>{label}</span>
        {tooltip && (
          <InfoTooltip
            label={tooltip.label}
            formula={tooltip.formula}
            description={tooltip.description}
          />
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <div className="font-display text-3xl tracking-tight">{value}</div>
        <Delta delta={delta} inverted={inverted} />
      </div>
      {hint && <div className="text-xs text-[var(--ink-3)]">{hint}</div>}
    </div>
  );
}

function DashboardPage() {
  const { period, compare } = useScope();
  const resolved = useMemo(() => resolveScope(period, compare), [period, compare]);

  const sp = useSearchParams();
  const locationParam = (sp.get("location") as LocationFilter | null) ?? "all";

  const [data, setData] = useState<ApiResponse | null>(null);
  const [yoyData, setYoyData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ncDrawerOpen, setNcDrawerOpen] = useState(false);
  const [cpDrawerOpen, setCpDrawerOpen] = useState(false);
  const [cpSummary, setCpSummary] = useState<{
    clients: number; visits: number; cpVisitRevenue: number;
    totalLtv: number; converted: number; conversionPct: number;
  } | null>(null);
  const [segments, setSegments] = useState<{
    new: number; reactivated: number; returning: number; total: number; squareNew: number;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let url: string;
    if (resolved.granularity === "daily" && resolved.date && resolved.compareDate) {
      url = `/api/dashboard/daily-kpi?organizationId=${ORG_ID}&date=${resolved.date}&compareDate=${resolved.compareDate}`;
    } else if (resolved.granularity === "monthly" && resolved.monthStartDate && resolved.monthEndDate) {
      const cs = resolved.compareStartDate ? "&compareStartDate=" + resolved.compareStartDate : "";
      const ce = resolved.compareEndDate ? "&compareEndDate=" + resolved.compareEndDate : "";
      url = `/api/dashboard/range-kpi?organizationId=${ORG_ID}&startDate=${resolved.monthStartDate}&endDate=${resolved.monthEndDate}` + cs + ce;
    } else if (resolved.startDate && resolved.endDate) {
      const cs = resolved.compareStartDate ? "&compareStartDate=" + resolved.compareStartDate : "";
      const ce = resolved.compareEndDate ? "&compareEndDate=" + resolved.compareEndDate : "";
      url = `/api/dashboard/range-kpi?organizationId=${ORG_ID}&startDate=${resolved.startDate}&endDate=${resolved.endDate}` + cs + ce;
    } else {
      setError("Invalid scope");
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();

    fetch(url, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setData(json);
        else setError(json.details || "Failed to load");
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e));
      })
      .finally(() => setLoading(false));

    // Client segments (single source of truth for new/reactivated/returning)
    {
      const segStart = resolved.date ?? resolved.monthStartDate ?? resolved.startDate;
      const segEnd = resolved.date ?? resolved.monthEndDate ?? resolved.endDate;
      if (segStart && segEnd) {
        setSegments(null);
        fetch(
          `/api/dashboard/client-segments?organizationId=${ORG_ID}&start=${segStart}&end=${segEnd}&location=${locationParam}`,
          { signal: ctrl.signal }
        )
          .then((r) => r.json())
          .then((j) => { if (j.segments) setSegments({ ...j.segments, squareNew: j.squareNew }); })
          .catch(() => setSegments(null));
      }
    }

    // ClassPass channel summary
    {
      const cpStart = resolved.date ?? resolved.monthStartDate ?? resolved.startDate;
      const cpEnd = resolved.date ?? resolved.monthEndDate ?? resolved.endDate;
      if (cpStart && cpEnd) {
        setCpSummary(null);
        fetch(
          `/api/dashboard/classpass?organizationId=${ORG_ID}&start=${cpStart}&end=${cpEnd}&location=${locationParam}`,
          { signal: ctrl.signal }
        )
          .then((r) => r.json())
          .then((j) => { if (j.summary) setCpSummary(j.summary); })
          .catch(() => setCpSummary(null));
      }
    }

    setYoyData(null);
    if (resolved.granularity === "weekly" && resolved.weekStart) {
      const yoyDate = new Date(resolved.weekStart);
      yoyDate.setFullYear(yoyDate.getFullYear() - 1);
      const dow = yoyDate.getDay() === 0 ? 7 : yoyDate.getDay();
      yoyDate.setDate(yoyDate.getDate() - (dow - 1));
      const yoyWeekStart = `${yoyDate.getFullYear()}-${String(yoyDate.getMonth() + 1).padStart(2, "0")}-${String(yoyDate.getDate()).padStart(2, "0")}`;

      const yoyCompare = new Date(yoyDate);
      yoyCompare.setDate(yoyCompare.getDate() - 7);
      const yoyCompareStr = `${yoyCompare.getFullYear()}-${String(yoyCompare.getMonth() + 1).padStart(2, "0")}-${String(yoyCompare.getDate()).padStart(2, "0")}`;

      const yoyEnd = new Date(yoyDate);
      yoyEnd.setDate(yoyEnd.getDate() + 6);
      const yoyEndStr = `${yoyEnd.getFullYear()}-${String(yoyEnd.getMonth() + 1).padStart(2, "0")}-${String(yoyEnd.getDate()).padStart(2, "0")}`;
      const yoyCompareEnd = new Date(yoyCompare);
      yoyCompareEnd.setDate(yoyCompareEnd.getDate() + 6);
      const yoyCompareEndStr = `${yoyCompareEnd.getFullYear()}-${String(yoyCompareEnd.getMonth() + 1).padStart(2, "0")}-${String(yoyCompareEnd.getDate()).padStart(2, "0")}`;

      if (yoyWeekStart !== resolved.weekStart && yoyWeekStart !== resolved.compareWeekStart) {
        fetch(
          `/api/dashboard/range-kpi?organizationId=${ORG_ID}&startDate=${yoyWeekStart}&endDate=${yoyEndStr}&compareStartDate=${yoyCompareStr}&compareEndDate=${yoyCompareEndStr}`,
          { signal: ctrl.signal }
        )
          .then((r) => r.json())
          .then((json) => {
            if (json.ok) setYoyData(json);
          })
          .catch(() => setYoyData(null));
      }
    }

    return () => ctrl.abort();
  }, [resolved.granularity, resolved.date, resolved.compareDate, resolved.weekStart, resolved.compareWeekStart, resolved.monthStartDate, resolved.monthEndDate, locationParam]);

  const LoadingBar = loading ? (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-[var(--accent)] z-50 animate-pulse" />
  ) : null;

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {LoadingBar}
        <Header resolved={resolved} locationParam={locationParam} loading={loading} />
        <ScopeBar />
        {error ? (
          <div className="text-center text-[var(--neg)] py-20">Error: {error}</div>
        ) : (
          <div className="text-center text-[var(--ink-4)] py-20 flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Loading…
          </div>
        )}
      </div>
    );
  }

  const filterByLocation = (rows: LocationKpi[]) => {
    if (locationParam === "all") return rows;
    if (locationParam === "union") return rows.filter((r) => r.location_name.includes("Union"));
    return rows.filter((r) => r.location_name.includes("Pacific"));
  };

  const currLocations = filterByLocation(data.current.byLocation);
  const prevLocations = filterByLocation(data.previous.byLocation);
  const yoyLocations = yoyData ? filterByLocation(yoyData.current.byLocation) : [];

  const aggregate = (rows: LocationKpi[]) => {
    const all = rows.reduce(
      (acc, r) => ({
        revenue: acc.revenue + r.revenue,
        gross_sales: acc.gross_sales + r.gross_sales,
        discounts: acc.discounts + r.discounts,
        refunds: acc.refunds + r.refunds,
        gift_card_sales: acc.gift_card_sales + r.gift_card_sales,
        training_sales: acc.training_sales + r.training_sales,
        net_sales: acc.net_sales + r.net_sales,
        tips: acc.tips + r.tips,
        transactions: acc.transactions + r.transactions,
        total_bookings: acc.total_bookings + r.total_bookings,
        accepted_bookings: acc.accepted_bookings + r.accepted_bookings,
        cancelled_by_customer: acc.cancelled_by_customer + r.cancelled_by_customer,
        cancelled_by_seller: acc.cancelled_by_seller + r.cancelled_by_seller,
        no_shows: acc.no_shows + r.no_shows,
        new_clients: acc.new_clients + r.new_clients,
        repeat_clients: acc.repeat_clients + r.repeat_clients,
      }),
      {
        revenue: 0, gross_sales: 0, discounts: 0, refunds: 0,
        training_sales: 0, net_sales: 0,
        gift_card_sales: 0, tips: 0, transactions: 0,
        total_bookings: 0, accepted_bookings: 0,
        cancelled_by_customer: 0, cancelled_by_seller: 0, no_shows: 0,
        new_clients: 0, repeat_clients: 0,
      }
    );
    return {
      ...all,
      cancelled_all: all.cancelled_by_customer + all.cancelled_by_seller + all.no_shows,
    };
  };

  const curr = aggregate(currLocations);
  const prev = aggregate(prevLocations);
  const yoy = yoyLocations.length > 0 ? aggregate(yoyLocations) : null;

  if (curr.transactions === 0 && curr.total_bookings === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {LoadingBar}
        <Header resolved={resolved} locationParam={locationParam} loading={loading} />
        <ScopeBar />
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-12 text-center">
          <div className="text-[var(--ink-3)] text-base font-medium mb-2">
            No data for this period
          </div>
          <div className="text-sm text-[var(--ink-4)] max-w-md mx-auto">
            No completed bookings or transactions yet for {resolved.label}
            {locationParam !== "all" && ` at ${locationParam === "union" ? "Union St" : "Pacific Ave"}`}.
          </div>
        </div>
      </div>
    );
  }

  const unionCurr = data.current.byLocation.find((l) => l.location_name.includes("Union"));
  const pacificCurr = data.current.byLocation.find((l) => l.location_name.includes("Pacific"));
  const unionPrev = data.previous.byLocation.find((l) => l.location_name.includes("Union"));
  const pacificPrev = data.previous.byLocation.find((l) => l.location_name.includes("Pacific"));

  const avgTicket = curr.transactions > 0 ? curr.revenue / curr.transactions : 0;
  const avgTicketPrev = prev.transactions > 0 ? prev.revenue / prev.transactions : 0;

  const repeatRate =
    curr.new_clients + curr.repeat_clients > 0
      ? (curr.repeat_clients / (curr.new_clients + curr.repeat_clients)) * 100
      : 0;
  const repeatRatePrev =
    prev.new_clients + prev.repeat_clients > 0
      ? (prev.repeat_clients / (prev.new_clients + prev.repeat_clients)) * 100
      : 0;

  const periodWord = resolved.granularity === "daily" ? "day" : resolved.granularity === "monthly" ? "month" : "week";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {LoadingBar}
      <Header resolved={resolved} locationParam={locationParam} loading={loading} />

      <ScopeBar />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          loading={loading}
          label="Revenue"
          value={formatMoney(curr.revenue)}
          delta={deltaPct(curr.revenue, prev.revenue)}
          hint={`vs prev ${periodWord}`}
          tooltip={{
            label: "Revenue (Net Sales)",
            formula: "SUM(items) − discounts − refunds",
            description: "Money collected from completed services. Matches Square Net Sales ~99%. Tips, taxes, and gift card sales excluded.",
          }}
        />
        <KpiCard
          loading={loading}
          label="Booked"
          value={String(curr.accepted_bookings)}
          delta={deltaPct(curr.accepted_bookings, prev.accepted_bookings)}
          hint={`${curr.cancelled_all} cancelled${curr.total_bookings > 0 ? ` (${((curr.cancelled_all / curr.total_bookings) * 100).toFixed(0)}% of total)` : ""}`}
          tooltip={{
            label: "Booked appointments (ACCEPTED status)",
            formula: "Bookings with status = ACCEPTED",
            description: "Confirmed appointments held in the period. Matches Square calendar's booked count.",
          }}
        />
        <div onClick={() => setNcDrawerOpen(true)} style={{ cursor: "pointer" }}>
          <KpiCard
            loading={loading}
            label="New Customers"
            value={String(segments?.squareNew ?? curr.new_clients)}
            delta={deltaPct(curr.new_clients, prev.new_clients)}
            hint={segments ? `${segments.new} new · ${segments.reactivated} reactivated` : `vs prev ${periodWord}`}
            tooltip={{
              label: "New customers",
              formula: "First visit in last 12 months (Square-compatible)",
              description: "New clients (first visit ever) plus reactivated clients (returned after a 12-month gap). Matches Square's Client Retention report. Click to see the breakdown.",
            }}
          />
        </div>
        <KpiCard
          loading={loading}
          label="Avg Ticket"
          value={`$${avgTicket.toFixed(0)}`}
          delta={deltaPct(avgTicket, avgTicketPrev)}
          hint="per transaction"
          tooltip={{
            label: "Average ticket",
            formula: "Revenue ÷ Transactions",
            description: "Average revenue per ORDER (transaction). One order may include multiple services. Matches Square Avg Sale.",
          }}
        />
        <KpiCard
          loading={loading}
          label="Cancelled"
          value={String(curr.cancelled_all)}
          delta={deltaPct(curr.cancelled_all, prev.cancelled_by_customer + prev.cancelled_by_seller + prev.no_shows)}
          inverted
          hint={`${curr.cancelled_by_customer} customer · ${curr.cancelled_by_seller} salon`}
          tooltip={{
            label: "Cancellations (all types)",
            formula: "Customer + Salon + No-show",
            description: `Breakdown: ${curr.cancelled_by_customer} by customer · ${curr.cancelled_by_seller} by salon · ${curr.no_shows} no-shows.`,
          }}
        />
        <KpiCard
          loading={loading}
          label="Repeat Rate"
          value={`${repeatRate.toFixed(0)}%`}
          delta={Math.round((repeatRate - repeatRatePrev) * 10) / 10}
          hint="returning visits"
          tooltip={{
            label: "Repeat rate",
            formula: "Returning customers ÷ (Returning + New)",
            description: "% of bookings made by customers who have visited before.",
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <HeroRevenue
          revenue={curr.revenue}
          training={curr.training_sales}
          netSales={curr.net_sales}
          revenuePrev={prev.revenue}
          tips={curr.tips}
          gross={curr.gross_sales}
          discounts={curr.discounts}
          isPartial={resolved.isPartialWeek}
          granularity={resolved.granularity}
          compareLabel={resolved.compareLabel}
          period={period}
        />
        <PaceCard
          current={curr.revenue}
          previous={prev.revenue}
          prevYear={yoy?.revenue}
          periodWord={periodWord}
          compareLabel={resolved.compareLabel}
          granularity={resolved.granularity}
        />
      </div>

      {locationParam === "all" && (
        <div>
          <h2 className="font-display text-lg tracking-tight mb-3">By location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unionCurr && <LocationKpiCard current={unionCurr} previous={unionPrev} shortName="Union St" />}
            {pacificCurr && <LocationKpiCard current={pacificCurr} previous={pacificPrev} shortName="Pacific Ave" />}
          </div>
        </div>
      )}

      <ClassPassCard summary={cpSummary} onOpen={() => setCpDrawerOpen(true)} />

      <div className="text-xs text-[var(--ink-4)] text-center pt-4">
        Source: Square orders · Revenue = ITEM line items (matches Square Net Sales ~99%) ·
        Deposits & prepayments excluded — counted when service is delivered.
      </div>

      <NewCustomerKpiDrawer
        open={ncDrawerOpen}
        onClose={() => setNcDrawerOpen(false)}
        organizationId={ORG_ID}
        start={resolved.startDate ?? resolved.date ?? resolved.monthStartDate ?? ""}
        end={resolved.endDate ?? resolved.date ?? resolved.monthEndDate ?? ""}
        location="all"
      />

      <ClassPassDrawer
        open={cpDrawerOpen}
        onClose={() => setCpDrawerOpen(false)}
        organizationId={ORG_ID}
        start={resolved.date ?? resolved.monthStartDate ?? resolved.startDate ?? ""}
        end={resolved.date ?? resolved.monthEndDate ?? resolved.endDate ?? ""}
        location={locationParam}
      />
    </div>
  );
}

function Header({
  resolved,
  locationParam,
  loading,
}: {
  resolved: ReturnType<typeof resolveScope>;
  locationParam: LocationFilter;
  loading?: boolean;
}) {
  const locLabel =
    locationParam === "union" ? " · Union St" :
    locationParam === "pacific" ? " · Pacific Ave" : "";
  return (
    <header>
      <h1 className="font-display text-3xl tracking-tight flex items-center gap-3">
        Dashboard{locLabel}
        {loading && <Loader2 size={18} className="animate-spin text-[var(--ink-4)]" />}
      </h1>
      <p className="text-sm text-[var(--ink-3)] mt-1">
        {resolved.label}
        {resolved.isPartialWeek && (
          <span className="ml-2 inline-block px-2 py-0.5 text-[10px] rounded bg-amber-50 text-amber-700 font-medium uppercase tracking-wider">
            partial week
          </span>
        )}{" "}
        · {resolved.compareLabel}
      </p>
    </header>
  );
}

function HeroRevenue({
  revenue,
  training,
  netSales,
  revenuePrev,
  tips,
  gross,
  discounts,
  isPartial,
  granularity,
  compareLabel,
  period,
}: {
  revenue: number;
  training: number;
  netSales: number;
  revenuePrev: number;
  tips: number;
  gross: number;
  discounts: number;
  isPartial?: boolean;
  granularity?: "daily" | "weekly" | "monthly";
  compareLabel?: string;
  period?: string;
}) {
  const delta = deltaPct(revenue, revenuePrev);
  const isUp = delta > 0;
  const Icon = isUp ? ArrowUp : ArrowDown;
  const color = isUp ? "var(--pos)" : "var(--neg)";

  let periodLabel: string;
  if (granularity === "daily") {
    periodLabel = period === "today" ? "today" : period === "yesterday" ? "yesterday" : "selected day";
  } else if (period === "this_week") {
    periodLabel = isPartial ? "so far this week" : "this week";
  } else if (period === "last_week") {
    periodLabel = "last week";
  } else if (granularity === "monthly") {
    periodLabel = isPartial ? "so far this month" : "this month";
  } else {
    periodLabel = "this week";
  }

  return (
    <div className="lg:col-span-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
      <div className="text-xs uppercase tracking-wider text-[var(--ink-4)] font-medium mb-2">
        Net Sales · {periodLabel}
      </div>
      <div className="flex items-baseline gap-3 mb-1">
        <div className="font-display text-5xl tracking-tight">
          {formatMoney(netSales)}
        </div>
        <div className="flex items-center gap-0.5 text-sm font-medium" style={{ color }}>
          <Icon size={14} strokeWidth={2.5} />
          <span>{Math.abs(delta)}%</span>
        </div>
      </div>
      <div className="text-xs text-[var(--ink-4)] mb-4">
        {compareLabel} ({formatMoney(revenuePrev)})
      </div>
      {training > 0 && (
        <div className="text-xs text-[var(--ink-3)] mb-4">
          services {formatMoney(revenue)} · training {formatMoney(training)}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--line)]">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--ink-4)] mb-1">Gross</div>
          <div className="font-mono text-sm">{formatMoney(gross)}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--ink-4)] mb-1">Tips</div>
          <div className="font-mono text-sm">{formatMoney(tips)}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--ink-4)] mb-1">Discounts</div>
          <div className="font-mono text-sm text-[var(--ink-3)]">-{formatMoney(discounts)}</div>
        </div>
      </div>
    </div>
  );
}

function PaceCard({
  current,
  previous,
  prevYear,
  periodWord,
  compareLabel,
  granularity,
}: {
  current: number;
  previous: number;
  prevYear?: number;
  periodWord: string;
  compareLabel?: string;
  granularity?: "daily" | "weekly" | "monthly";
}) {
  const wowPct = deltaPct(current, previous);
  const yoyPct = prevYear !== undefined && prevYear > 0 ? deltaPct(current, prevYear) : null;

  const wowDown = wowPct < 0;
  const WowIcon = wowDown ? TrendingDown : TrendingUp;
  const wowColor = wowDown ? "var(--neg)" : "var(--pos)";
  const pctFill = previous > 0 ? Math.min(100, (current / previous) * 100) : 0;

  const cleanCompareLabel = compareLabel?.replace(/^vs\s+/i, "") ?? `prev ${periodWord}`;

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="text-xs uppercase tracking-wider text-[var(--ink-4)] font-medium mb-3">
        Pace
      </div>

      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm text-[var(--ink-3)]">vs {cleanCompareLabel}</span>
          <span className="flex items-center gap-1 text-sm font-medium" style={{ color: wowColor }}>
            <WowIcon size={14} strokeWidth={2.5} />
            {Math.abs(wowPct)}%
          </span>
        </div>
        <div className="font-mono text-xs text-[var(--ink-4)] mb-1 flex justify-between">
          <span>${current.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          <span>target ${previous.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pctFill}%`,
              background: wowDown ? "var(--neg)" : "var(--pos)",
              opacity: 0.7,
            }}
          />
        </div>
      </div>

      {granularity === "weekly" && yoyPct !== null && prevYear !== undefined && prevYear > 0 && (
        <div className="mt-4 pt-3 border-t border-[var(--line)]">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm text-[var(--ink-3)]">vs same week last year</span>
            <span
              className="flex items-center gap-1 text-sm font-medium"
              style={{ color: yoyPct < 0 ? "var(--neg)" : "var(--pos)" }}
            >
              {yoyPct < 0 ? <TrendingDown size={14} strokeWidth={2.5} /> : <TrendingUp size={14} strokeWidth={2.5} />}
              {Math.abs(yoyPct)}%
            </span>
          </div>
          <div className="font-mono text-xs text-[var(--ink-4)]">
            last year: ${prevYear.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      )}

      {granularity === "daily" && !compareLabel?.toLowerCase().includes("last year") && (
        <div className="mt-4 pt-3 border-t border-[var(--line)] text-xs text-[var(--ink-4)]">
          Select "vs same day last year" for YoY comparison
        </div>
      )}
    </div>
  );
}
