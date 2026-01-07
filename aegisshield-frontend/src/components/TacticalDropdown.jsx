import React, { useState, useRef, useEffect } from 'react';

const TacticalDropdown = ({ label, options, value, onChange, isDisabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="tactical-dropdown-container" ref={dropdownRef} style={{ position: 'relative', minWidth: '200px', opacity: isDisabled ? 0.5 : 1 }}>
      <label style={{ 
        display: 'block', 
        fontSize: '0.65rem', 
        color: 'var(--secondary)', 
        marginBottom: '5px',
        fontFamily: 'var(--font-data)',
        letterSpacing: '1px'
      }}>
        {label}_AXIS
      </label>
      
      <div 
        className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          padding: '0.8rem 1rem',
          borderRadius: '4px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-data)',
          fontSize: '0.8rem',
          color: 'var(--text-main)',
          transition: 'all 0.3s ease',
          borderLeft: isOpen ? '2px solid var(--secondary)' : '1px solid var(--border-subtle)'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value || 'GLOBAL_VIEW'}
        </span>
        <span style={{ 
          fontSize: '0.6rem', 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          marginLeft: '10px'
        }}>▼</span>
      </div>

      {isOpen && (
        <ul className="custom-scrollbar" style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          listStyle: 'none',
          padding: '0.5rem 0',
          zIndex: 2000,
          boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
          maxHeight: '300px',
          overflowY: 'auto',
          borderTop: '2px solid var(--secondary)'
        }}>
          {options.map((opt) => (
            <li 
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              style={{
                padding: '0.7rem 1rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-data)',
                fontSize: '0.75rem',
                color: value === opt ? 'var(--secondary)' : 'var(--text-main)',
                background: value === opt ? 'var(--bg-hover)' : 'transparent',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.target.style.background = value === opt ? 'var(--bg-hover)' : 'transparent'}
            >
              {opt.toUpperCase()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TacticalDropdown;