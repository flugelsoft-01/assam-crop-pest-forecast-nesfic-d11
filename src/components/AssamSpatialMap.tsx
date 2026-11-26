import React from 'react';
import { AgriculturalBlock, PestForecast } from '../types';
import { Layers, Plane, Satellite } from 'lucide-react';

interface AssamSpatialMapProps {
  blocks: AgriculturalBlock[];
  forecasts: Record<string, PestForecast>;
  selectedBlockId: string;
  onSelectBlock: (id: string) => void;
}

function getRiskColor(score: number): string {
  if (score >= 75) return '#ef4444';
  if (score >= 55) return '#f97316';
  if (score >= 35) return '#eab308';
  return '#10b981';
}

function getHeatCellColor(val: number): string {
  if (val >= 0.7) return 'bg-red-500/90 border-red-300/40';
  if (val >= 0.45) return 'bg-orange-500/80 border-orange-300/30';
  if (val >= 0.25) return 'bg-amber-400/70 border-amber-200/20';
  return 'bg-emerald-600/50 border-emerald-400/20';
}

export const AssamSpatialMap: React.FC<AssamSpatialMapProps> = ({
  blocks,
  forecasts,
  selectedBlockId,
  onSelectBlock,
}) => {
  const selected = blocks.find((b) => b.id === selectedBlockId) ?? blocks[0];
  const selectedForecast = forecasts[selected.id];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left: Assam Brahmaputra & Hill Zone Geo-Spatial Block Map */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Assam Multi-Block Geospatial Risk Map (Sentinel-2 + ASSAC GIS)
            </h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Click block to inspect
          </span>
        </div>

        <div className="relative flex-1 min-h-[260px] bg-slate-950/80 border border-slate-800/80 rounded-lg overflow-hidden">
          <svg viewBox="0 0 100 85" className="w-full h-full">
            {/* Subtle grid */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.08)"
                  strokeWidth="0.3"
                />
              </pattern>
            </defs>
            <rect width="100" height="85" fill="url(#grid)" />

            {/* Stylized Assam boundary & Brahmaputra river corridor */}
            <path
              d="M 8 44 Q 25 36, 48 38 T 88 22 L 94 28 Q 78 46, 66 56 L 62 72 L 45 64 L 22 68 L 10 56 Z"
              fill="rgba(16, 185, 129, 0.06)"
              stroke="rgba(16, 185, 129, 0.35)"
              strokeWidth="0.6"
            />
            <path
              d="M 10 49 Q 35 45, 58 40 T 90 25"
              fill="none"
              stroke="rgba(56, 189, 248, 0.35)"
              strokeWidth="1.2"
              strokeDasharray="2 1"
            />
            <text x="41" y="44" fontSize="2.4" fill="rgba(56, 189, 248, 0.65)">
              Brahmaputra River Basin
            </text>

            {/* Block Nodes */}
            {blocks.map((block) => {
              const fc = forecasts[block.id];
              const isSelected = block.id === selected.id;
              const color = getRiskColor(fc.riskScore);
              return (
                <g
                  key={block.id}
                  onClick={() => onSelectBlock(block.id)}
                  className="cursor-pointer"
                >
                  {fc.riskScore >= 55 && (
                    <circle
                      cx={block.mapX}
                      cy={block.mapY}
                      r={isSelected ? 6.5 : 5}
                      fill={color}
                      opacity={0.18}
                    />
                  )}
                  <circle
                    cx={block.mapX}
                    cy={block.mapY}
                    r={isSelected ? 3.2 : 2.3}
                    fill={color}
                    stroke={isSelected ? '#ffffff' : '#0f172a'}
                    strokeWidth={isSelected ? 0.9 : 0.5}
                  />
                  <text
                    x={block.mapX}
                    y={block.mapY - 4.2}
                    textAnchor="middle"
                    fontSize="2.7"
                    fontWeight={isSelected ? '700' : '500'}
                    fill={isSelected ? '#f8fafc' : '#cbd5e1'}
                  >
                    {block.blockName} ({fc.riskScore}%)
                  </text>
                  <text
                    x={block.mapX}
                    y={block.mapY + 5.6}
                    textAnchor="middle"
                    fontSize="2.1"
                    fill="#94a3b8"
                  >
                    {block.crop.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-slate-900/90 border border-slate-800 text-[11px]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Critical (≥75)
              </span>
              <span className="flex items-center gap-1 text-orange-400">
                <span className="w-2 h-2 rounded-full bg-orange-500" /> High (55–74)
              </span>
              <span className="flex items-center gap-1 text-yellow-400">
                <span className="w-2 h-2 rounded-full bg-yellow-500" /> Moderate (35–54)
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low (&lt;35)
              </span>
            </div>
            <span className="text-slate-400">
              Selected: <strong className="text-slate-200">{selected.district}</strong> ({selected.lat.toFixed(3)}°N, {selected.lng.toFixed(3)}°E)
            </span>
          </div>
        </div>
      </div>

      {/* Right: UAV High-Res Orthomosaic Stress Patch Grid */}
      <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              UAV Canopy Stress Orthomosaic ({selected.uav.gsdCm} cm/px)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">{selected.uav.lastFlightDate}</span>
        </div>

        <div className="grid grid-cols-8 gap-1 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
          {selected.uav.mosaicGrid.flatMap((row, rIdx) =>
            row.map((val, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                title={`Patch [${rIdx + 1},${cIdx + 1}] Stress: ${Math.round(val * 100)}%`}
                className={`aspect-square rounded-sm border ${getHeatCellColor(val)} transition-transform hover:scale-105`}
              />
            ))
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2">
            <div className="text-[11px] text-slate-400">Canopy Stress</div>
            <div className="text-sm font-bold text-orange-400">
              {selected.uav.canopyStressPct}%
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2">
            <div className="text-[11px] text-slate-400">Thermal ΔT</div>
            <div className="text-sm font-bold text-rose-400">
              +{selected.uav.thermalAnomalyC.toFixed(1)}°C
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2">
            <div className="text-[11px] text-slate-400">Hotspots</div>
            <div className="text-sm font-bold text-sky-400">
              {selected.uav.hotspotCount} clusters
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 text-xs bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-slate-300">
          <Layers className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-100">Diagnosis: </span>
            {selectedForecast.conditionType} —{' '}
            <span className="text-amber-300 font-medium">{selectedForecast.pestName}</span>{' '}
            ({selectedForecast.confidencePct}% confidence, {selectedForecast.leadTimeDays}d lead).
          </div>
        </div>
      </div>
    </div>
  );
};
