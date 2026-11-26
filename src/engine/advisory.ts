import { AdvisoryLanguage, AgriculturalBlock, PestForecast } from '../types';

export interface LocalizedAdvisory {
  language: AdvisoryLanguage;
  languageLabel: string;
  headline: string;
  summary: string;
  actionSteps: string[];
  smsPreview: string;
}

export function generateLocalizedAdvisory(
  block: AgriculturalBlock,
  forecast: PestForecast,
  language: AdvisoryLanguage
): LocalizedAdvisory {
  const location = `${block.blockName}, ${block.district}`;
  const riskTag = `${forecast.riskLevel} (${forecast.riskScore}/100)`;

  if (language === 'as') {
    return {
      language: 'as',
      languageLabel: 'অসমীয়া (Assamese)',
      headline: `${location} — ${block.crop}ৰ বাবে ${forecast.pestName} সতৰ্কবাণী`,
      summary: `উপগ্ৰহ, ড্ৰোণ আৰু বতৰৰ তথ্য অনুসৰি অহা ${forecast.leadTimeDays} দিনত ${forecast.pestName} (${forecast.scientificName}) ৰোগ/পোকৰ সম্ভাৱনা ${riskTag}।`,
      actionSteps: [
        `পথাৰৰ চিনাক্ত কৰা অংশত (বিশ্বাসযোগ্যতা ${forecast.confidencePct}%) ক্ষেত্ৰ পৰীক্ষা কৰক।`,
        `প্ৰথমে জৈৱিক আৰু সমন্বিত কীট ব্যৱস্থাপনা (IPM) পদ্ধতি গ্ৰহণ কৰক; গোটেই পথাৰত অনাৱশ্যক ৰাসায়নিক ছটিওৱা বন্ধ কৰক।`,
        `পৰামৰ্শ: ${forecast.ipmAction}`,
      ],
      smsPreview: `[AgriDrishti Assam] ${block.blockName}: ${block.crop}-ত ${forecast.pestName}ৰ সম্ভাৱনা ${forecast.riskScore}%। অহা ${forecast.leadTimeDays} দিনত চিনাক্ত স্থানত পৰীক্ষা কৰি IPM ব্যৱস্থা লওক।`,
    };
  }

  if (language === 'bn') {
    return {
      language: 'bn',
      languageLabel: 'বাংলা (Bengali)',
      headline: `${location} — ${block.crop}-এর জন্য ${forecast.pestName} সতর্কতা`,
      summary: `স্যাটেলাইট, ড্রোন ও আবহাওয়া বিশ্লেষণে আগামী ${forecast.leadTimeDays} দিনের মধ্যে ${forecast.pestName} (${forecast.scientificName}) ঝুঁকি ${riskTag} হিসেবে চিহ্নিত হয়েছে।`,
      actionSteps: [
        `চিহ্নিত হটস্পট জমিতে (আত্মবিশ্বাস ${forecast.confidencePct}%) মাঠ পর্যায়ে যাচাই করুন।`,
        `প্রথমে সমন্বিত বালাই ব্যবস্থাপনা (IPM) ও জৈব নিয়ন্ত্রণ অনুসরণ করুন; অপ্রয়োজনীয় রাসায়নিক স্প্রে এড়িয়ে চলুন।`,
        `সুপারিশ: ${forecast.ipmAction}`,
      ],
      smsPreview: `[AgriDrishti Assam] ${block.blockName}: ${block.crop}-এ ${forecast.pestName} ঝুঁকি ${forecast.riskScore}%। আগামী ${forecast.leadTimeDays} দিনের মধ্যে চিহ্নিত স্থানে IPM ব্যবস্থা নিন।`,
    };
  }

  if (language === 'brx') {
    return {
      language: 'brx',
      languageLabel: 'बड़ो (Bodo)',
      headline: `${location} — ${block.crop} नि थाखाय ${forecast.pestName} सांग्रांथि`,
      summary: `सेटेलाइट, ड्रोन आरो बथोरनि खौरां बादिब्ला फैगौ ${forecast.leadTimeDays} साननि गेजेराव ${forecast.pestName} (${forecast.scientificName}) जेंना ${riskTag} नुजादों।`,
      actionSteps: [
        `नायफिननाय जायगायाव (${forecast.confidencePct}% फोथायथाव) आबाद फोथाराव थांना नायगिर।`,
        `गिबियाव IPM आरो गोजोन राहा ला, नाङै रासायनिक मुलि सारनायखौ नागार।`,
        `बोसन: ${forecast.ipmAction}`,
      ],
      smsPreview: `[AgriDrishti Assam] ${block.blockName}: ${block.crop} आव ${forecast.pestName} जेंना ${forecast.riskScore}%। ${forecast.leadTimeDays} साननि गेजेराव IPM राहा ला।`,
    };
  }

  return {
    language: 'en',
    languageLabel: 'English',
    headline: `${location} — ${forecast.pestName} Advisory (${block.crop})`,
    summary: `Multi-modal fusion (Sentinel-2 + UAV + microclimate) flags ${riskTag} ${forecast.conditionType.toLowerCase()} for ${forecast.pestName} (${forecast.scientificName}) with a ${forecast.leadTimeDays}-day early warning window.`,
    actionSteps: [
      `Verify ${block.uav.hotspotCount} geolocated UAV stress hotspots in ${block.blockName} (Model confidence: ${forecast.confidencePct}%).`,
      `Prioritize targeted IPM & biocontrol in flagged polygons; avoid blanket pesticide application across unaffected plots.`,
      `Field Prescription: ${forecast.ipmAction}`,
    ],
    smsPreview: `[AgriDrishti Assam] ${block.blockName}: ${forecast.riskLevel} ${forecast.pestName} risk (${forecast.riskScore}%) in ${block.crop}. Inspect ${block.uav.hotspotCount} flagged hotspots within ${forecast.leadTimeDays}d & follow targeted IPM.`,
  };
}
