import { useRef, useEffect, useState } from 'react';
import { Box, Paper, CircularProgress, Typography } from '@mui/material';
import * as d3 from 'd3';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setHoveredRegion } from '../store/slices/mapSlice';
import { getProjection } from '../utils/projections';
import { GeoFeature } from '../types/geo';
import { MapOverlayBar } from './MapOverlayBar';
import { mapStyles } from '../theme/mapStyles';

export const MapCanvas = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  const dispatch = useAppDispatch();
  const { geoData, projection, displayMode, geographyStyle } = useAppSelector((state) => state.map);
  const { candidates, results } = useAppSelector((state) => state.election);
  const { isLoading, showOverlayBar } = useAppSelector((state) => state.ui);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Render map with D3
  useEffect(() => {
    if (!svgRef.current || !geoData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create projection
    const proj = getProjection(projection);
    const path = d3.geoPath().projection(proj);

    // Fit projection to bounds
    proj.fitSize([dimensions.width, dimensions.height], geoData);

    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoomBehavior);

    // Create main group for zooming
    const g = svg.append('g');

    // Get current style based on mode
    const geoStyle = mapStyles.geography[geographyStyle];
    const electionStyle = mapStyles.election;

    // Function to get region color
    const getRegionColor = (feature: GeoFeature): string => {
      if (displayMode === 'geography') {
        return geoStyle.fill;
      }
      
      const regionResult = results.find(r => r.regionId === feature.properties.id);
      if (!regionResult) return electionStyle.noData;
      
      const candidate = candidates.find(c => c.id === regionResult.candidateId);
      return candidate?.color || electionStyle.noData;
    };

    // Render regions
    g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('data-region-id', (d) => (d as GeoFeature).properties.id)
      .attr('d', (d) => path(d as any) || '')
      .attr('fill', (d) => getRegionColor(d as GeoFeature))
      .attr('stroke', displayMode === 'geography' ? geoStyle.stroke : electionStyle.stroke)
      .attr('stroke-width', displayMode === 'geography' ? geoStyle.strokeWidth : electionStyle.strokeWidth)
      .style('cursor', 'pointer')
      .style('opacity', displayMode === 'geography' ? (geoStyle.opacity || 1) : 1)
      .on('mouseenter', function(_, d) {
        const feature = d as GeoFeature;
        dispatch(setHoveredRegion(feature.properties.id));
        d3.select(this)
          .attr('stroke', '#333')
          .attr('stroke-width', 2);
      })
      .on('mouseleave', function() {
        dispatch(setHoveredRegion(null));
        d3.select(this)
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);
      });

    // Add labels for regions
    g.selectAll('text')
      .data(geoData.features)
      .enter()
      .append('text')
      .attr('class', 'region-label')
      .attr('data-region-id', (d) => (d as GeoFeature).properties.id)
      .attr('x', (d) => {
        const centroid = path.centroid(d as any);
        return centroid[0];
      })
      .attr('y', (d) => {
        const centroid = path.centroid(d as any);
        return centroid[1];
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', displayMode === 'geography' ? (geoStyle.textSize || '12px') : (electionStyle.textSize || '12px'))
      .style('font-weight', displayMode === 'geography' ? (geoStyle.textWeight || 'bold') : (electionStyle.textWeight || 'bold'))
      .style('fill', displayMode === 'geography' ? geoStyle.textColor : electionStyle.textColor)
      .style('pointer-events', 'none')
      .text((d) => (d as GeoFeature).properties.abbreviation || '');

  }, [geoData, projection, dimensions, candidates, results, displayMode, geographyStyle, dispatch]);

  if (isLoading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, position: 'relative', bgcolor: 'background.default' }}>
      <Paper
        ref={containerRef}
        elevation={1}
        id="map-canvas"
        sx={{
          position: 'absolute',
          inset: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <svg
          ref={svgRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        {!geoData && (
          <Box
            sx={{
              position: 'absolute',
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6" gutterBottom>
              No map data loaded
            </Typography>
            <Typography variant="body2">
              Please import GeoJSON/TopoJSON data to get started
            </Typography>
          </Box>
        )}
        {showOverlayBar && displayMode === 'election' && <MapOverlayBar />}
      </Paper>
    </Box>
  );
};