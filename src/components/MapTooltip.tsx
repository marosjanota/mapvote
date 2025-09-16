import { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';

export const MapTooltip = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  
  const { hoveredRegionId, geoData, displayMode } = useAppSelector((state) => state.map);
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

  // Simple inline styles - no emotion/MUI overhead
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: position.x,
    top: position.y,
    zIndex: 9999,
    pointerEvents: 'none',
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px 12px',
    minWidth: '180px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontSize: '13px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: 'bold',
    marginBottom: '4px',
    color: '#333',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#666',
    fontSize: '12px',
    marginBottom: '6px',
  };

  const candidateStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '2px',
  };

  const dotStyle: React.CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: candidate?.color || '#ccc',
  };

  const separatorStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: '#eee',
    margin: '6px 0',
  };

  return (
    <div style={tooltipStyle}>
      <div style={titleStyle}>
        {region?.properties.name || hoveredRegionId}
      </div>
      
      {region?.properties.electoralVotes && displayMode === 'election' && (
        <div style={subtitleStyle}>
          Electoral Votes: {region.properties.electoralVotes}
        </div>
      )}
      
      {regionResult && candidate && displayMode === 'election' ? (
        <>
          <div style={separatorStyle}></div>
          <div style={candidateStyle}>
            <div style={dotStyle}></div>
            <span>{candidate.name}</span>
          </div>
          <div style={subtitleStyle}>
            {regionResult.votes.toLocaleString()} votes ({regionResult.percentage.toFixed(1)}%)
          </div>
        </>
      ) : displayMode === 'election' ? (
        <>
          <div style={separatorStyle}></div>
          <div style={subtitleStyle}>
            No election data available
          </div>
        </>
      ) : (
        displayMode === 'geography' && (
          <div style={subtitleStyle}>
            Geographic region
          </div>
        )
      )}
    </div>
  );
};