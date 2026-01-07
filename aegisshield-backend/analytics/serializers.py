from rest_framework import serializers
from .models import ConflictRecord

class ConflictRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConflictRecord
        # We list the exact fields we want to expose to the frontend
        fields = [
            'id', 
            'timestamp', 
            'year', 
            'country_name', 
            'iso_ref', 
            'continent', 
            'incidents_count', 
            'fatalities', 
            'threat_type', 
            'intel_confidence', 
            'intensity_index', 
            'hotspot_score'
        ]