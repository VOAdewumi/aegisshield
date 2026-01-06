import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# ISO codes and Regions matching your world-map.json properties
geo_structure = {
    'AFG': 'Asia', 'UKR': 'Europe', 'MMR': 'Asia', 'SDN': 'Africa', 
    'COD': 'Africa', 'SYR': 'Middle East', 'YEM': 'Middle East', 
    'COL': 'Americas', 'NGA': 'Africa', 'MLI': 'Africa', 
    'USA': 'Americas', 'CHN': 'Asia', 'RUS': 'Europe'
}

data = []
start_date = datetime(1970, 1, 1)
end_date = datetime(2026, 1, 1)
total_days = (end_date - start_date).days

print(f"Generating ~{len(geo_structure) * total_days} records. Please wait...")

for iso, region in geo_structure.items():
    # Start each country with a random initial state
    current_intensity = np.random.uniform(5, 50)
    
    for day in range(total_days):
        curr_date = start_date + timedelta(days=day)
        
        # 'Very Random' logic: Random Walk with Mean Reversion
        # This prevents the data from just being flat lines
        change = np.random.normal(0, 2) 
        current_intensity += change
        
        # Keep within logical bounds 0-100
        current_intensity = max(0, min(100, current_intensity))
        
        # Only record a "Case" entry every few days or randomly to simulate 
        # real-world reported incidents rather than constant streams
        if np.random.random() > 0.7: 
            data.append({
                'date': curr_date.strftime('%Y-%m-%d'),
                'year': curr_date.year,
                'iso_code': iso,
                'region': region,
                'intensity_score': round(current_intensity, 2),
                'conflict_type': np.random.choice(['Interstate', 'Civil', 'Coup', 'Riot', 'Terrorism']),
                'fatalities': int(current_intensity * np.random.uniform(0, 5)),
                'reliability_index': round(np.random.uniform(0.6, 0.99), 2)
            })

df = pd.DataFrame(data)
df.to_excel('aegis_master_dataset.xlsx', index=False)
print(f"Success! Generated {len(df)} records in 'aegis_master_dataset.xlsx'")