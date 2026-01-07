import React, { useState, useEffect, useMemo } from "react";
import WorldMap from "../components/WorldMap";
import TacticalDropdown from "../components/TacticalDropdown";

const Dashboard = () => {
  // 1. DYNAMIC YEAR GENERATION (1980 - 2026)
  const years = Array.from({ length: 2026 - 1980 + 1 }, (_, i) =>
    String(1980 + i)
  );

  // 2. TACTICAL NAME-TO-ISO DICTIONARY
  // Maps common full names to backend ISO_REF
  const countryNameToISO = {
    AFGHANISTAN: "AFG",
    ALGERIA: "DZA",
    ANGOLA: "AGO",
    ARGENTINA: "ARG",
    ARMENIA: "ARM",
    AUSTRALIA: "AUS",
    AUSTRIA: "AUT",
    AZERBAIJAN: "AZE",
    BAHAMAS: "BHS",
    BAHRAIN: "BHR",
    BANGLADESH: "BGD",
    BARBADOS: "BRB",
    BELARUS: "BLR",
    BELGIUM: "BEL",
    BELIZE: "BLZ",
    BENIN: "BEN",
    BHUTAN: "BTN",
    BOLIVIA: "BOL",
    "BOSNIA AND HERZEGOVINA": "BIH",
    BOTSWANA: "BWA",
    BRAZIL: "BRA",
    BRUNEI: "BRN",
    BULGARIA: "BGR",
    "BURKINA FASO": "BFA",
    BURUNDI: "BDI",
    CAMBODIA: "KHM",
    CAMEROON: "CMR",
    CANADA: "CAN",
    "CAPE VERDE": "CPV",
    "CENTRAL AFRICAN REPUBLIC": "CAF",
    CHAD: "TCD",
    CHILE: "CHL",
    CHINA: "CHN",
    COLOMBIA: "COL",
    COMOROS: "COM",
    CONGO: "COG",
    "DEMOCRATIC REPUBLIC OF THE CONGO": "COD",
    "COSTA RICA": "CRI",
    "COTE D'IVOIRE": "CIV",
    CROATIA: "HRV",
    CUBA: "CUB",
    CYPRUS: "CYP",
    CZECHIA: "CZE",
    DENMARK: "DNK",
    DJIBOUTI: "DJI",
    DOMINICA: "DMA",
    "DOMINICAN REPUBLIC": "DOM",
    ECUADOR: "ECU",
    EGYPT: "EGY",
    "EL SALVADOR": "SLV",
    "EQUATORIAL GUINEA": "GNQ",
    ERITREA: "ERI",
    ESTONIA: "EST",
    ESWATINI: "SWZ",
    ETHIOPIA: "ETH",
    FIJI: "FJI",
    FINLAND: "FIN",
    FRANCE: "FRA",
    GABON: "GAB",
    GAMBIA: "GMB",
    GEORGIA: "GEO",
    GERMANY: "DEU",
    GHANA: "GHA",
    GREECE: "GRC",
    GRENADA: "GRD",
    GUATEMALA: "GTM",
    GUINEA: "GIN",
    "GUINEA-BISSAU": "GNB",
    GUYANA: "GUY",
    HAITI: "HTI",
    HONDURAS: "HND",
    "HONG KONG": "HKG",
    HUNGARY: "HUN",
    ICELAND: "ISL",
    INDIA: "IND",
    INDONESIA: "IDN",
    IRAN: "IRN",
    IRAQ: "IRQ",
    IRELAND: "IRL",
    ISRAEL: "ISR",
    ITALY: "ITA",
    JAMAICA: "JAM",
    JAPAN: "JPN",
    JORDAN: "JOR",
    KAZAKHSTAN: "KAZ",
    KENYA: "KEN",
    KIRIBATI: "KIR",
    KUWAIT: "KWT",
    KYRGYZSTAN: "KGZ",
    LAOS: "LAO",
    LATVIA: "LVA",
    LEBANON: "LBN",
    LESOTHO: "LSO",
    LIBERIA: "LBR",
    LIBYA: "LBY",
    LIECHTENSTEIN: "LIE",
    LITHUANIA: "LTU",
    LUXEMBOURG: "LUX",
    MACAU: "MAC",
    MADAGASCAR: "MDG",
    MALAWI: "MWI",
    MALAYSIA: "MYS",
    MALDIVES: "MDV",
    MALI: "MLI",
    MALTA: "MLT",
    "MARSHALL ISLANDS": "MHL",
    MAURITANIA: "MRT",
    MAURITIUS: "MUS",
    MEXICO: "MEX",
    MICRONESIA: "FSM",
    MOLDOVA: "MDA",
    MONACO: "MCO",
    MONGOLIA: "MNG",
    MONTENEGRO: "MNE",
    MOROCCO: "MAR",
    MOZAMBIQUE: "MOZ",
    MYANMAR: "MMR",
    NAMIBIA: "NAM",
    NAURU: "NRU",
    NEPAL: "NPL",
    NETHERLANDS: "NLD",
    "NEW ZEALAND": "NZL",
    NICARAGUA: "NIC",
    NIGER: "NER",
    NIGERIA: "NGA",
    "NORTH KOREA": "PRK",
    "NORTH MACEDONIA": "MKD",
    NORWAY: "NOR",
    OMAN: "OMN",
    PAKISTAN: "PAK",
    PALAU: "PLW",
    PALESTINE: "PSE",
    PANAMA: "PAN",
    "PAPUA NEW GUINEA": "PNG",
    PARAGUAY: "PRY",
    PERU: "PER",
    PHILIPPINES: "PHL",
    POLAND: "POL",
    PORTUGAL: "PRT",
    "PUERTO RICO": "PRI",
    QATAR: "QAT",
    ROMANIA: "ROU",
    RUSSIA: "RUS",
    RWANDA: "RWA",
    SAMOA: "WSM",
    "SAN MARINO": "SMR",
    "SAO TOME AND PRINCIPE": "STP",
    "SAUDI ARABIA": "SAU",
    SENEGAL: "SEN",
    SERBIA: "SRB",
    SEYCHELLES: "SYC",
    "SIERRA LEONE": "SLE",
    SINGAPORE: "SGP",
    SLOVAKIA: "SVK",
    SLOVENIA: "SVN",
    "SOLOMON ISLANDS": "SLB",
    SOMALIA: "SOM",
    "SOUTH AFRICA": "ZAF",
    "SOUTH KOREA": "KOR",
    "SOUTH SUDAN": "SSD",
    SPAIN: "ESP",
    "SRI LANKA": "LKA",
    SUDAN: "SDN",
    SURINAME: "SUR",
    SWEDEN: "SWE",
    SWITZERLAND: "CHE",
    SYRIA: "SYR",
    TAIWAN: "TWN",
    TAJIKISTAN: "TJK",
    TANZANIA: "TZA",
    THAILAND: "THA",
    "TIMOR-LESTE": "TLS",
    TOGO: "TGO",
    TONGA: "TON",
    "TRINIDAD AND TOBAGO": "TTO",
    TUNISIA: "TUN",
    TURKEY: "TUR",
    TURKMENISTAN: "TKM",
    TUVALU: "TUV",
    UGANDA: "UGA",
    UKRAINE: "UKR",
    "UNITED ARAB EMIRATES": "ARE",
    "UNITED KINGDOM": "GBR",
    "UNITED STATES": "USA",
    URUGUAY: "URY",
    UZBEKISTAN: "UZB",
    VANUATU: "VUT",
    "VATICAN CITY": "VAT",
    VENEZUELA: "VEN",
    VIETNAM: "VNM",
    YEMEN: "YEM",
    ZAMBIA: "ZMB",
    ZIMBABWE: "ZWE",
  };

  const regionCountryMap = {
    GLOBAL: ["ALL_COUNTRIES"],
    AFRICA: [
      "ALL_COUNTRIES",
      "DZA",
      "AGO",
      "BEN",
      "BWA",
      "BFA",
      "BDI",
      "CPV",
      "CMR",
      "CAF",
      "TCD",
      "COM",
      "COD",
      "COG",
      "CIV",
      "DJI",
      "EGY",
      "GNQ",
      "ERI",
      "SWZ",
      "ETH",
      "GAB",
      "GMB",
      "GHA",
      "GIN",
      "GNB",
      "KEN",
      "LSO",
      "LBR",
      "LBY",
      "MDG",
      "MWI",
      "MLI",
      "MRT",
      "MUS",
      "MAR",
      "MOZ",
      "NAM",
      "NER",
      "NGA",
      "RWA",
      "STP",
      "SEN",
      "SYC",
      "SLE",
      "SOM",
      "ZAF",
      "SSD",
      "SDN",
      "TZA",
      "TGO",
      "TUN",
      "UGA",
      "ZMB",
      "ZWE",
    ],
    ASIA: [
      "ALL_COUNTRIES",
      "AFG",
      "ARM",
      "AZE",
      "BHR",
      "BGD",
      "BTN",
      "BRN",
      "KHM",
      "CHN",
      "CYP",
      "GEO",
      "IND",
      "IDN",
      "IRN",
      "IRQ",
      "ISR",
      "JPN",
      "JOR",
      "KAZ",
      "KWT",
      "KGZ",
      "LAO",
      "LBN",
      "MYS",
      "MDV",
      "MNG",
      "MMR",
      "NPL",
      "PRK",
      "OMN",
      "PAK",
      "PHL",
      "QAT",
      "SAU",
      "SGP",
      "KOR",
      "LKA",
      "SYR",
      "TWN",
      "TJK",
      "THA",
      "TLS",
      "TUR",
      "TKM",
      "ARE",
      "UZB",
      "VNM",
      "YEM",
    ],
    EUROPE: [
      "ALL_COUNTRIES",
      "ALB",
      "AND",
      "AUT",
      "BLR",
      "BEL",
      "BIH",
      "BGR",
      "HRV",
      "CZE",
      "DNK",
      "EST",
      "FIN",
      "FRA",
      "DEU",
      "GRC",
      "HUN",
      "ISL",
      "IRL",
      "ITA",
      "LVA",
      "LIE",
      "LTU",
      "LUX",
      "MLT",
      "MDA",
      "MCO",
      "MNE",
      "NLD",
      "MKD",
      "NOR",
      "POL",
      "PRT",
      "ROU",
      "RUS",
      "SMR",
      "SRB",
      "SVK",
      "SVN",
      "ESP",
      "SWE",
      "CHE",
      "UKR",
      "GBR",
      "VAT",
    ],
    NORTH_AMERICA: [
      "ALL_COUNTRIES",
      "ATG",
      "BHS",
      "BRB",
      "BLZ",
      "CAN",
      "CRI",
      "CUB",
      "DMA",
      "DOM",
      "SLV",
      "GRD",
      "GTM",
      "HTI",
      "HND",
      "JAM",
      "MEX",
      "NIC",
      "PAN",
      "KNA",
      "LCA",
      "VCT",
      "TTO",
      "USA",
    ],
    SOUTH_AMERICA: [
      "ALL_COUNTRIES",
      "ARG",
      "BOL",
      "BRA",
      "CHL",
      "COL",
      "ECU",
      "GUY",
      "PRY",
      "PER",
      "SUR",
      "URY",
      "VEN",
    ],
    OCEANIA: [
      "ALL_COUNTRIES",
      "AUS",
      "FJI",
      "KIR",
      "MHL",
      "FSM",
      "NRU",
      "NZL",
      "PLW",
      "PNG",
      "WSM",
      "SLB",
      "TON",
      "TUV",
      "VUT",
    ],
    GLOBAL_TERRITORIES: [
      "ALL_COUNTRIES",
      "ALA",
      "ASM",
      "ABW",
      "BES",
      "BMU",
      "BVT",
      "IOT",
      "VGB",
      "CYM",
      "CCK",
      "COK",
      "CUW",
      "FLK",
      "FRO",
      "GUF",
      "PYF",
      "GIB",
      "G Greenland",
      "GLP",
      "GUM",
      "HKG",
      "IMN",
      "MAC",
      "MTQ",
      "MYT",
      "MSR",
      "NCL",
      "NIU",
      "NFK",
      "MNP",
      "PCN",
      "PRI",
      "REU",
      "BLM",
      "SHN",
      "MAF",
      "SPM",
      "SGS",
      "SJM",
      "TWN",
      "TKL",
      "UMI",
      "VIR",
      "WLF",
    ],
  };

  // 3. FILTER STATES
  const [filters, setFilters] = useState({
    year: "2026",
    continent: "GLOBAL",
    country: "ALL_COUNTRIES",
    searchTerm: "",
  });

  const [conflictData, setConflictData] = useState({});
  const [loading, setLoading] = useState(false);

  // RESOLVE VECTOR: Single Source of Truth for Search and Dropdown Filter
  const resolvedVector = useMemo(() => {
    // If a specific country is chosen in the dropdown, use it
    if (filters.country !== "ALL_COUNTRIES") return filters.country;

    // Otherwise, check if the search term matches a full country name or a 3-letter ISO
    const key = filters.searchTerm.trim().toUpperCase();
    return countryNameToISO[key] || (key.length === 3 ? key : "");
  }, [filters.country, filters.searchTerm]);

  const countryOptions = useMemo(
    () => regionCountryMap[filters.continent] || ["ALL_COUNTRIES"],
    [filters.continent]
  );

  // 4. BACKEND SYNC WITH INTEGRATED SEARCH/FILTERS
  // useEffect(() => {
  //   const fetchIntel = async () => {
  //     setLoading(true);
  //     try {
  //       let url = "http://127.0.0.1:8000/api/v1/analytics/records/latest/";

  //       // If the user has changed any default filter, we switch to the filtered endpoint
  //       const isDefault =
  //         filters.year === "2026" &&
  //         filters.continent === "GLOBAL" &&
  //         filters.country === "ALL_COUNTRIES" &&
  //         !filters.searchTerm;

  //       if (!isDefault) {
  //         url = `http://127.0.0.1:8000/api/v1/analytics/records/?year=${filters.year}`;

  //         if (resolvedVector) {
  //           url += `&iso_ref=${resolvedVector}`;
  //         } else if (filters.continent !== "GLOBAL") {
  //           url += `&continent=${filters.continent}`;
  //         }

  //         if (filters.searchTerm && !resolvedVector) {
  //           url += `&search=${filters.searchTerm}`;
  //         }
  //       }

  //       const res = await fetch(url);
  //       const json = await res.json();
  //       const dataArray = json.results ? json.results : json;

  //       const mapped = {};
  //       dataArray.forEach((r) => (mapped[r.iso_ref] = r.hotspot_score));
  //       setConflictData(mapped);
  //       setLoading(false);
  //     } catch (e) {
  //       console.error("INTEL_FAILURE", e);
  //       setLoading(false);
  //     }
  //   };
  //   fetchIntel();
  // }, [filters, resolvedVector]);

  useEffect(() => {
    const fetchHotspotData = async () => {
      setLoading(true);
      try {
        // 1. Determine base endpoint
        let url = "http://127.0.0.1:8000/api/v1/analytics/records/";

        // 2. Build Query Parameters
        // We ONLY use /latest/ if the user hasn't selected a specific year/search
        const isDefault =
          filters.year === "2026" &&
          filters.country === "ALL_COUNTRIES" &&
          !filters.searchTerm;

        if (isDefault) {
          url += "latest/";
        } else {
          // Construct standard query string for exact backend filtering
          const params = new URLSearchParams();
          if (filters.year) params.append("year", filters.year);
          if (resolvedVector) params.append("iso_ref", resolvedVector);
          if (filters.continent !== "GLOBAL")
            params.append("continent", filters.continent);

          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const result = await response.json();

        // 3. Handle Paginated Response
        // Your screenshot shows the response has a "results" key
        const dataArray = result.results ? result.results : result;

        const mappedData = {};
        dataArray.forEach((record) => {
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
  }, [filters, resolvedVector]);

  const updateFilter = (key, val) => {
    setFilters((prev) => ({
      ...prev,
      [key]: val,
      ...(key === "continent" ? { country: "ALL_COUNTRIES" } : {}),
    }));
  };

  return (
    <div className="dashboard-view content-container">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "3rem", margin: 0 }}>
            Global Conflict Hotspots
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              marginTop: "0.5rem",
            }}
          >
            AegisShield Intelligence Vector [{" "}
            {loading ? "SYNCING..." : "STABLE"} ]
          </p>
        </div>

        <div
          className="filter-bar"
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
        >
          {/* Tactical Search Field integrated with Filters */}
          <div className="tactical-dropdown-container">
            <p
              style={{
                display: "block",
                fontSize: "0.65rem",
                color: "var(--secondary)",
                marginBottom: "5px",
                fontFamily: "var(--font-data)",
                letterSpacing: "1px",
              }}
            >
              SEARCH
            </p>
            <input
              type="text"
              placeholder="NAME_OR_ISO..."
              className="tactical-input"
              value={filters.searchTerm}
              onChange={(e) => updateFilter("searchTerm", e.target.value)}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                padding: "0.8rem 1rem",
                borderRadius: "4px",
                color: "var(--text-main)",
                fontFamily: "var(--font-data)",
                fontSize: "0.8rem",
                width: "180px",
              }}
            />
          </div>

          <TacticalDropdown
            label="YEAR"
            options={years}
            value={filters.year}
            onChange={(v) => updateFilter("year", v)}
          />
          <TacticalDropdown
            label="REGION"
            options={Object.keys(regionCountryMap)}
            value={filters.continent}
            onChange={(v) => updateFilter("continent", v)}
          />
          <TacticalDropdown
            label="COUNTRY"
            options={countryOptions}
            value={filters.country}
            onChange={(v) => updateFilter("country", v)}
          />
          <div className="tactical-dropdown-container">
            <p
              style={{
                display: "block",
                fontSize: "0.65rem",
                color: "var(--secondary)",
                marginBottom: "5px",
                fontFamily: "var(--font-data)",
                letterSpacing: "1px",
              }}
            >
              RESET FILTER
            </p>
            <button
              onClick={() =>
                setFilters({
                  year: "2026",
                  continent: "GLOBAL",
                  country: "ALL_COUNTRIES",
                  searchTerm: "",
                })
              }
              style={{
                padding: "0.8rem",
                width: "100%",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                background: "transparent",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "var(--font-data)",
                fontSize: "0.7rem",
              }}
            >
              RESET
            </button>
          </div>
        </div>
      </header>

      <WorldMap
        conflictData={conflictData}
        selectedCountry={resolvedVector || "ALL_COUNTRIES"}
      />
    </div>
  );
};

export default Dashboard;
