import React, { useState, useEffect } from 'react';
import WorldMap from '../components/WorldMap';
import TacticalDropdown from '../components/TacticalDropdown';

const Dashboard = () => {
  // 1. Filter States
  const [filters, setFilters] = useState({
    year: '2026',
    continent: 'GLOBAL',
    country: 'ALL_COUNTRIES'
  });

  // 2. Data State
  const [conflictData, setConflictData] = useState({});
  const [loading, setLoading] = useState(false);

  // 3. Backend Integration
  useEffect(() => {
    const fetchHotspotData = async () => {
      setLoading(true);
      try {
        // Constructing the URL dynamically based on filters
        // If 'GLOBAL' or 'ALL_COUNTRIES' is selected, we use the 'latest' snapshot endpoint
        let url = 'http://127.0.0.1:8000/api/v1/analytics/records/latest/';
        
        // If a specific year or country is selected, we use the filtering endpoint
        if (filters.year !== '2026' || filters.country !== 'ALL_COUNTRIES') {
            url = `http://127.0.0.1:8000/api/v1/analytics/records/?year=${filters.year}`;
            if (filters.country !== 'ALL_COUNTRIES') {
                url += `&search=${filters.country}`;
            }
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("NETWORK_RESPONSE_NOT_OK");
        
        const result = await response.json();
        
        // Handle DRF Pagination (if result comes as an object with a 'results' array)
        const dataArray = result.results ? result.results : result;

        // 4. Transform Array to Mapping Object for the Map Component
        // Goal: { "AFG": 75.2, "NGA": 88.1, ... }
        const mappedData = {};
        dataArray.forEach(record => {
          mappedData[record.iso_ref] = record.hotspot_score;
        });

        setConflictData(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("INTEL_FETCH_FAILURE", error);
        setLoading(false);
      }
    };

    fetchHotspotData();
  }, [filters]); // Re-runs whenever dropdowns change

  const updateFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  const countries = ['ALL_COUNTRIES', 'AFG', 'NGA', 'USA', 'UKR', 'RUS', 'ISR', 'CHN'];
  const continents = ['GLOBAL', 'North America', 'South America', 'Europe', 'Africa', 'Asia', 'Oceania'];

  return (
    <div className="dashboard-view content-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>Global Conflict Hotspots</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Live regional intensity tracking powered by <span style={{ color: 'var(--secondary)' }}>AegisShield</span>.
            {loading && <span style={{ marginLeft: '1rem', color: 'var(--warning)', fontFamily: 'var(--font-data)', fontSize: '0.8rem' }}>[ SYNCING_WITH_BACKEND... ]</span>}
          </p>
        </div>
        
        <div className="filter-bar" style={{ display: 'flex', gap: '1rem' }}>
          <TacticalDropdown 
            label="TEMPORAL" 
            options={['2024', '2025', '2026']} 
            value={filters.year} 
            onChange={(v) => updateFilter('year', v)} 
          />
          <TacticalDropdown 
            label="REGION" 
            options={continents} 
            value={filters.continent} 
            onChange={(v) => updateFilter('continent', v)} 
          />
          <TacticalDropdown 
            label="COUNTRY" 
            options={countries} 
            value={filters.country} 
            onChange={(v) => updateFilter('country', v)} 
          />
        </div>
      </header>

      <WorldMap conflictData={conflictData} />

      <div className="grid-dashboard" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>INTEL_REPORTS</h3>
            <h2>System Status</h2>
          </div>
          <div className="card-body">
            <ul className="stats-list" style={{ listStyle: 'none' }}>
               <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                 <span>ACTIVE_FILTER:</span> 
                 <span style={{ color: 'var(--secondary)' }}>{filters.country}</span>
               </li>
               <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                 <span>DATABASE_SYNC:</span> 
                 <span style={{ color: 'var(--success)' }}>CONNECTED</span>
               </li>
               <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                 <span>RECORDS_LOADED:</span> 
                 <span style={{ color: 'var(--text-main)' }}>{Object.keys(conflictData).length} Units</span>
               </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;