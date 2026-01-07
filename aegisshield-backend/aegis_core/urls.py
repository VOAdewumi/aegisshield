"""
URL configuration for aegis_core project.
"""
from django.contrib import admin
from django.urls import path, include # Added include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # This links the project to your analytics app URLs
    # Every URL inside analytics/urls.py will now be prefixed with this path
    path('api/v1/analytics/', include('analytics.urls')),
]