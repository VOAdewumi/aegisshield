import React, { useRef, useEffect, useState } from 'react';
import geoData from '../data/world-map.json';

const WorldMap = ({ conflictData = {}, selectedCountry = 'ALL_COUNTRIES' }) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

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
    const colors = {
      accent: style.getPropertyValue('--accent').trim(), 
      warning: style.getPropertyValue('--warning').trim(), 
      success: style.getPropertyValue('--success').trim(), 
      mapBase: style.getPropertyValue('--map-base').trim(),
      gridLine: style.getPropertyValue('--grid-line').trim(),
      defaultBorder: 'rgba(255, 255, 255, 0.08)'
    };

    ctx.clearRect(0, 0, width, height);

    // GRID RENDERING
    ctx.strokeStyle = colors.gridLine;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < width; i += 45) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 45) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

    geoData.features.forEach(feature => {
      const iso = feature.properties.iso_a3 || feature.properties.ISO_A3;
      const intensity = conflictData[iso] || 0;
      const isHighlighted = iso === highlightId;
      
      // TACTICAL ISOLATION: If a country is selected, others become map-base
      const isSelected = selectedCountry === 'ALL_COUNTRIES' || iso === selectedCountry;

      if (!isSelected) {
        ctx.fillStyle = colors.mapBase;
      } else {
        // Multi-level Color Coding
        if (intensity >= 70) ctx.fillStyle = colors.accent; 
        else if (intensity >= 40) ctx.fillStyle = colors.warning; 
        else ctx.fillStyle = colors.success;
      }

      // STROKE & GLOW EFFECTS
      ctx.shadowBlur = 0;
      if (isHighlighted) {
        ctx.strokeStyle = '#FFFFFF'; 
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFFFFF';
      } else {
        ctx.strokeStyle = isSelected ? 'rgba(255, 255, 255, 0.3)' : colors.defaultBorder;
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

      if (type === "Polygon") coordinates.forEach(drawRing);
      else if (type === "MultiPolygon") coordinates.forEach(p => p.forEach(drawRing));
    });
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // SMART BOUNDS: Ensure tooltip never clips off-screen
    let tx = x + 20;
    let ty = y + 20;
    if (tooltipRef.current) {
      const tw = tooltipRef.current.offsetWidth;
      const th = tooltipRef.current.offsetHeight;
      if (tx + tw > rect.width) tx = x - tw - 20;
      if (ty + th > rect.height) ty = y - th - 20;
    }
    setTooltipPos({ x: tx, y: ty });

    const lon = (x / (rect.width / 360)) - 180;
    const lat = 90 - (y / (rect.height / 180));

    let hit = null;
    for (const f of geoData.features) {
      const { type, coordinates } = f.geometry;
      const match = type === "Polygon" ? isPointInPolygon([lon, lat], coordinates[0]) :
                    coordinates.some(p => isPointInPolygon([lon, lat], p[0]));
      if (match) { hit = f.properties; break; }
    }

    if (hit) {
      const iso = hit.iso_a3 || hit.ISO_A3;
      setHoveredCountry({ name: (hit.name || hit.NAME).toUpperCase(), iso, intensity: (conflictData[iso] || 0).toFixed(2) });
    } else {
      setHoveredCountry(null);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    drawMap(ctx, width, height, hoveredCountry?.iso);
  }, [hoveredCountry, conflictData, selectedCountry]);

  return (
    <div className="map-canvas-wrapper" onMouseMove={handleMouseMove} onMouseLeave={() => setHoveredCountry(null)}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      {hoveredCountry && (
        <div ref={tooltipRef} className="map-tooltip" style={{ position: 'absolute', left: tooltipPos.x, top: tooltipPos.y, pointerEvents: 'none' }}>
          <div className="tooltip-header">{hoveredCountry.name}</div>
          <div>ISO_REF: {hoveredCountry.iso}</div>
          <div>HOTSPOT_INDEX: <span style={{color: hoveredCountry.intensity >= 70 ? 'var(--accent)' : 'var(--warning)'}}>{hoveredCountry.intensity}%</span></div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;