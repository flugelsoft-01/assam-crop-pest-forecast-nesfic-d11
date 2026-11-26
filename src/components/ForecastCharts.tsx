import React from 'react';
import { AgriculturalBlock, PestForecast } from '../types';
import { Activity, BarChart3, TrendingUp } from 'lucide-react';

interface ForecastChartsProps {
  block: AgriculturalBlock;
  forecast: PestForecast;
}

export const ForecastCharts: React.FC<ForecastChartsProps> = ({ block, forecast }) => {
  const history = block.spectralHistory;
  const traj = forecast.trajectory14d;

  // Build SVG polyline for NDVI vs Baseline
  const w = 320;
  const h = 120;
  const padX = 24;
  const padY = 14;
  const plotW = w - padX * 2;
  const plotH = h - padY * 2;

  const toX = (idx: number, total: number) =>
    padX + (idx / Math.max(1, total - 1)) * plotW;
  const toY = (val: number, min: number, max: number) =>
    padY + (1 - (val - min) / Math.max(0.01, max - min)) * plotH;

  const ndviPoints = history
    .map((pt, i) => `${toX(i, history.length)},${toY(pt.ndvi, 0.2, 0.9)}`)
    .join(' ');
  const basePoints = history
    .map((pt, i) => `${toX(i, history.length)},${toY(pt.baselineNdvi, 0.2, 0.9)}`)
    .join(' ');
  const ndrePoints = history
    .map((pt, i) => `${toX(i, history.length)},${toY(pt.ndre, 0.1, 0.6)}`)
    .join(' ');

  const riskPoints = traj
    .map((pt, i) => `${toX(i, traj.length)},${toY(pt.riskScore, 0, 100)}`)
    .join(' ');
  const upperBand = traj.map((pt, i) => `${toX(i, traj.length)},${toY(pt.upperBound, 0, 100)}`);
  const lowerBand = [...traj]
    .reverse()
    .map((pt, i) => `${toX(traj.length - 1 - i, traj.length)},${toY(pt.lowerBound, 0, 100)}`);
  const bandPolygon = [...upperBand, ...lowerBand].join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Satellite Spectral Time-Series */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Sentinel-2 Spectral Trajectory
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">4-week window</span>
        </div>

        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36 bg-slate-950/70 rounded-lg border border-slate-800/80">
          <line x1={padX} y1={padY} x2={padX} y2={h - padY} stroke="#334155" strokeWidth="1" />
          <line x1={padX} y1={h - padY} x2={w - padX} y2={h - padY} stroke="#334155" strokeWidth="1" />
          <polyline
            fill="none"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            points={basePoints}
          />
          <polyline fill="none" stroke="#10b981" strokeWidth="2.2" points={ndviPoints} />
          <polyline fill="none" stroke="#38bdf8" strokeWidth="1.8" points={ndrePoints} />
          {history.map((pt, i) => (
            <g key={pt.date}>
              <circle cx={toX(i, history.length)} cy={toY(pt.ndvi, 0.2, 0.9)} r="3" fill="#10b981" />
              <text
                x={toX(i, history.length)}
                y={h - 3}
                textAnchor="middle"
                fontSize="8"
                fill="#94a3b8"
              >
                {pt.date}
              </text>
            </g>
          ))}
        </svg>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-500 inline-block" /> Observed NDVI
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-slate-500 inline-block" /> Baseline NDVI
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-sky-400 inline-block" /> NDRE
          </span>
        </div>
      </div>

      {/* 2. 14-Day Epidemiological Risk Forecast */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              14-Day {forecast.pestName} Forecast
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-orange-400">
            {forecast.leadTimeDays}d Lead Window
          </span>
        </div>

        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36 bg-slate-950/70 rounded-lg border border-slate-800/80">
          {/* Threshold line at 55 */}
          <line
            x1={padX}
            y1={toY(55, 0, 100)}
            x2={w - padX}
            y2={toY(55, 0, 100)}
            stroke="rgba(249, 115, 22, 0.4)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <polygon fill="rgba(249, 115, 22, 0.16)" points={bandPolygon} />
          <polyline fill="none" stroke="#f97316" strokeWidth="2.3" points={riskPoints} />
          <text x={padX + 4} y={toY(55, 0, 100) - 3} fontSize="7.5" fill="#fb923c">
            Action Threshold (55)
          </text>
          <text x={padX} y={h - 3} fontSize="8" fill="#94a3b8">
            D+1
          </text>
          <text x={w / 2} y={h - 3} textAnchor="middle" fontSize="8" fill="#94a3b8">
            D+7
          </text>
          <text x={w - padX} y={h - 3} textAnchor="end" fontSize="8" fill="#94a3b8">
            D+14
          </text>
        </svg>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Current Risk: <strong className="text-slate-200">{forecast.riskScore}/100</strong></span>
          <span>D+14 Projected: <strong className="text-orange-400">{traj[13].riskScore}/100</strong></span>
        </div>
      </div>

      {/* 3. Interpretable Risk Attribution */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Interpretable Alert Drivers
            </h4>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">
            {forecast.confidencePct}% Conf.
          </span>
        </div>

        <div className="space-y-2.5 mt-3">
          {forecast.drivers.map((drv) => (
            <div key={drv.factor}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-200 font-medium truncate pr-2">{drv.factor}</span>
                <span className="text-slate-400 shrink-0">{drv.contributionPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full"
                  style={{ width: `${drv.contributionPct}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{drv.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
