from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileViewSet, StorageSummaryView

router = DefaultRouter()
router.register(r'files', FileViewSet)


urlpatterns = [
    # Registering the file routes
    path('', include(router.urls)),
    
    # Adding the custom route for storage-summary
    path('storage-summary/', StorageSummaryView.as_view(), name='storage-summary'),
]