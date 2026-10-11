"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

// Composant Sparkline / Courbe de tendance avec dégradé subtil
export interface AreaPoint {
  label: string;
  value: number;
  formatted?: string;
}

export function AreaChartTrend({
  data,
  height = 140,
  strokeColor = "#0070f3",
  fillGradientId = "vercelGradient",
  className,
}: {
  data: AreaPoint[];
  height?: number;
  strokeColor?: string;
  fillGradientId?: string;
  className?: string;
}) {
  const [hoveredPoint, setHoveredPoint] = React.useState<AreaPoint | null>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  if (!data || data.length < 2) return null;

  const width = 600;
  const paddingX = 20;
  const paddingTop = 25;
  const paddingBottom = 25;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const normalizedY = (d.value - minVal) / range;
    const y = height - paddingBottom - normalizedY * (height - paddingTop - paddingBottom);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const fillD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  return (
    <div className={cn("relative w-full overflow-hidden select-none", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="60%" stopColor={strokeColor} stopOpacity={0.05} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Lignes de repère horizontales discrètes Vercel */}
        <line
          x1={paddingX}
          y1={paddingTop}
          x2={width - paddingX}
          y2={paddingTop}
          stroke="rgba(255,255,255,0.05)"
          strokeDasharray="4 4"
        />
        <line
          x1={paddingX}
          y1={(height - paddingTop - paddingBottom) / 2 + paddingTop}
          x2={width - paddingX}
          y2={(height - paddingTop - paddingBottom) / 2 + paddingTop}
          stroke="rgba(255,255,255,0.05)"
          strokeDasharray="4 4"
        />
        <line
          x1={paddingX}
          y1={height - paddingBottom}
          x2={width - paddingX}
          y2={height - paddingBottom}
          stroke="rgba(255,255,255,0.08)"
        />

        {/* Zone remplie */}
        <path d={fillD} fill={`url(#${fillGradientId})`} />

        {/* Ligne principale */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points interactifs */}
        {points.map((pt, i) => (
          <g key={i} className="cursor-pointer">
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoverIndex === i ? 5 : 2.5}
              fill={hoverIndex === i ? "#ffffff" : strokeColor}
              stroke="#0a0a0a"
              strokeWidth="2"
              className="transition-all duration-150"
            />
            <rect
              x={pt.x - 15}
              y={0}
              width={30}
              height={height}
              fill="transparent"
              onMouseEnter={() => {
                setHoveredPoint(pt);
                setHoverIndex(i);
              }}
              onMouseLeave={() => {
                setHoveredPoint(null);
                setHoverIndex(null);
              }}
            />
          </g>
        ))}
      </svg>

      {/* Infobulle de survol (Tooltip Vercel) */}
      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none -top-2 bg-[#0a0a0a] border border-[#333333] rounded-lg px-2.5 py-1 text-[11px] font-mono text-white shadow-xl -translate-x-1/2 transition-transform duration-75"
          style={{
            left: `${points[hoverIndex ?? 0]?.x ? (points[hoverIndex ?? 0].x / width) * 100 : 50}%`,
          }}
        >
          <div className="text-white font-bold">{hoveredPoint.formatted || `${formatNumber(hoveredPoint.value)} FCFA`}</div>
          <div className="text-[#888888] text-[10px]">{hoveredPoint.label}</div>
        </div>
      )}

      {/* Étiquettes de l'axe X */}
      <div className="flex justify-between items-center text-[10px] font-mono text-[#71717a] pt-1 px-1">
        {data.map((d, i) => (
          <span key={i} className={cn(hoverIndex === i && "text-white font-semibold")}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// Composant Jauge de Capacité Silo / Stock de Farine (Style Vercel)
export function FlourSiloGauge({
  name,
  code,
  currentBags,
  maxBags,
  unitWeightKg = 50,
  minAlertThreshold = 10,
  daysAutonomy = 6,
}: {
  name: string;
  code: string;
  currentBags: number;
  maxBags: number;
  unitWeightKg?: number;
  minAlertThreshold?: number;
  daysAutonomy?: number;
}) {
  const percentage = Math.min(100, Math.round((currentBags / maxBags) * 100));
  const isAlert = currentBags <= minAlertThreshold;
  const totalKg = currentBags * unitWeightKg;

  return (
    <div className="p-3.5 rounded-xl border border-[#222222] bg-[#0a0a0a] space-y-2.5 hover:border-[#383838] transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
            <span>{name}</span>
            <span className="text-[10px] font-mono text-[#71717a]">({code})</span>
          </div>
          <div className="text-[11px] font-mono text-[#888888] mt-0.5">
            {currentBags} sacs en réserve · <span className="text-white font-medium">{formatNumber(totalKg)} kg</span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={cn(
              "text-xs font-mono font-bold px-2 py-0.5 rounded border",
              isAlert
                ? "bg-white/[0.08] border-white/20 text-white"
                : "bg-white/[0.04] border-white/10 text-[#ededed]"
            )}
          >
            {percentage}%
          </span>
          <div className="text-[10px] font-mono text-[#71717a] mt-0.5">
            ~{daysAutonomy}j autonomie
          </div>
        </div>
      </div>

      {/* Barre de progression monochrome Vercel */}
      <div className="relative w-full h-1.5 rounded-full bg-[#1c1c1c] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isAlert ? "bg-[#888888]" : "bg-white"
          )}
          style={{ width: `${percentage}%` }}
        />
        {/* Marqueur de seuil d'alerte */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#555555] z-10"
          style={{ left: `${(minAlertThreshold / maxBags) * 100}%` }}
          title={`Seuil d'alerte : ${minAlertThreshold} sacs`}
        />
      </div>
    </div>
  );
}

// Composant Barres Horizontales pour Répartition Ventes (Style Vercel)
export function CategoryDistributionBar({
  items,
}: {
  items: { label: string; percentage: number; amount: string; color: string }[];
}) {
  return (
    <div className="space-y-3">
      {/* Barre segmentée continue */}
      <div className="h-2 w-full rounded-full bg-[#1c1c1c] flex overflow-hidden border border-[#262626]">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="h-full transition-all duration-300"
            style={{ width: `${it.percentage}%`, backgroundColor: it.color }}
            title={`${it.label}: ${it.percentage}% (${it.amount})`}
          />
        ))}
      </div>

      {/* Légende détaillée */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {items.map((it, idx) => (
          <div key={idx} className="p-2 rounded-lg bg-[#0a0a0a] border border-[#222222] space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: it.color }} />
              <span className="text-[#a1a1aa] truncate text-[11px]">{it.label}</span>
            </div>
            <div className="font-mono font-bold text-white text-xs">{it.amount}</div>
            <div className="text-[10px] font-mono text-[#71717a]">{it.percentage}% du total</div>
          </div>
        ))}
      </div>
    </div>
  );
}
