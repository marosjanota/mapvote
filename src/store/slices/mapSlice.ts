import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GeoFeatureCollection } from '../../types/geo';
import { MapConfig } from '../../data/availableMaps';
import { GeographyStyleTheme } from '../../theme/mapStyles';

interface MapSliceState {
  geoData: GeoFeatureCollection | null;
  projection: 'mercator' | 'albers' | 'albersUsa' | 'equalEarth';
  zoom: number;
  center: [number, number];
  hoveredRegionId: string | null;
  selectedRegionId: string | null;
  selectedMap: MapConfig | null;
  displayMode: 'election' | 'geography';
  geographyStyle: GeographyStyleTheme;
}

const initialState: MapSliceState = {
  geoData: null,
  projection: 'albersUsa',
  zoom: 1,
  center: [0, 0],
  hoveredRegionId: null,
  selectedRegionId: null,
  selectedMap: null,
  displayMode: 'election',
  geographyStyle: 'default',
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setGeoData: (state, action: PayloadAction<GeoFeatureCollection>) => {
      state.geoData = action.payload;
    },
    setProjection: (state, action: PayloadAction<MapSliceState['projection']>) => {
      state.projection = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload;
    },
    setHoveredRegion: (state, action: PayloadAction<string | null>) => {
      state.hoveredRegionId = action.payload;
    },
    setSelectedRegion: (state, action: PayloadAction<string | null>) => {
      state.selectedRegionId = action.payload;
    },
    setSelectedMap: (state, action: PayloadAction<MapConfig | null>) => {
      state.selectedMap = action.payload;
      if (action.payload) {
        state.projection = action.payload.projection;
        if (action.payload.center) {
          state.center = action.payload.center;
        }
      }
    },
    setDisplayMode: (state, action: PayloadAction<'election' | 'geography'>) => {
      state.displayMode = action.payload;
    },
    setGeographyStyle: (state, action: PayloadAction<GeographyStyleTheme>) => {
      state.geographyStyle = action.payload;
    },
    resetMap: () => initialState,
  },
});

export const {
  setGeoData,
  setProjection,
  setZoom,
  setCenter,
  setHoveredRegion,
  setSelectedRegion,
  setSelectedMap,
  setDisplayMode,
  setGeographyStyle,
  resetMap,
} = mapSlice.actions;

export default mapSlice.reducer;