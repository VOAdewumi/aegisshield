import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Accurate ISO3 to Continent mapping
CONTINENT_MAPPING = {
    # Africa
    'DZA': 'Africa', 'AGO': 'Africa', 'BEN': 'Africa', 'BWA': 'Africa', 'BFA': 'Africa', 'BDI': 'Africa',
    'CPV': 'Africa', 'CMR': 'Africa', 'CAF': 'Africa', 'TCD': 'Africa', 'COM': 'Africa', 'COG': 'Africa',
    'COD': 'Africa', 'DJI': 'Africa', 'EGY': 'Africa', 'GNQ': 'Africa', 'ERI': 'Africa', 'ETH': 'Africa',
    'GAB': 'Africa', 'GMB': 'Africa', 'GHA': 'Africa', 'GIN': 'Africa', 'GNB': 'Africa', 'CIV': 'Africa',
    'KEN': 'Africa', 'LSO': 'Africa', 'LBR': 'Africa', 'LBY': 'Africa', 'MDG': 'Africa', 'MWI': 'Africa',
    'MLI': 'Africa', 'MRT': 'Africa', 'MUS': 'Africa', 'MAR': 'Africa', 'MOZ': 'Africa', 'NAM': 'Africa',
    'NER': 'Africa', 'NGA': 'Africa', 'RWA': 'Africa', 'STP': 'Africa', 'SEN': 'Africa', 'SYC': 'Africa',
    'SLE': 'Africa', 'SOM': 'Africa', 'ZAF': 'Africa', 'SSD': 'Africa', 'SDN': 'Africa', 'SWZ': 'Africa',
    'TZA': 'Africa', 'TGO': 'Africa', 'TUN': 'Africa', 'UGA': 'Africa', 'ZMB': 'Africa', 'ZWE': 'Africa',
    # Asia
    'AFG': 'Asia', 'ARM': 'Asia', 'AZE': 'Asia', 'BHR': 'Asia', 'BGD': 'Asia', 'BTN': 'Asia', 'BRN': 'Asia',
    'KHM': 'Asia', 'CHN': 'Asia', 'CYP': 'Asia', 'GEO': 'Asia', 'IND': 'Asia', 'IDN': 'Asia', 'IRN': 'Asia',
    'IRQ': 'Asia', 'ISR': 'Asia', 'JPN': 'Asia', 'JOR': 'Asia', 'KAZ': 'Asia', 'KWT': 'Asia', 'KGZ': 'Asia',
    'LAO': 'Asia', 'LBN': 'Asia', 'MYS': 'Asia', 'MDV': 'Asia', 'MNG': 'Asia', 'MMR': 'Asia', 'NPL': 'Asia',
    'PRK': 'Asia', 'OMN': 'Asia', 'PAK': 'Asia', 'PHL': 'Asia', 'QAT': 'Asia', 'SAU': 'Asia', 'SGP': 'Asia',
    'KOR': 'Asia', 'LKA': 'Asia', 'SYR': 'Asia', 'TJK': 'Asia', 'THA': 'Asia', 'TLS': 'Asia', 'TUR': 'Asia',
    'TKM': 'Asia', 'ARE': 'Asia', 'UZB': 'Asia', 'VNM': 'Asia', 'YEM': 'Asia', 'TWN': 'Asia', 'HKG': 'Asia', 'MAC': 'Asia',
    # Europe
    'ALB': 'Europe', 'AND': 'Europe', 'AUT': 'Europe', 'BLR': 'Europe', 'BEL': 'Europe', 'BIH': 'Europe',
    'BGR': 'Europe', 'HRV': 'Europe', 'CZE': 'Europe', 'DNK': 'Europe', 'EST': 'Europe', 'FIN': 'Europe',
    'FRA': 'Europe', 'DEU': 'Europe', 'GRC': 'Europe', 'HUN': 'Europe', 'ISL': 'Europe', 'IRL': 'Europe',
    'ITA': 'Europe', 'LVA': 'Europe', 'LIE': 'Europe', 'LTU': 'Europe', 'LUX': 'Europe', 'MLT': 'Europe',
    'MDA': 'Europe', 'MCO': 'Europe', 'MNE': 'Europe', 'NLD': 'Europe', 'MKD': 'Europe', 'NOR': 'Europe',
    'POL': 'Europe', 'PRT': 'Europe', 'ROU': 'Europe', 'RUS': 'Europe', 'SMR': 'Europe', 'SRB': 'Europe',
    'SVK': 'Europe', 'SVN': 'Europe', 'ESP': 'Europe', 'SWE': 'Europe', 'CHE': 'Europe', 'UKR': 'Europe',
    'GBR': 'Europe', 'VAT': 'Europe', 'GIB': 'Europe', 'GGY': 'Europe', 'JEY': 'Europe', 'IMN': 'Europe',
    # North America
    'ATG': 'North America', 'BHS': 'North America', 'BRB': 'North America', 'BLZ': 'North America', 'CAN': 'North America',
    'CRI': 'North America', 'CUB': 'North America', 'DMA': 'North America', 'DOM': 'North America', 'SLV': 'North America',
    'GRD': 'North America', 'GTM': 'North America', 'HTI': 'North America', 'HND': 'North America', 'JAM': 'North America',
    'MEX': 'North America', 'NIC': 'North America', 'PAN': 'North America', 'KNA': 'North America', 'LCA': 'North America',
    'VCT': 'North America', 'TTO': 'North America', 'USA': 'North America', 'BMU': 'North America', 'GRL': 'North America',
    'PRI': 'North America', 'VIR': 'North America', 'VGB': 'North America',
    # South America
    'ARG': 'South America', 'BOL': 'South America', 'BRA': 'South America', 'CHL': 'South America', 'COL': 'South America',
    'ECU': 'South America', 'GUY': 'South America', 'PRY': 'South America', 'PER': 'South America', 'SUR': 'South America',
    'URY': 'South America', 'VEN': 'South America', 'FLK': 'South America', 'GUF': 'South America',
    # Oceania
    'AUS': 'Oceania', 'FJI': 'Oceania', 'KIR': 'Oceania', 'MHL': 'Oceania', 'FSM': 'Oceania', 'NRU': 'Oceania',
    'NZL': 'Oceania', 'PLW': 'Oceania', 'PNG': 'Oceania', 'WSM': 'Oceania', 'SLB': 'Oceania', 'TON': 'Oceania',
    'TUV': 'Oceania', 'VUT': 'Oceania', 'ASM': 'Oceania', 'GUM': 'Oceania', 'NCL': 'Oceania', 'PYF': 'Oceania',
}

def generate_tactical_dataset(input_csv):
    print("[SYSTEM] INITIALIZING_FIXED_GEOGRAPHY_GENERATION...")
    
    # 1. Load base data and fix mapping
    try:
        df_base = pd.read_csv(input_csv)
        # Accurate mapping based on ISO3 code
        df_base['CONTINENT'] = df_base['CCA3'].map(CONTINENT_MAPPING).fillna('Global')
        countries_data = df_base[['Name', 'CCA3', 'CONTINENT']].values.tolist()
    except Exception as e:
        print(f"[CRITICAL_ERROR] FAILED_TO_READ_CSV: {e}")
        return

    # 2. Timeline Configuration: 50 Years (1980 - 2026)
    start_date = datetime(1980, 1, 1)
    end_date = datetime(2026, 1, 1)
    threat_types = ['Civil Unrest', 'Insurgency', 'Border Dispute', 'Terrorism', 'Cyber Warfare', 'State Conflict']
    data_list = []
    current_date = start_date
    random.seed(42) # For reproducible results
    
    print("[SYSTEM] GENERATING_RECORDS...")
    while current_date < end_date:
        ts_str = current_date.strftime('%Y-%m-%d')
        year = current_date.year
        for country_name, iso, continent in countries_data:
            # Random selection to hit the 500k target volume
            if random.random() < 0.735:
                incidents = random.randint(0, 200)
                # Raw fatalities logic (to be weighted on backend)
                fatalities = int(incidents * random.uniform(0, 12)) if incidents > 0 else 0
                
                data_list.append({
                    'TIMESTAMP': ts_str,
                    'YEAR': year,
                    'COUNTRY_NAME': country_name,
                    'ISO_REF': iso,
                    'CONTINENT': continent,
                    'INCIDENTS_COUNT': incidents,
                    'FATALITIES': fatalities,
                    'THREAT_TYPE': random.choice(threat_types) if incidents > 0 else 'STABLE',
                    'INTEL_CONFIDENCE': round(random.uniform(0.55, 0.99), 2)
                })
        current_date += timedelta(days=7) # Weekly reporting
        
    df_final = pd.DataFrame(data_list)
    
    # 3. Export Formats
    output_base = 'Aegis_Global_Master_Data_Fixed'
    print(f"[SYSTEM] EXPORTING_FORMATS...")
    df_final.to_csv(f"{output_base}.csv", index=False)
    df_final.to_csv(f"{output_base}.tsv", index=False, sep='\t')
    df_final.to_excel(f"{output_base}.xlsx", index=False)
    
    print(f"--- GENERATION_COMPLETE ---")
    print(f"TOTAL_RECORDS: {len(df_final)}")

if __name__ == "__main__":
    # Ensure countries.csv is in the same directory
    generate_tactical_dataset('countries.csv')