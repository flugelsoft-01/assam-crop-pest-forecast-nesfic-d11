import {
  AgriculturalBlock,
  CropType,
  PestForecast,
  RiskDriver,
  TrajectoryPoint,
} from '../types';

interface PestProfile {
  pestName: string;
  scientificName: string;
  optimalTempRange: [number, number];
  minHumidity: number;
  minLeafWetnessHrs: number;
  ipmAction: string;
}

const CROP_PEST_PROFILES: Record<CropType, PestProfile> = {
  'Sali Paddy (Rice)': {
    pestName: 'Rice Blast',
    scientificName: 'Magnaporthe oryzae',
    optimalTempRange: [22, 29],
    minHumidity: 82,
    minLeafWetnessHrs: 10,
    ipmAction:
      'Drain excess standing water, avoid split nitrogen top-dressing, and apply Tricyclazole 75% WP @ 0.6g/L only in verified hotspot patches.',
  },
  Tea: {
    pestName: 'Tea Mosquito Bug',
    scientificName: 'Helopeltis theivora',
    optimalTempRange: [24, 31],
    minHumidity: 80,
    minLeafWetnessHrs: 8,
    ipmAction:
      'Conduct black-light/sticky trap scouting in shaded sections, prune heavily infested shoots, and deploy Beauveria bassiana before targeted botanical neem spray.',
  },
  Mustard: {
    pestName: 'Mustard Aphid',
    scientificName: 'Lipaphis erysimi',
    optimalTempRange: [15, 24],
    minHumidity: 68,
    minLeafWetnessHrs: 4,
    ipmAction:
      'Install yellow sticky traps (12/ha), conserve Coccinellid ladybird predators, and spot-spray Azadirachtin 1500 ppm if >25 aphids/10cm shoot.',
  },
  Potato: {
    pestName: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    optimalTempRange: [14, 22],
    minHumidity: 85,
    minLeafWetnessHrs: 11,
    ipmAction:
      'Hill up ridges to protect tubers, rogue infected haulms immediately, and apply preventive Cymoxanil + Mancozeb @ 2g/L on high-risk blocks.',
  },
  Maize: {
    pestName: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    optimalTempRange: [25, 33],
    minHumidity: 65,
    minLeafWetnessHrs: 3,
    ipmAction:
      'Deploy pheromone traps (5/ha), apply sand+lime whorl application or Metarhizium anisopliae, and target Emamectin Benzoate only above 10% whorl damage.',
  },
  'Horticulture (Banana)': {
    pestName: 'Sigatoka Leaf Spot',
    scientificName: 'Pseudocercospora fijiensis',
    optimalTempRange: [24, 30],
    minHumidity: 84,
    minLeafWetnessHrs: 9,
    ipmAction:
      'De-leaf severely necrotic lower leaves, improve drainage/spacing, and apply mineral oil + Propiconazole spot treatment in verified clusters.',
  },
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function computeSpectralStress(block: AgriculturalBlock): {
  ndviAnomaly: number;
  ndreDeficit: number;
  moistureStress: number;
  currentStressScore: number;
} {
  const latest = block.spectralHistory[block.spectralHistory.length - 1];
  const ndviAnomaly = Number((latest.baselineNdvi - latest.ndvi).toFixed(3));
  const ndreDeficit = Number(Math.max(0, 0.34 - latest.ndre).toFixed(3));
  const moistureStress = Number(Math.max(0, 0.28 - latest.ndwi).toFixed(3));

  const rawStress =
    Math.max(0, ndviAnomaly) * 240 +
    ndreDeficit * 160 +
    moistureStress * 110 +
    block.uav.canopyStressPct * 0.75;

  return {
    ndviAnomaly,
    ndreDeficit,
    moistureStress,
    currentStressScore: Math.round(clamp(rawStress, 5, 98)),
  };
}

export function forecastPestRisk(block: AgriculturalBlock): PestForecast {
  const profile = CROP_PEST_PROFILES[block.crop];
  const { weather, uav } = block;
  const spectral = computeSpectralStress(block);

  // 1. Thermal suitability (0..28 pts)
  const [tMin, tMax] = profile.optimalTempRange;
  const tMid = (tMin + tMax) / 2;
  const tHalf = Math.max(1, (tMax - tMin) / 2);
  const tempFit = clamp(1 - Math.abs(weather.tempC - tMid) / (tHalf * 1.8), 0, 1);
  const tempPts = tempFit * 28;

  // 2. Humidity & Leaf Wetness epidemiological trigger (0..32 pts)
  const humRatio = clamp((weather.humidityPct - (profile.minHumidity - 15)) / 22, 0, 1);
  const wetRatio = clamp(weather.leafWetnessHrs / Math.max(1, profile.minLeafWetnessHrs + 2), 0, 1);
  const epiPts = (humRatio * 0.55 + wetRatio * 0.45) * 32;

  // 3. Spectral + UAV early canopy stress signal (0..28 pts)
  const uavPts = clamp(uav.canopyStressPct * 0.65 + uav.thermalAnomalyC * 4.2, 0, 16);
  const specPts = clamp(Math.max(0, spectral.ndviAnomaly) * 90, 0, 12);

  // 4. Phenology vulnerability modifier (0..12 pts)
  const stagePts =
    block.cropStage === 'Vegetative / Tillering' ||
    block.cropStage === 'Flowering / Panicle Initiation'
      ? 11
      : 6;

  const riskScore = Math.round(clamp(tempPts + epiPts + uavPts + specPts + stagePts, 8, 96));

  let riskLevel: PestForecast['riskLevel'] = 'Low';
  if (riskScore >= 75) riskLevel = 'Critical';
  else if (riskScore >= 55) riskLevel = 'High';
  else if (riskScore >= 35) riskLevel = 'Moderate';

  // Distinguish current crop stress vs emerging pest/disease risk vs nutrient deficiency
  let conditionType: PestForecast['conditionType'] = 'Emerging Pest/Disease Risk';
  if (spectral.ndreDeficit > 0.1 && epiPts < 16) {
    conditionType = 'Nutrient Deficiency';
  } else if (spectral.currentStressScore >= 65 && uav.canopyStressPct >= 18) {
    conditionType = 'Current Crop Stress';
  }

  // Calibrated confidence based on multi-modal agreement & cloud cover
  const latestSpec = block.spectralHistory[block.spectralHistory.length - 1];
  const cloudPenalty = latestSpec.cloudCoverPct * 0.18;
  const fieldBonus = Math.min(10, block.fieldReportsCount * 2.5);
  const uavBonus = uav.hotspotCount > 0 ? 8 : 3;
  const confidencePct = Math.round(clamp(74 + fieldBonus + uavBonus - cloudPenalty, 58, 96));

  // Lead time gained before visible field outbreak
  const leadTimeDays = riskScore >= 70 ? 6 : riskScore >= 50 ? 9 : 12;

  // Normalize driver contributions to 100%
  const rawDrivers: Omit<RiskDriver, 'contributionPct'>[] = [
    {
      factor: 'Humidity & Leaf Wetness',
      value: `${weather.humidityPct}% RH · ${weather.leafWetnessHrs}h wetness`,
      category: 'Weather',
    },
    {
      factor: 'UAV Canopy & Thermal',
      value: `${uav.canopyStressPct}% stress · +${uav.thermalAnomalyC.toFixed(1)}°C`,
      category: 'UAV',
    },
    {
      factor: 'Sentinel-2 NDVI Anomaly',
      value: `${spectral.ndviAnomaly >= 0 ? '-' : '+'}${Math.abs(spectral.ndviAnomaly).toFixed(2)} vs baseline`,
      category: 'Spectral',
    },
    {
      factor: 'Crop Stage Susceptibility',
      value: block.cropStage,
      category: 'Phenology',
    },
  ];
  const weights = [epiPts + tempPts * 0.5, uavPts, specPts + 2, stagePts];
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1;
  const drivers: RiskDriver[] = rawDrivers.map((d, idx) => ({
    ...d,
    contributionPct: Math.round((weights[idx] / weightSum) * 100),
  }));

  // 14-day SEIR-like forward trajectory
  const trajectory14d: TrajectoryPoint[] = Array.from({ length: 14 }, (_, i) => {
    const day = i + 1;
    const growthRate = riskScore >= 55 ? 0.16 : 0.08;
    const projected = clamp(
      riskScore + (100 - riskScore) * (1 - Math.exp(-growthRate * (day / 3.5))) * 0.55,
      10,
      98
    );
    const spread = 4 + day * 0.65;
    return {
      day,
      label: `D+${day}`,
      riskScore: Math.round(projected),
      lowerBound: Math.round(clamp(projected - spread, 5, 95)),
      upperBound: Math.round(clamp(projected + spread, 10, 99)),
    };
  });

  return {
    pestName: profile.pestName,
    scientificName: profile.scientificName,
    riskScore,
    riskLevel,
    leadTimeDays,
    confidencePct,
    conditionType,
    drivers,
    trajectory14d,
    ipmAction: profile.ipmAction,
  };
}
