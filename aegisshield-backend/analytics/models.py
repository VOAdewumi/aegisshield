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
    
    # Calculated Index (Stored for performance)
    intensity_index = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.country_name} ({self.year}) - {self.threat_type}"

    class Meta:
        indexes = [
            models.Index(fields=['year', 'iso_ref']),
            models.Index(fields=['continent']),
        ]