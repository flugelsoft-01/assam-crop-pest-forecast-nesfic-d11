# AgriDrishti Assam (`agridrishti-assam-nesfic-d11`)

**NESFIC 2026 Problem Statement `NESFIC-D-11`**: *Crop Health Monitoring, Pest & Disease Forecasting and Location-Specific Advisory*  
**Challenge Owners**: Department of Science & Technology (ASSAC) & Department of Agriculture, Government of Assam.

## Overview
**AgriDrishti Assam** is a multi-modal crop health monitoring, pest/disease epidemiological forecasting, and multilingual location-specific advisory platform designed for all major agricultural and horticultural crops in Assam (Sali/Boro Paddy, Tea, Mustard, Potato, Maize, and Horticulture).

### Core Capabilities
- **Multi-Modal Spatial Fusion**: Combines Sentinel-2 spectral indices (NDVI, NDRE, NDWI) with high-resolution UAV/drone orthomosaic stress & thermal anomalies and block-level microclimate data.
- **Epidemiological Pest & Disease Forecasting**: Computes 14-day forward risk trajectories (with confidence intervals and interpretable driver attributions) for Rice Blast, Tea Mosquito Bug, Mustard Aphid, Late Blight, Fall Armyworm, and Sigatoka Leaf Spot.
- **Human-in-the-Loop Field Verification**: Triage queue for Agriculture/Horticulture field staff to verify ground truth, request targeted UAV re-flights, or suppress false positives with an immutable audit trail.
- **Multilingual IPM-First Advisory Studio**: Generates farmer-ready advisories in **Assamese (অসমীয়া)**, **Bengali (বাংলা)**, **Bodo (बड़ो)**, and **English** for SMS/WhatsApp/IVR delivery.

## Quick Start

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Deploy to Cloudflare Workers

This project is pre-configured for **Cloudflare Workers Static Assets** via `wrangler.jsonc` and `public/_headers`.

```bash
# Authenticate once
npx wrangler login

# Preview locally on Workers runtime
npm run preview:worker

# Build and deploy to Cloudflare Workers
npm run deploy
```

## Project Structure
- `src/engine/epidemiology.ts` — Spectral stress & SEIR-based pest/disease risk forecasting engine
- `src/engine/advisory.ts` — Multilingual IPM-first advisory generator (`as`, `bn`, `brx`, `en`)
- `src/data/assamData.ts` — Calibrated synthetic multi-crop block dataset across 6 Assam districts
- `src/components/` — Interactive Assam spatial map, UAV orthomosaic viewer, forecast charts, verification queue, and advisory studio
- `docs/` — Generated NESFIC-D-11 Proposal & Proof-of-Work PDFs
