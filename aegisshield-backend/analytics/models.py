# models.py
from django.db import models
import math

class ConflictRecord(models.Model):
    timestamp = models.DateField()
    year = models.IntegerField(db_index=True) # Indexed for fast dropdown filtering
    country_name = models.CharField(max_length=100)
    iso_ref = models.CharField(max_length=3, db_index=True)
    continent = models.CharField(max_length=50, db_index=True)
    incidents_count = models.IntegerField()
    fatalities = models.IntegerField()
    threat_type = models.CharField(max_length=50)
    intel_confidence = models.FloatField()
    hotspot_score = models.FloatField(null=True, blank=True)
    
    # Calculated Index (Stored for performance)
    intensity_index = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.iso_ref} | {self.timestamp} | Hotspot: {self.hotspot_score}"

    class Meta:
        indexes = [
            models.Index(fields=['timestamp', 'iso_ref']), # Optimized for time-series lookups
            models.Index(fields=['continent']),
            models.Index(fields=['year', 'iso_ref']),
        ]