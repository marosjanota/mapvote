export interface MapConfig {
  id: string;
  name: string;
  category: 'country' | 'continent' | 'world' | 'region';
  filename: string;
  projection: 'mercator' | 'albers' | 'albersUsa' | 'equalEarth';
  center?: [number, number];
  scale?: number;
  description?: string;
}

export const availableMaps: MapConfig[] = [
  {
    id: 'usa-states',
    name: 'United States',
    category: 'country',
    filename: 'usa-states.geojson',
    projection: 'albersUsa',
    description: 'US States with electoral data support'
  },
  {
    id: 'world-countries',
    name: 'World Countries',
    category: 'world',
    filename: 'world-countries.geojson',
    projection: 'equalEarth',
    description: 'All countries of the world'
  },
  {
    id: 'europe',
    name: 'Europe',
    category: 'continent',
    filename: 'europe.geojson',
    projection: 'mercator',
    center: [10, 50],
    scale: 600,
    description: 'European countries'
  },
  {
    id: 'africa',
    name: 'Africa',
    category: 'continent',
    filename: 'africa-countries.geojson',
    projection: 'mercator',
    center: [20, 0],
    scale: 400,
    description: 'African countries'
  },
  {
    id: 'asia',
    name: 'Asia',
    category: 'continent',
    filename: 'asia-countries.geojson',
    projection: 'mercator',
    center: [100, 30],
    scale: 350,
    description: 'Asian countries'
  },
  {
    id: 'south-america',
    name: 'South America',
    category: 'continent',
    filename: 'south-america-countries.geojson',
    projection: 'mercator',
    center: [-60, -15],
    scale: 450,
    description: 'South American countries'
  },
  {
    id: 'north-america',
    name: 'North America',
    category: 'continent',
    filename: 'north-america-countries.geojson',
    projection: 'albers',
    center: [-100, 45],
    scale: 500,
    description: 'North American countries'
  },
  {
    id: 'oceania',
    name: 'Oceania',
    category: 'continent',
    filename: 'oceania-countries.geojson',
    projection: 'mercator',
    center: [135, -25],
    scale: 500,
    description: 'Oceania countries including Australia and Pacific islands'
  }
];

export const mapCategories = {
  country: 'Countries',
  continent: 'Continents',
  world: 'World',
  region: 'Regions'
};