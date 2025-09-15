import { Feature, FeatureCollection, Geometry } from 'geojson';

export interface GeoProperties {
  id: string;
  name: string;
  abbreviation?: string;
  electoralVotes?: number;
}

export type GeoFeature = Feature<Geometry, GeoProperties>;
export type GeoFeatureCollection = FeatureCollection<Geometry, GeoProperties>;

export interface MapProjection {
  name: string;
  projection: d3.GeoProjection;
}

export interface MapBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}