# Election Map Builder – Technical Documentation

## 1. Project Overview
The goal of this project is to develop a **web application** where users can **create, customize, and share election maps**.  
The maps will be **rendered in SVG format** using **D3.js projections and GeoJSON/TopoJSON**, ensuring scalability, exportability, and integration into reports, presentations, or broadcast graphics (e.g., AXIS).

Key features:
- Interactive election maps (zoom, pan, tooltips).
- Color regions by candidate/party.
- Show real-time voting status (live API or manual data import).
- Export maps in **SVG** and optionally **PNG**.
- Frontend built with **React**.

---

## 2. Use Cases
1. **Journalists / Broadcasters** → create live election maps with updated data feed.  
2. **Government / NGOs** → visualize results in transparent, interactive way.  
3. **AXIS Customers** → integrate generated election maps into broadcast graphics packages.  
4. **Educators / Analysts** → build historical or predictive election scenarios.

---

## 3. System Architecture

### 3.1 Frontend
- **Framework**: React + TypeScript  
- **SVG rendering**: [D3.js](https://d3js.org/) for projections and path generation  
- **Data format**: GeoJSON/TopoJSON from Natural Earth or official election sources  
- **State management**: Redux Toolkit (for election data + UI state)  
- **UI Library**: MUI (for panels, dropdowns, buttons, etc.)  

### 3.2 Backend
- **Optional**: Node.js + Express (for API ingestion, caching, authentication)  
- If only static election datasets are used → backend can be skipped.  
- For live elections → backend polls official APIs and normalizes data.

### 3.3 Data Sources
- **Base maps**: Natural Earth (public domain) → country/state/district polygons.  
- **Election data**:  
  - Uploaded via CSV/JSON (user upload).  
  - Pulled from official election APIs (e.g., US: AP Elections API).  
  - Internal AXIS connector (for integration).

---

## 4. Core Features

### 4.1 Map Rendering
- Render **countries, states, or districts** from GeoJSON/TopoJSON as SVG `<path>`.  
- Use D3 projections (Mercator, Albers, USA-specific, etc.).  
- Pan & zoom with mouse/touch.  

### 4.2 Data Mapping
- Each region (e.g., state) can be mapped to a **party/candidate**.  
- Configurable **color palette** (e.g., blue/red for Democrats/Republicans).  
- Support for “undecided” or “not yet counted” states.  

### 4.3 Live Election Status
- Progress bars / donut charts showing:  
  - Percentage of votes counted.  
  - Current leader.  
  - Electoral votes (for US).  
- Tooltip on hover:  
  - Candidate breakdown.  
  - Votes counted %.  

### 4.4 Data Import
- **Manual Upload** → CSV/JSON with columns like:  
  `region_id, candidate, votes, percentage`.  
- **API Integration** → connect to a live feed (JSON/REST API).  

### 4.5 Export Options
- Export final map as:  
  - **SVG** (main format, scalable).  
  - **PNG** (for quick sharing).  
- Optional → export animation of map updates as **GIF/MP4** (future).

### 4.6 User Interface
- **Left panel**:  
  - Data upload/import.  
  - Candidate/party list with color selector.  
  - Live API configuration.  
- **Main canvas**: Interactive SVG map rendered with D3.js.  
- **Right panel** (optional):  
  - Election status summary (progress bars, winner highlight).  

---

## 5. Data Model

```ts
type Candidate = {
  id: string;
  name: string;
  party: string;
  color: string;
};

type RegionResult = {
  regionId: string;      // matches GeoJSON feature id
  candidateId: string;   // leading candidate
  votes: number;
  percentage: number;
};

type ElectionState = {
  candidates: Candidate[];
  results: RegionResult[];
  totalVotes: number;
  lastUpdated: Date;
};
```

## 6. API Integration (Example – US Elections)
- Polls API every X minutes.  
- Normalize results into internal `ElectionState`.  
- Auto-update React state → re-render map with new colors & percentages.  
- Show “live updating” indicator in UI.  

---

## 7. Export Workflow
1. User presses **Export Map**.  
2. System generates clean **SVG** snapshot (from D3 paths).  
3. Optionally convert SVG → PNG via [Canvg](https://github.com/canvg/canvg) or [dom-to-image](https://github.com/tsayen/dom-to-image).  
4. Download file.  

---

## 8. Fancy Features (Future Enhancements)
- **Animated transitions** when results update (D3 supports smooth path transitions).  
- **Historical Replay Mode** → load election timeline and play results.  
- **Multi-country support** → use Natural Earth for global elections.  
- **Integration with AXIS broadcast graphics** → API endpoint that returns SVG for on-air graphics.  

---

## 9. Licensing & Legal
- **Natural Earth** → Public Domain (safe).  
- **D3.js** → BSD license (safe).  
- **Election data** → ensure licensing if using external API (AP Elections is commercial). For EU/local elections, use government open data if available.  

---

## 10. Tech Stack Summary
- **Frontend**: React + TypeScript + Redux + MUI  
- **Map Rendering**: D3.js (with GeoJSON/TopoJSON)  
- **Backend (optional)**: Node.js + Express (for API ingestion)  
- **Data**: Natural Earth (public domain, preprocessed with mapshaper to GeoJSON/TopoJSON)  
- **Export**: SVG (native), PNG (via converter lib)  
- **Deployment**: Dockerized, hostable on AWS/GCP/Azure  