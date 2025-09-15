import { Box } from '@mui/material';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { MapCanvas } from './components/MapCanvas';
import { RightPanel } from './components/RightPanel';
import { ImportDialog } from './components/ImportDialog';
import { ExportDialog } from './components/ExportDialog';
import { MapTooltip } from './components/MapTooltip';
import { useAppSelector } from './hooks/redux';

function App() {
  const { leftPanelOpen, rightPanelOpen } = useAppSelector((state) => state.ui);

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