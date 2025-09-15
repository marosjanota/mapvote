import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Tab,
  Tabs,
  TextField,
  Stack,
} from '@mui/material';
import { CloudUpload, Link as LinkIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setImportDialog, setLoading, setError } from '../store/slices/uiSlice';
import { setGeoData } from '../store/slices/mapSlice';
import { setCandidates, setResults } from '../store/slices/electionSlice';
import { GeoFeatureCollection } from '../types/geo';
import { Candidate, RegionResult } from '../types/election';
import * as topojson from 'topojson-client';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export const ImportDialog = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.importDialogOpen);
  const [tabValue, setTabValue] = useState(0);
  const [mapUrl, setMapUrl] = useState('');
  const [electionUrl, setElectionUrl] = useState('');
  const mapFileRef = useRef<HTMLInputElement>(null);
  const electionFileRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    dispatch(setImportDialog(false));
    dispatch(setError(null));
  };

  const processGeoJSON = (data: any): GeoFeatureCollection => {
    if (data.type === 'Topology') {
      // Convert TopoJSON to GeoJSON
      const key = Object.keys(data.objects)[0];
      const feature = topojson.feature(data, data.objects[key]);
      // topojson.feature returns either Feature or FeatureCollection
      if (feature.type === 'Feature') {
        return {
          type: 'FeatureCollection',
          features: [feature as any]
        };
      }
      return feature as unknown as GeoFeatureCollection;
    }
    return data as GeoFeatureCollection;
  };

  const processElectionData = (data: any) => {
    // Process candidates
    if (data.candidates) {
      const candidates: Candidate[] = data.candidates.map((c: any) => ({
        id: c.id || String(Math.random()),
        name: c.name,
        party: c.party || '',
        color: c.color || '#' + Math.floor(Math.random()*16777215).toString(16),
      }));
      dispatch(setCandidates(candidates));
    }

    // Process results
    if (data.results) {
      const results: RegionResult[] = data.results.map((r: any) => ({
        regionId: r.regionId || r.region_id,
        candidateId: r.candidateId || r.candidate_id,
        votes: Number(r.votes) || 0,
        percentage: Number(r.percentage) || 0,
      }));
      dispatch(setResults(results));
    }
  };

  const handleMapFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    dispatch(setLoading(true));
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const geoJSON = processGeoJSON(data);
      dispatch(setGeoData(geoJSON));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError('Failed to parse map file. Please ensure it is valid GeoJSON or TopoJSON.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleElectionFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    dispatch(setLoading(true));
    try {
      const text = await file.text();
      const data = file.name.endsWith('.csv') ? parseCSV(text) : JSON.parse(text);
      processElectionData(data);
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError('Failed to parse election data file.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const parseCSV = (text: string): any => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const results = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {} as any);
    });
    return { results };
  };

  const handleLoadFromUrl = async () => {
    dispatch(setLoading(true));
    try {
      // Load map data
      if (mapUrl) {
        const response = await fetch(mapUrl);
        const data = await response.json();
        const geoJSON = processGeoJSON(data);
        dispatch(setGeoData(geoJSON));
      }

      // Load election data
      if (electionUrl) {
        const response = await fetch(electionUrl);
        const data = await response.json();
        processElectionData(data);
      }

      dispatch(setError(null));
      handleClose();
    } catch (error) {
      dispatch(setError('Failed to load data from URL.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLoadPreset = async (preset: '2024' | '2020' | 'map-only') => {
    dispatch(setLoading(true));
    try {
      // Always load the USA states map
      const mapResponse = await fetch('/usa-states.geojson');
      const mapData = await mapResponse.json();
      
      // Transform the GeoJSON to match our expected format
      const transformedMapData = {
        ...mapData,
        features: mapData.features.map((feature: any) => ({
          ...feature,
          properties: {
            ...feature.properties,
            id: feature.properties.state_code || feature.properties.name,
            abbreviation: feature.properties.state_code,
          }
        }))
      };
      
      dispatch(setGeoData(transformedMapData));
      
      // Load election data based on preset
      if (preset !== 'map-only') {
        const electionFile = preset === '2024' ? '/mock-election-2024.json' : '/election-2020-results.json';
        const electionResponse = await fetch(electionFile);
        const electionData = await electionResponse.json();
        
        dispatch(setCandidates(electionData.candidates));
        dispatch(setResults(electionData.results));
      } else {
        // Clear any existing election data
        dispatch(setCandidates([]));
        dispatch(setResults([]));
      }
      
      handleClose();
    } catch (error) {
      dispatch(setError(`Failed to load ${preset} data.`));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import Data</DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="File Upload" />
          <Tab label="URL" />
          <Tab label="Sample Data" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Map Data (GeoJSON/TopoJSON)
            </Typography>
            <input
              ref={mapFileRef}
              type="file"
              accept=".json,.geojson,.topojson"
              onChange={handleMapFileUpload}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CloudUpload />}
              onClick={() => mapFileRef.current?.click()}
            >
              Choose Map File
            </Button>
          </Box>
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Election Data (JSON/CSV)
            </Typography>
            <input
              ref={electionFileRef}
              type="file"
              accept=".json,.csv"
              onChange={handleElectionFileUpload}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CloudUpload />}
              onClick={() => electionFileRef.current?.click()}
            >
              Choose Election Data File
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <TextField
            fullWidth
            label="Map Data URL"
            value={mapUrl}
            onChange={(e) => setMapUrl(e.target.value)}
            placeholder="https://example.com/map.geojson"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Election Data URL"
            value={electionUrl}
            onChange={(e) => setElectionUrl(e.target.value)}
            placeholder="https://example.com/election-results.json"
          />
          <Button
            variant="contained"
            fullWidth
            startIcon={<LinkIcon />}
            onClick={handleLoadFromUrl}
            sx={{ mt: 2 }}
            disabled={!mapUrl && !electionUrl}
          >
            Load from URLs
          </Button>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Load sample data for testing the application.
          </Alert>
          
          <Stack spacing={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleLoadPreset('2024')}
            >
              2024 US Presidential Election (Mock Data)
            </Button>
            
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleLoadPreset('2020')}
            >
              2020 US Presidential Election (Historical)
            </Button>
            
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleLoadPreset('map-only')}
            >
              US States Map Only (No Election Data)
            </Button>
          </Stack>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};