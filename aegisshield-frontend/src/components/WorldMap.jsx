import React, { useRef, useEffect, useState } from 'react';
import geoData from '../data/world-map.json';

const WorldMap = ({ conflictData = {} }) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [tooltipOffset, setTooltipOffset] = useState({ x: 15, y: 15 });

  const isPointInPolygon = (point, vs) => {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const drawMap = (ctx, width, height, highlightId = null) => {
    // 1. PULL CSS VARIABLES INTO CANVAS CONTEXT
    const style = getComputedStyle(document.documentElement);
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    const colors = {
      accent: style.getPropertyValue('--accent').trim(),
      secondary: style.getPropertyValue('--secondary').trim(),
      mapBase: style.getPropertyValue('--map-base').trim(),
      borderSelected: style.getPropertyValue('--border-selected').trim(),
      gridLine: style.getPropertyValue('--grid-line').trim(),
      // Logic: Faded white for dark theme (0.08 alpha), Solid white for light theme
      defaultBorder: theme === 'light' ? '#ffffff' : 'rgba(255, 255, 255, 0.08)'
    };

    ctx.clearRect(0, 0, width, height);

    // 2. DRAW TACTICAL GRID
    ctx.strokeStyle = colors.gridLine;
    ctx.lineWidth = 0.5;
    const step = 45;
    for (let i = 0; i < width; i += step) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += step) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

    const project = (lon, lat) => {
      const x = (lon + 180) * (width / 360);
      const y = (90 - lat) * (height / 180);
      return [x, y];
    };

    geoData.features.forEach(feature => {
      const iso = feature.properties.iso_a3 || feature.properties.ISO_A3;
      const intensity = conflictData[iso] || 0;
      const isHighlighted = iso === highlightId;

      // Reset shadows for every path to avoid bleed
      ctx.shadowBlur = 0;

      if (isHighlighted) {
        ctx.shadowBlur = 1;
        ctx.shadowColor = colors.secondary;
      } else {
        ctx.fillStyle = intensity > 0 
          ? `rgba(255, 62, 62, ${Math.max(0.3, intensity / 100)})` // Critical Red scaled
          : colors.mapBase;
      }

      ctx.strokeStyle = isHighlighted ? colors.borderSelected : colors.defaultBorder;
      ctx.lineWidth = isHighlighted ? 0.2 : 0.8;

      // Destructuring geometry to avoid ReferenceError
      const { type, coordinates } = feature.geometry;

      const drawRing = (ring) => {
        ctx.beginPath();
        ring.forEach((c, i) => {
          const [px, py] = project(c[0], c[1]);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.fill();
        ctx.stroke();
      };

      if (type === "Polygon") {
        coordinates.forEach(drawRing);
      } else if (type === "MultiPolygon") {
        coordinates.forEach(p => p.forEach(drawRing));
      }
    });
  };

  const onMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouseCoord({ x, y });

    // Boundary check for tooltip positioning
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      let offsetX = 15;
      let offsetY = 15;

      if (x + tooltipRect.width + 20 > rect.width) {
        offsetX = -(tooltipRect.width + 15);
      }
      if (y + tooltipRect.height + 20 > rect.height) {
        offsetY = -(tooltipRect.height + 15);
      }
      setTooltipOffset({ x: offsetX, y: offsetY });
    }

    const lon = (x / (rect.width / 360)) - 180;
    const lat = 90 - (y / (rect.height / 180));

    let found = null;
    for (const f of geoData.features) {
      const { type, coordinates } = f.geometry;
      const match = type === "Polygon" ? isPointInPolygon([lon, lat], coordinates[0]) :
                    coordinates.some(p => isPointInPolygon([lon, lat], p[0]));
      if (match) { found = f.properties; break; }
    }

    // DYNAMIC CURSOR LOGIC
    // If a country is found, change cursor to pointer, else back to crosshair/default
    if (found) {
        canvas.style.cursor = 'pointer';
        setHoveredCountry({ 
            name: found.name || found.NAME, 
            iso: found.iso_a3 || found.ISO_A3,
            intensity: conflictData[found.iso_a3 || found.ISO_A3] || 0 
        });
    } else {
        canvas.style.cursor = 'crosshair';
        setHoveredCountry(null);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    drawMap(ctx, width, height, hoveredCountry?.iso);
  }, [hoveredCountry, conflictData]);

  return (
    <div className="map-canvas-wrapper" onMouseMove={onMouseMove} onMouseLeave={() => setHoveredCountry(null)} style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      {hoveredCountry && (
        <div 
          ref={tooltipRef}
          className="map-tooltip" 
          style={{ 
            position: 'absolute',
            left: mouseCoord.x + tooltipOffset.x, 
            top: mouseCoord.y + tooltipOffset.y,
            pointerEvents: 'none'
          }}
        >
          <div className="tooltip-header">{hoveredCountry.name.toUpperCase()}</div>
          <div>ISO_REF: {hoveredCountry.iso}</div>
          <div>INTENSITY_LVL: {hoveredCountry.intensity}%</div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;