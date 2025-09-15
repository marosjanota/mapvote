import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GeoFeatureCollection } from '../../types/geo';

interface MapSliceState {
  geoData: GeoFeatureCollection | null;
  projection: 'mercator' | 'albers' | 'albersUsa' | 'equalEarth';
  zoom: number;
  center: [number, number];
  hoveredRegionId: string | null;
  selectedRegionId: string | null;
}

const initialState: MapSliceState = {
  geoData: null,
  projection: 'albersUsa',
  zoom: 1,
  center: [0, 0],
  hoveredRegionId: null,
  selectedRegionId: null,
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
  resetMap,
} = mapSlice.actions;

export default mapSlice.reducer;