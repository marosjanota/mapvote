import { useState, useEffect } from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import { useAppSelector } from '../hooks/redux';

export const MapTooltip = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  
  const { hoveredRegionId, geoData } = useAppSelector((state) => state.map);
  const { candidates, results } = useAppSelector((state) => state.election);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX + 10, y: e.clientY + 10 });
    };

    if (hoveredRegionId) {
      setVisible(true);
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      setVisible(false);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredRegionId]);

  if (!visible || !hoveredRegionId || !geoData) return null;

  const region = geoData.features.find(f => f.properties.id === hoveredRegionId);
  const regionResult = results.find(r => r.regionId === hoveredRegionId);
  const candidate = regionResult ? candidates.find(c => c.id === regionResult.candidateId) : null;

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        p: 2,
        minWidth: 200,
        pointerEvents: 'none',
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {region?.properties.name || hoveredRegionId}
      </Typography>
      
      {region?.properties.electoralVotes && (
        <Typography variant="body2" color="text.secondary">
          Electoral Votes: {region.properties.electoralVotes}
        </Typography>
      )}
      
      {regionResult && candidate && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: candidate.color,
                borderRadius: '50%',
              }}
            />
            <Typography variant="body2">
              {candidate.name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {regionResult.votes.toLocaleString()} votes ({regionResult.percentage.toFixed(1)}%)
          </Typography>
        </>
      )}
      
      {!regionResult && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No election data available
          </Typography>
        </>
      )}
    </Paper>
  );
};