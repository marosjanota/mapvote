import { useEffect } from 'react';
import { Box } from '@mui/material';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { MapCanvas } from './components/MapCanvas';
import { RightPanel } from './components/RightPanel';
import { ImportDialog } from './components/ImportDialog';
import { ExportDialog } from './components/ExportDialog';
import { MapTooltip } from './components/MapTooltip';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { setGeoData, setSelectedMap } from './store/slices/mapSlice';
import { availableMaps } from './data/availableMaps';

function App() {
  const dispatch = useAppDispatch();
  const { leftPanelOpen, rightPanelOpen } = useAppSelector((state) => state.ui);
  const { selectedMap } = useAppSelector((state) => state.map);

  // Load default US map on startup
  useEffect(() => {
    if (!selectedMap) {
      const usMap = availableMaps.find(map => map.id === 'usa-states');
      if (usMap) {
        fetch(`/${usMap.filename}`)
          .then(res => res.json())
          .then(geoData => {
            dispatch(setSelectedMap(usMap));
            dispatch(setGeoData(geoData));
          })
          .catch(err => console.error('Failed to load default map:', err));
      }
    }
  }, [dispatch, selectedMap]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {leftPanelOpen && <LeftPanel />}
        <MapCanvas />
        {rightPanelOpen && <RightPanel />}
      </Box>
      <ImportDialog />
      <ExportDialog />
      <MapTooltip />
    </Box>
  );
}

export default App;