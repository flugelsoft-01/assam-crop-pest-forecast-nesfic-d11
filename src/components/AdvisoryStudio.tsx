import React, { useState } from 'react';
import { AdvisoryLanguage, AgriculturalBlock, PestForecast } from '../types';
import { generateLocalizedAdvisory } from '../engine/advisory';
import { Languages, MessageSquare, Send, Sprout } from 'lucide-react';

interface AdvisoryStudioProps {
  block: AgriculturalBlock;
  forecast: PestForecast;
  onDispatchAdvisory: () => void;
}

const LANGUAGES: { code: AdvisoryLanguage; label: string }[] = [
  { code: 'as', label: 'অসমীয়া (Assamese)' },
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'brx', label: 'बड़ो (Bodo)' },
];

export const AdvisoryStudio: React.FC<AdvisoryStudioProps> = ({
  block,
  forecast,
  onDispatchAdvisory,
}) => {
  const [lang, setLang] = useState<AdvisoryLanguage>('as');
  const [dispatched, setDispatched] = useState(false);
  const advisory = generateLocalizedAdvisory(block, forecast, lang);

  const handleDispatch = () => {
    onDispatchAdvisory();
    setDispatched(true);
    setTimeout(() => setDispatched(false), 3000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Multilingual Location-Specific Farmer Advisory Studio
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                lang === l.code
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Advisory Card */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
            <Sprout className="w-3.5 h-3.5" />
            <span>{advisory.languageLabel} · IPM-First Precision Guidance</span>
          </div>
          <h4 className="text-base font-bold text-slate-100 mb-2">{advisory.headline}</h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{advisory.summary}</p>

          <div className="space-y-2">
            {advisory.actionSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/80 border border-slate-800/80 rounded-md p-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[11px] font-bold shrink-0">
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SMS / WhatsApp Reach Preview */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/80 border border-slate-800 rounded-lg p-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>SMS / WhatsApp / IVR Broadcast Preview</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-100 font-normal leading-relaxed">
              {advisory.smsPreview}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Target Farmers</div>
                <div className="font-bold text-slate-100">
                  {block.registeredFarmers.toLocaleString()} growers
                </div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Covered Area</div>
                <div className="font-bold text-slate-100">{block.areaHa.toLocaleString()} ha</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDispatch}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {dispatched
              ? 'Advisory Logged & Queued for Block Farmers!'
              : `Dispatch ${advisory.languageLabel} Advisory to ${block.blockName}`}
          </button>
        </div>
      </div>
    </div>
  );
};
