export interface Candidate {
  id: string;
  name: string;
  party: string;
  color: string;
}

export interface RegionResult {
  regionId: string;      // matches GeoJSON feature id
  candidateId: string;   // leading candidate
  votes: number;
  percentage: number;
  electoralVotes?: number; // optional electoral votes for this region
}

export interface ElectionState {
  candidates: Candidate[];
  results: RegionResult[];
  totalVotes: number;
  lastUpdated: Date;
}

export interface MapRegion {
  id: string;
  name: string;
  electoralVotes?: number;
  votesCountedPercentage?: number;
}