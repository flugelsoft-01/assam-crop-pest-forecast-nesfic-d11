export type CropType =
  | 'Sali Paddy (Rice)'
  | 'Tea'
  | 'Mustard'
  | 'Potato'
  | 'Maize'
  | 'Horticulture (Banana)';

export type CropStage =
  | 'Seedling / Nursery'
  | 'Vegetative / Tillering'
  | 'Flowering / Panicle Initiation'
  | 'Grain Filling / Harvest Ready';

export type AlertStatus =
  | 'Pending Field Verification'
  | 'Verified'
  | 'Drone Re-flight Requested'
  | 'Advisory Dispatched'
  | 'False Positive';

export type AdvisoryLanguage = 'en' | 'as' | 'bn' | 'brx';

export interface SpectralObservation {
  date: string;
  ndvi: number;
  ndre: number;
  ndwi: number;
  baselineNdvi: number;
  cloudCoverPct: number;
}

export interface UavSurvey {
  lastFlightDate: string;
  gsdCm: number;
  canopyStressPct: number;
  thermalAnomalyC: number;
  hotspotCount: number;
  chlorophyllDeficitIndex: number;
  mosaicGrid: number[][]; // 8x8 normalized stress grid (0..1)
}

export interface WeatherWindow {
  tempC: number;
  humidityPct: number;
  rainfall7dMm: number;
  leafWetnessHrs: number;
  windKmph: number;
}

export interface AgriculturalBlock {
  id: string;
  district: string;
  blockName: string;
  agroClimaticZone: string;
  lat: number;
  lng: number;
  mapX: number; // 0..100 SVG coordinate
  mapY: number; // 0..100 SVG coordinate
  crop: CropType;
  cropStage: CropStage;
  areaHa: number;
  registeredFarmers: number;
  spectralHistory: SpectralObservation[];
  uav: UavSurvey;
  weather: WeatherWindow;
  fieldReportsCount: number;
}

export interface RiskDriver {
  factor: string;
  value: string;
  contributionPct: number;
  category: 'Weather' | 'Spectral' | 'UAV' | 'Phenology';
}

export interface TrajectoryPoint {
  day: number;
  label: string;
  riskScore: number;
  lowerBound: number;
  upperBound: number;
}

export interface PestForecast {
  pestName: string;
  scientificName: string;
  riskScore: number; // 0..100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  leadTimeDays: number;
  confidencePct: number;
  conditionType: 'Current Crop Stress' | 'Emerging Pest/Disease Risk' | 'Nutrient Deficiency';
  drivers: RiskDriver[];
  trajectory14d: TrajectoryPoint[];
  ipmAction: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  note: string;
  confidenceSnapshot: number;
}

export interface AnomalyAlert {
  id: string;
  blockId: string;
  district: string;
  blockName: string;
  crop: CropType;
  title: string;
  conditionType: 'Current Crop Stress' | 'Emerging Pest/Disease Risk' | 'Nutrient Deficiency';
  severity: 'Moderate' | 'High' | 'Critical';
  confidencePct: number;
  status: AlertStatus;
  assignedOfficer: string;
  detectedAt: string;
  auditTrail: AuditEntry[];
}
