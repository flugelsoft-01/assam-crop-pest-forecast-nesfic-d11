import React, { useState } from 'react';
import { AlertStatus, AnomalyAlert } from '../types';
import { CheckCircle2, ClipboardCheck, FileText, Plane, ShieldAlert, XCircle } from 'lucide-react';

interface FieldVerificationQueueProps {
  alerts: AnomalyAlert[];
  onUpdateAlert: (alertId: string, nextStatus: AlertStatus, note: string) => void;
  onSelectBlock: (blockId: string) => void;
}

const STATUS_BADGE: Record<AlertStatus, string> = {
  'Pending Field Verification': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Verified: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'Drone Re-flight Requested': 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  'Advisory Dispatched': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  'False Positive': 'bg-slate-700/40 text-slate-400 border-slate-600/40',
};

export const FieldVerificationQueue: React.FC<FieldVerificationQueueProps> = ({
  alerts,
  onUpdateAlert,
  onSelectBlock,
}) => {
  const [selectedId, setSelectedId] = useState<string>(alerts[0]?.id ?? '');
  const [note, setNote] = useState<string>('');

  const active = alerts.find((a) => a.id === selectedId) ?? alerts[0];

  const handleAction = (nextStatus: AlertStatus, defaultNote: string) => {
    if (!active) return;
    onUpdateAlert(active.id, nextStatus, note.trim() || defaultNote);
    setNote('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Alert List */}
      <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Field-Verification & Triage Queue
            </h3>
          </div>
          <span className="text-xs text-slate-400">{alerts.length} cases</span>
        </div>

        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {alerts.map((alert) => {
            const isSelected = active?.id === alert.id;
            return (
              <button
                key={alert.id}
                onClick={() => {
                  setSelectedId(alert.id);
                  onSelectBlock(alert.blockId);
                }}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/60'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-mono text-slate-400">{alert.id}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_BADGE[alert.status]}`}
                  >
                    {alert.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-100">{alert.title}</div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {alert.blockName}, {alert.district} · {alert.crop}
                  </span>
                  <span className="text-emerald-400 font-medium">
                    {alert.confidencePct}% conf
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Verification Action & Auditable Log */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col">
        {active ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-orange-400" />
                  <h4 className="text-sm font-semibold text-slate-100">{active.title}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Assigned: <span className="text-slate-200">{active.assignedOfficer}</span> · Detected:{' '}
                  {active.detectedAt}
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_BADGE[active.status]}`}>
                {active.status}
              </span>
            </div>

            {/* Officer Verification Input */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Field Scouting Observation / Geo-Tagged Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Enter field inspection findings (e.g., lesion count per hill, trap catch, moisture state)..."
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    handleAction(
                      'Verified',
                      'Field extension officer verified symptoms in flagged UAV hotspot polygon.'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verify Ground Truth
                </button>
                <button
                  onClick={() =>
                    handleAction(
                      'Drone Re-flight Requested',
                      'Requested targeted 3cm/px multispectral UAV re-flight due to partial cloud shadow.'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600/80 hover:bg-sky-500 text-xs font-medium text-white cursor-pointer"
                >
                  <Plane className="w-3.5 h-3.5" /> Request UAV Re-flight
                </button>
                <button
                  onClick={() =>
                    handleAction(
                      'Advisory Dispatched',
                      'Approved and dispatched multilingual IPM advisory to registered block farmers.'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Dispatch Advisory
                </button>
                <button
                  onClick={() =>
                    handleAction(
                      'False Positive',
                      'Field check found no pest/disease incidence; spectral dip linked to harvesting/cloud shadow.'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" /> Mark False Positive
                </button>
              </div>
            </div>

            {/* Immutable Audit Trail */}
            <div className="mt-4 flex-1">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Auditable Observation & Advisory Log
              </h5>
              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {active.auditTrail.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        <strong className="text-emerald-400">{entry.action}</strong> · {entry.actor} (
                        {entry.role})
                      </span>
                      <span>{entry.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-1">{entry.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
