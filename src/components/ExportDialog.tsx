import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setExportDialog } from '../store/slices/uiSlice';

type ExportFormat = 'svg' | 'png';

export const ExportDialog = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.exportDialogOpen);
  const [format, setFormat] = useState<ExportFormat>('svg');
  const [filename, setFilename] = useState('election-map');
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');

  const handleClose = () => {
    dispatch(setExportDialog(false));
  };

  const handleExport = async () => {
    const svgElement = document.querySelector('#map-canvas svg');
    if (!svgElement) return;

    // Clone the SVG element
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    
    // Set dimensions
    clonedSvg.setAttribute('width', width);
    clonedSvg.setAttribute('height', height);
    
    // Remove any transforms from the root group (reset zoom)
    const rootGroup = clonedSvg.querySelector('g');
    if (rootGroup) {
      rootGroup.removeAttribute('transform');
    }

    if (format === 'svg') {
      exportAsSVG(clonedSvg, filename);
    } else {
      await exportAsPNG(clonedSvg, filename, parseInt(width), parseInt(height));
    }

    handleClose();
  };

  const exportAsSVG = (svgElement: SVGSVGElement, filename: string) => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    downloadBlob(blob, `${filename}.svg`);
  };

  const exportAsPNG = async (svgElement: SVGSVGElement, filename: string, width: number, height: number) => {
    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Convert SVG to data URL
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create an image and draw it to canvas
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, `${filename}.png`);
        }
        URL.revokeObjectURL(svgUrl);
      }, 'image/png');
    };
    img.src = svgUrl;
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Map</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Export Format
          </Typography>
          <RadioGroup
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
          >
            <FormControlLabel
              value="svg"
              control={<Radio />}
              label={
                <Box>
                  <Typography>SVG (Scalable Vector Graphics)</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Best for editing, unlimited scaling, smaller file size
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="png"
              control={<Radio />}
              label={
                <Box>
                  <Typography>PNG (Portable Network Graphics)</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Best for sharing, fixed resolution, larger file size
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </Box>

        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            helperText={`Will be saved as ${filename}.${format}`}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Width"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              InputProps={{ inputProps: { min: 100, max: 10000 } }}
            />
            <TextField
              label="Height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              InputProps={{ inputProps: { min: 100, max: 10000 } }}
            />
          </Box>
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          The map will be exported at the specified resolution without zoom or pan transforms.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExport}
          disabled={!filename || !width || !height}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};