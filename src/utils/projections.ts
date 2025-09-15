import * as d3 from 'd3';

export const projections = {
  mercator: () => d3.geoMercator(),
  albers: () => d3.geoAlbers(),
  albersUsa: () => d3.geoAlbersUsa(),
  equalEarth: () => d3.geoEqualEarth(),
} as const;

export type ProjectionType = keyof typeof projections;

export const getProjection = (type: ProjectionType): d3.GeoProjection => {
  return projections[type]();
};