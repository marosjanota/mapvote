import { useRef, useEffect, useState } from 'react';
import { Box, Paper, CircularProgress, Typography } from '@mui/material';
import * as d3 from 'd3';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setHoveredRegion } from '../store/slices/mapSlice';
import { getProjection } from '../utils/projections';
import { GeoFeature } from '../types/geo';
import { MapOverlayBar } from './MapOverlayBar';

export const MapCanvas = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  const dispatch = useAppDispatch();
  const { geoData, projection } = useAppSelector((state) => state.map);
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

    // Function to get region color
    const getRegionColor = (feature: GeoFeature): string => {
      const regionResult = results.find(r => r.regionId === feature.properties.id);
      if (!regionResult) return '#e0e0e0'; // No data - gray
      
      const candidate = candidates.find(c => c.id === regionResult.candidateId);
      return candidate?.color || '#e0e0e0';
    };

    // Render regions
    g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', (d) => path(d as any) || '')
      .attr('fill', (d) => getRegionColor(d as GeoFeature))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
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
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('pointer-events', 'none')
      .text((d) => (d as GeoFeature).properties.abbreviation || '');

  }, [geoData, projection, dimensions, candidates, results, dispatch]);

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
        {showOverlayBar && <MapOverlayBar />}
      </Paper>
    </Box>
  );
};