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
    const style = getComputedStyle(document.documentElement);
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    // Updated color variables based on your CSS and requested logic
    const colors = {
      accent: style.getPropertyValue('--accent').trim(), // Critical Red
      secondary: style.getPropertyValue('--secondary').trim(), // Tactical Cyan
      whiteColor: style.getPropertyValue('--text-main').trim(), // For hover border
      staticWhite: '#FFFFFF',
      warning: style.getPropertyValue('--warning').trim(), // Alert Yellow
      okayColor: style.getPropertyValue('--success').trim(), // Stable Green
      mapBase: style.getPropertyValue('--map-base').trim(),
      borderSelected: style.getPropertyValue('--border-selected').trim(),
      gridLine: style.getPropertyValue('--grid-line').trim(),
      defaultBorder: theme === 'light' ? '#ffffff' : 'rgba(255, 255, 255, 0.08)'
    };

    ctx.clearRect(0, 0, width, height);

    // DRAW TACTICAL GRID
    ctx.strokeStyle = colors.gridLine;
    ctx.lineWidth = 0.5;
    const step = 45;
    for (let i = 0; i < width; i += step) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += step) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

    geoData.features.forEach(feature => {
      const iso = feature.properties.iso_a3 || feature.properties.ISO_A3 || feature.properties.iso_3;
      const intensity = conflictData[iso] || 0;
      const isHighlighted = iso === highlightId;

      // 1. DYNAMIC COLOR THRESHOLD LOGIC
      // Critical: 70% and above
      if (intensity >= 70) {
        ctx.fillStyle = colors.accent; 
      } 
      // Mild/Active: 40% to 89%
      else if (intensity >= 40) {
        ctx.fillStyle = colors.warning; // Semi-transparent Tactical Cyan
      } 
      // Low/Stable or No Cases: Remaining mildest color
      else {
        ctx.fillStyle = colors.okayColor;
      }

      // 2. BORDER & GLOW LOGIC (Updated to use whiteColor)
      ctx.shadowBlur = 0; 
      if (isHighlighted) {
        ctx.strokeStyle = colors.staticWhite; 
        ctx.lineWidth = 1.0;
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors.staticWhite; // Tactical white glow on hover
      } else {
        ctx.strokeStyle = colors.staticWhite;
        ctx.lineWidth = 0.5;
      }

      const { type, coordinates } = feature.geometry;

      const drawRing = (ring) => {
        ctx.beginPath();
        ring.forEach((c, i) => {
          const x = (c[0] + 180) * (width / 360);
          const y = (90 - c[1]) * (height / 180);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
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

    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      let offsetX = 15;
      let offsetY = 15;

      if (x + tooltipRect.width + 20 > rect.width) offsetX = -(tooltipRect.width + 15);
      if (y + tooltipRect.height + 20 > rect.height) offsetY = -(tooltipRect.height + 15);
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

    if (found) {
        canvas.style.cursor = 'pointer';
        const iso = found.iso_a3 || found.ISO_A3 || found.iso_3;
        setHoveredCountry({ 
            name: found.name || found.NAME || "UNKNOWN_SECTOR", 
            iso: iso,
            intensity: (conflictData[iso] || 0).toFixed(2) 
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
          <div>HOTSPOT_INDEX: <span style={{color: hoveredCountry.intensity >= 90 ? 'var(--accent)' : 'var(--secondary)'}}>{hoveredCountry.intensity}%</span></div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;