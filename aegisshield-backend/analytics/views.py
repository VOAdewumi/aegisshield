from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Max
from .models import ConflictRecord
from .serializers import ConflictRecordSerializer

# --- CUSTOM PAGINATION ---
class StandardResultsSetPagination(PageNumberPagination):
    """
    Limits the amount of data sent per request to protect 
    the frontend from 500k+ rows of JSON.
    """
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

# --- VIEWSET LOGIC ---
class ConflictRecordViewSet(viewsets.ReadOnlyModelViewSet):
    """
    The 'Brain' of the API:
    - Provides a searchable list of all conflict data.
    - Provides a 'latest' snapshot endpoint for the React Map.
    - Uses ReadOnly to prevent accidental data modification.
    """
    queryset = ConflictRecord.objects.all().order_by('-timestamp')
    serializer_class = ConflictRecordSerializer
    pagination_class = StandardResultsSetPagination
    
    # Enables filtering via URL: /api/v1/analytics/records/?search=AFG
    filter_backends = [filters.SearchFilter]
    search_fields = ['iso_ref', 'country_name', 'continent', 'year']

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """
        URL: /api/v1/analytics/records/latest/
        Returns only the most recent week of data globally.
        Used for the initial 'State of the World' map view.
        """
        try:
            # 1. Identify the most recent date in the database
            latest_date = ConflictRecord.objects.aggregate(Max('timestamp'))['timestamp__max']
            
            if not latest_date:
                return Response(
                    {"message": "No data found in database."}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # 2. Fetch all records for that specific date
            # This is highly efficient due to the database index on 'timestamp'
            latest_data = ConflictRecord.objects.filter(timestamp=latest_date)
            
            # 3. Serialize and return (No pagination needed for ~200 countries)
            serializer = self.get_serializer(latest_data, many=True)
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )