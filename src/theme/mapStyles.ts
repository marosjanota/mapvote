export interface MapStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  hoverFill?: string;
  hoverStroke: string;
  hoverStrokeWidth: number;
  opacity?: number;
  textColor: string;
  textHoverColor?: string;
  textSize?: string;
  textWeight?: string;
}

export const mapStyles = {
  // Geography mode styles
  geography: {
    default: {
      fill: '#6ba3f5',
      stroke: '#ffffff',
      strokeWidth: 0.5,
      hoverFill: '#4a90e2',
      hoverStroke: '#2c5aa0',
      hoverStrokeWidth: 2,
      opacity: 0.9,
      textColor: '#1565c0',
      textHoverColor: '#0d47a1',
      textSize: '12px',
      textWeight: 'bold',
    } as MapStyle,
    ocean: {
      fill: '#bbdefb',
      stroke: '#90caf9',
      strokeWidth: 0.5,
      hoverFill: '#90caf9',
      hoverStroke: '#64b5f6',
      hoverStrokeWidth: 2,
      textColor: '#1976d2',
      textHoverColor: '#1565c0',
      textSize: '12px',
      textWeight: 'bold',
    } as MapStyle,
    earth: {
      fill: '#81c784',
      stroke: '#ffffff',
      strokeWidth: 0.5,
      hoverFill: '#66bb6a',
      hoverStroke: '#4caf50',
      hoverStrokeWidth: 2,
      textColor: '#2e7d32',
      textHoverColor: '#1b5e20',
      textSize: '12px',
      textWeight: 'bold',
    } as MapStyle,
    minimal: {
      fill: '#f5f5f5',
      stroke: '#bdbdbd',
      strokeWidth: 0.5,
      hoverFill: '#eeeeee',
      hoverStroke: '#757575',
      hoverStrokeWidth: 1.5,
      textColor: '#424242',
      textHoverColor: '#212121',
      textSize: '11px',
      textWeight: '600',
    } as MapStyle,
    dark: {
      fill: '#37474f',
      stroke: '#263238',
      strokeWidth: 0.5,
      hoverFill: '#455a64',
      hoverStroke: '#78909c',
      hoverStrokeWidth: 2,
      textColor: '#eceff1',
      textHoverColor: '#ffffff',
      textSize: '12px',
      textWeight: 'bold',
    } as MapStyle,
  },
  
  // Election mode styles
  election: {
    noData: '#e0e0e0',
    stroke: '#ffffff',
    strokeWidth: 1,
    hoverStroke: '#333333',
    hoverStrokeWidth: 2,
    textColor: '#333333',
    textHoverColor: '#000000',
    textSize: '12px',
    textWeight: 'bold',
  },
};

export type GeographyStyleTheme = keyof typeof mapStyles.geography;