# analytics/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConflictRecordViewSet

router = DefaultRouter()
# Registering the viewset with a basename
router.register(r'records', ConflictRecordViewSet, basename='conflictrecord')

urlpatterns = [
    path('', include(router.urls)),
]