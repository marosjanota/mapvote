import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Button,
  Stack,
  Alert,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { Map, Public, Landscape, Palette } from '@mui/icons-material';
import * as topojson from 'topojson-client';
import { availableMaps, mapCategories, MapConfig } from '../data/availableMaps';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setGeoData, setSelectedMap, setDisplayMode, setGeographyStyle } from '../store/slices/mapSlice';
import { clearElectionData } from '../store/slices/electionSlice';
import { mapStyles, GeographyStyleTheme } from '../theme/mapStyles';

export const MapSelector = () => {
  const dispatch = useAppDispatch();
  const selectedMap = useAppSelector((state) => state.map.selectedMap);
  const displayMode = useAppSelector((state) => state.map.displayMode);
  const geographyStyle = useAppSelector((state) => state.map.geographyStyle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMapChange = async (event: SelectChangeEvent) => {
    const mapId = event.target.value;
    const map = availableMaps.find((m) => m.id === mapId);
    
    if (!map) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/${map.filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load map: ${map.filename}`);
      }
      
      let geoData = await response.json();
      
      // Check if it's TopoJSON and convert to GeoJSON
      if (geoData.type === 'Topology') {
        // Find the first object in the topology
        const objectKey = Object.keys(geoData.objects)[0];
        if (!objectKey) {
          throw new Error('No objects found in TopoJSON');
        }
        
        // Convert TopoJSON to GeoJSON
        const feature = topojson.feature(geoData, geoData.objects[objectKey]);
        
        // If it's a single Feature, wrap it in a FeatureCollection
        if (feature.type === 'Feature') {
          geoData = {
            type: 'FeatureCollection',
            features: [feature]
          };
        } else {
          geoData = feature;
        }
      }
      
      dispatch(setSelectedMap(map));
      dispatch(setGeoData(geoData));
      dispatch(setDisplayMode('geography'));
      
      if (map.id !== 'usa-states') {
        dispatch(clearElectionData());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load map');
      console.error('Error loading map:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    dispatch(setDisplayMode(displayMode === 'election' ? 'geography' : 'election'));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'world':
        return <Public sx={{ fontSize: 16 }} />;
      case 'continent':
        return <Landscape sx={{ fontSize: 16 }} />;
      default:
        return <Map sx={{ fontSize: 16 }} />;
    }
  };

  const groupedMaps = availableMaps.reduce((acc, map) => {
    if (!acc[map.category]) {
      acc[map.category] = [];
    }
    acc[map.category].push(map);
    return acc;
  }, {} as Record<string, MapConfig[]>);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Map Selection
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Select Map</InputLabel>
        <Select
          value={selectedMap?.id || ''}
          onChange={handleMapChange}
          label="Select Map"
          disabled={loading}
        >
          {Object.entries(groupedMaps).map(([category, maps]) => [
            <MenuItem key={`header-${category}`} disabled sx={{ opacity: 1 }}>
              <Box display="flex" alignItems="center" gap={1}>
                {getCategoryIcon(category)}
                <Typography variant="caption" fontWeight="bold">
                  {mapCategories[category as keyof typeof mapCategories]}
                </Typography>
              </Box>
            </MenuItem>,
            ...maps.map((map) => (
              <MenuItem key={map.id} value={map.id} sx={{ pl: 4 }}>
                <Box>
                  <Typography variant="body2">{map.name}</Typography>
                  {map.description && (
                    <Typography variant="caption" color="text.secondary">
                      {map.description}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {selectedMap && (
        <Stack spacing={1} mb={2}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Current Map:
            </Typography>
            <Chip
              label={selectedMap.name}
              size="small"
              icon={getCategoryIcon(selectedMap.category)}
            />
          </Box>

          {(selectedMap.id === 'usa-states' || selectedMap.id === 'uk-topo' || selectedMap.id === 'uk-constituencies') && (
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Display Mode:
              </Typography>
              <Button
                size="small"
                variant={displayMode === 'election' ? 'contained' : 'outlined'}
                onClick={handleToggleMode}
                sx={{ minWidth: 100 }}
              >
                {displayMode === 'election' ? 'Election' : 'Geography'}
              </Button>
            </Box>
          )}
        </Stack>
      )}

      {displayMode === 'geography' && (
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Map Style
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={geographyStyle}
              onChange={(e) => dispatch(setGeographyStyle(e.target.value as GeographyStyleTheme))}
              startAdornment={<Palette sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />}
            >
              <MenuItem value="default">
                <Box>
                  <Typography variant="body2">Default Blue</Typography>
                  <Box display="flex" gap={0.5} mt={0.5}>
                    <Box width={16} height={16} bgcolor={mapStyles.geography.default.fill} border="1px solid #ccc" />
                    <Typography variant="caption" color="text.secondary">Classic map style</Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="ocean">
                <Box>
                  <Typography variant="body2">Ocean</Typography>
                  <Box display="flex" gap={0.5} mt={0.5}>
                    <Box width={16} height={16} bgcolor={mapStyles.geography.ocean.fill} border="1px solid #ccc" />
                    <Typography variant="caption" color="text.secondary">Light blue theme</Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="earth">
                <Box>
                  <Typography variant="body2">Earth</Typography>
                  <Box display="flex" gap={0.5} mt={0.5}>
                    <Box width={16} height={16} bgcolor={mapStyles.geography.earth.fill} border="1px solid #ccc" />
                    <Typography variant="caption" color="text.secondary">Natural green</Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="minimal">
                <Box>
                  <Typography variant="body2">Minimal</Typography>
                  <Box display="flex" gap={0.5} mt={0.5}>
                    <Box width={16} height={16} bgcolor={mapStyles.geography.minimal.fill} border="1px solid #ccc" />
                    <Typography variant="caption" color="text.secondary">Clean gray</Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="dark">
                <Box>
                  <Typography variant="body2">Dark</Typography>
                  <Box display="flex" gap={0.5} mt={0.5}>
                    <Box width={16} height={16} bgcolor={mapStyles.geography.dark.fill} border="1px solid #ccc" />
                    <Typography variant="caption" color="text.secondary">Dark theme</Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary">
        Select a map to display geographic boundaries. Election data is available
        for US States and UK Parliamentary Constituencies.
      </Typography>
    </Box>
  );
};