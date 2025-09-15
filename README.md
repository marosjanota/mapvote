# MapVote - Election Map Builder

A web application for creating, customizing, and sharing election maps with D3.js and React.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run lint
```

## Features

- Interactive election maps with D3.js (zoom, pan, tooltips)
- Color regions by candidate/party
- **Embedded results bar** with real-time election status
- Electoral vote progress tracking with 270-vote threshold
- Popular vote statistics and percentages
- Export maps as SVG/PNG (includes overlay bar)
- Built with React, TypeScript, Redux Toolkit, and MUI

## Project Structure

```
src/
├── components/     # React components
├── features/       # Feature-specific code
├── hooks/         # Custom React hooks
├── store/         # Redux store and slices
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Sample Data

The application comes with several sample datasets:

- **`usa-states.geojson`** - Complete USA states map data (Natural Earth, Public Domain)
- **`mock-election-2024.json`** - Simulated 2024 Presidential Election results
- **`election-2020-results.json`** - Historical 2020 Presidential Election data
- **`sample-election-data.csv`** - Example CSV format for election data import

## Development Status

- ✅ Project setup with Vite
- ✅ Core dependencies installed (D3.js, Redux Toolkit, MUI)
- ✅ Redux store configured
- ✅ Complete UI layout with collapsible panels
- ✅ D3.js map rendering with multiple projections
- ✅ Data import functionality (GeoJSON, TopoJSON, CSV, JSON)
- ✅ Export functionality (SVG/PNG)
- ✅ Interactive tooltips and hover effects
- ✅ Candidate management (add/edit/delete)
- ✅ Real-time election statistics
- ✅ Pan and zoom functionality
- ✅ **Embedded results overlay** perfect for embedding/broadcasting
- ✅ Toggleable results bar with compact, modern design