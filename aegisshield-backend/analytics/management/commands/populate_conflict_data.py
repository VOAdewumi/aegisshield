import csv
import logging
import os
import pandas as pd
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction
from analytics.models import ConflictRecord
from analytics.logic import calculate_weekly_intensity, calculate_hotspot_intensity


BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
LOG_DIR = BASE_DIR / 'logs'

# Ensure directory exists across different OS permissions
LOG_DIR.mkdir(parents=True, exist_ok=True)

LOG_FILE = LOG_DIR / 'data_processing_errors.log'

logging.basicConfig(
    filename=str(LOG_FILE),
    filemode='a',
    level=logging.ERROR,
    format='%(asctime)s - LINE %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

class Command(BaseCommand):
    help = 'Atomic, OS-agnostic ETL process with automated Pandas sorting'

    def handle(self, *args, **kwargs):
        # --- PHASE 0: DYNAMIC FILE PREPARATION ---
        # Define paths using pathlib for cross-platform compatibility
        raw_file_path = BASE_DIR / 'sample/Aegis_Global_Master_Data_Fixed.csv'
        sorted_file_path = BASE_DIR / 'sample/Sorted_Aegis_Data.csv'
        
        if not raw_file_path.exists():
            self.stdout.write(self.style.ERROR(f"Source file not found at: {raw_file_path}"))
            return

        self.stdout.write("Sorting data for time-series accuracy (ISO_REF & TIMESTAMP)...")
        try:
            # Memory-efficient reading for large files in production
            df = pd.read_csv(raw_file_path)
            # Sorting by Country Code then ISO-standard Timestamp
            df.sort_values(by=['ISO_REF', 'TIMESTAMP'], inplace=True)
            df.to_csv(sorted_file_path, index=False)
            self.stdout.write(self.style.SUCCESS("Sorting complete. Moving to Transformation phase."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Sorting failed: {e}"))
            return

        # --- PHASE 1: INITIALIZATION ---
        batch_limit = 5000
        objs = []
        country_memory = {} # Maintains H_t-1 state per country
        
        # --- PHASE 2: EXTRACTION & TRANSFORMATION ---
        with open(sorted_file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row_id, row in enumerate(reader):
                current_line = row_id + 2 # Header is line 1
                
                try:
                    # Data Cleaning - Standardized to match CSV Headers from screenshot
                    raw_cases = row.get('INCIDENTS_COUNT', '0').strip()
                    raw_fatalities = row.get('FATALITIES', '0').strip()
                    
                    cases = int(raw_cases) if raw_cases else 0
                    fatalities = int(raw_fatalities) if raw_fatalities else 0
                    
                    iso_code = row['ISO_REF']
                    threat_type = row.get('THREAT_TYPE', 'Unknown')
                    confidence = float(row.get('CONFIDENCE_LEVEL', 1.0))
                    report_date = row['TIMESTAMP']

                    # Logic/Math Step using your logic.py definitions
                    previous_hotspot = country_memory.get(iso_code, 0.0)
                    
                    intensity_index = calculate_weekly_intensity(
                        cases, 
                        fatalities, 
                        threat_type, 
                        confidence
                    )
                    
                    hotspot_intensity = calculate_hotspot_intensity(
                        intensity_index, 
                        previous_hotspot
                    )

                    # Update State Memory for the next time-series iteration
                    country_memory[iso_code] = hotspot_intensity

                    # Stage for Loading (Matches your Django Model)
                    record = ConflictRecord(
                                timestamp=report_date,         # Matches model
                                year=int(row['YEAR']),         # Extracting year from CSV
                                country_name=row['COUNTRY_NAME'], 
                                iso_ref=iso_code,              # Matches model
                                continent=row['CONTINENT'],
                                incidents_count=cases,         # Matches model
                                fatalities=fatalities,
                                threat_type=threat_type,
                                intel_confidence=confidence,   # Matches model
                                intensity_index=intensity_index,
                                hotspot_score=hotspot_intensity # Matches model
                            )
                    objs.append(record)

                    # --- PHASE 3: ATOMIC BATCH LOADING ---
                    if len(objs) >= batch_limit:
                        self.commit_batch(objs, batch_limit, current_line)
                        objs = [] # Release memory buffer

                except (ValueError, KeyError) as e:
                    logging.error(f"{current_line} | DATA ERROR: {str(e)} | ROW: {row}")
                    self.stdout.write(self.style.WARNING(f"Skipping line {current_line}: Data mismatch."))
                    continue
                
                except Exception as e:
                    logging.error(f"{current_line} | UNEXPECTED: {str(e)}")
                    continue

            # Handle remaining records after the loop
            if objs:
                self.commit_batch(objs, batch_limit, "FINAL")

        self.stdout.write(self.style.SUCCESS("ETL Process successfully completed on current OS."))

    def commit_batch(self, objs, batch_size, line_info):
        """
        Helper to execute the database transaction atomically.
        """
        try:
            with transaction.atomic():
                ConflictRecord.objects.bulk_create(objs, batch_size=batch_size)
            self.stdout.write(f"Committed batch successfully at line {line_info}")
        except Exception as e:
            logging.critical(f"DATABASE FAILURE at line {line_info}: {str(e)}")
            self.stdout.write(self.style.ERROR(f"Batch {line_info} failed to load. Check logs."))