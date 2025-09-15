import { AppBar, Toolbar, Typography, IconButton, Button, Tooltip } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft, ChevronRight, FileDownload, FileUpload, BarChart } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleLeftPanel, toggleRightPanel, setExportDialog, setImportDialog, setShowOverlayBar } from '../store/slices/uiSlice';

export const Header = () => {
  const dispatch = useAppDispatch();
  const { leftPanelOpen, rightPanelOpen, showOverlayBar } = useAppSelector((state) => state.ui);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle left panel"
          onClick={() => dispatch(toggleLeftPanel())}
        >
          {leftPanelOpen ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MapVote - Election Map Builder
        </Typography>
        
        <Button
          color="inherit"
          startIcon={<FileUpload />}
          onClick={() => dispatch(setImportDialog(true))}
        >
          Import
        </Button>
        
        <Button
          color="inherit"
          startIcon={<FileDownload />}
          onClick={() => dispatch(setExportDialog(true))}
        >
          Export
        </Button>
        
        <Tooltip title="Toggle Results Bar">
          <IconButton
            color="inherit"
            onClick={() => dispatch(setShowOverlayBar(!showOverlayBar))}
            sx={{ opacity: showOverlayBar ? 1 : 0.5 }}
          >
            <BarChart />
          </IconButton>
        </Tooltip>
        
        <IconButton
          edge="end"
          color="inherit"
          aria-label="toggle right panel"
          onClick={() => dispatch(toggleRightPanel())}
        >
          {rightPanelOpen ? <ChevronRight /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};