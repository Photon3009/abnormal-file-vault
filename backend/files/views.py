import hashlib
from datetime import datetime
from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import (
    DjangoFilterBackend,
    FilterSet,
    NumberFilter,
    CharFilter,
)
from .models import File
from .serializers import FileSerializer
from rest_framework.views import APIView
from django.db.models import Min


# Create your views here.
def get_file_hash(file_obj):
    hasher = hashlib.sha256()

    # Make sure file has content
    if file_obj.size == 0:
        return "empty_file"

    file_obj.seek(0)  # Move to the start of the file

    # Debug chunks
    chunk_count = 0
    for chunk in file_obj.chunks():
        chunk_count += 1
        hasher.update(chunk)

    file_obj.seek(0)  # Rewind for future use

    hash_result = hasher.hexdigest()

    return hash_result


# Custom filter set for File model
class FileFilter(FilterSet):
    min_size = NumberFilter(field_name="size", lookup_expr="gte")
    max_size = NumberFilter(field_name="size", lookup_expr="lte")
    filename = CharFilter(field_name="original_filename", lookup_expr="icontains")

    class Meta:
        model = File
        fields = [
            "file_type",
            "min_size",
            "max_size",
            "filename",
        ]


class FileViewSet(viewsets.ModelViewSet):
    # Keep a default queryset for DRF URL generation, but it won't be used for actual queries
    queryset = File.objects.all()
    serializer_class = FileSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]  # No OrderingFilter
    filterset_class = FileFilter
    search_fields = ["original_filename"]
    
    def list(self, request, *args, **kwargs):
        """
        Override the list method to completely control the query and response
        """
        # Get the sort parameter
        sort_param = self.request.query_params.get("sort", "desc").lower()
        
        
        # Create queryset with explicit ordering
        if sort_param == "asc":
            queryset = File.objects.all().order_by("uploaded_at")
        else:
            queryset = File.objects.all().order_by("-uploaded_at")
        
        # Apply any filters defined in filter_backends
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)
        
        # Get paginated results
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # Or serialize all results if no pagination
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response(
                {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        file_hash = get_file_hash(file_obj)

        # Check if file with the same hash exists
        existing_file = File.objects.filter(hash=file_hash).first()
        if existing_file:
            # Create a new database entry that references the existing file
            new_file = File()
            new_file.file = existing_file.file  # This references the existing file
            new_file.original_filename = file_obj.name
            new_file.file_type = file_obj.content_type
            new_file.size = file_obj.size
            new_file.hash = file_hash
            new_file.save()

            # Serialize for response
            serializer = self.get_serializer(new_file)

            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers,
            )

        # Create new entry
        data = {
            "file": file_obj,
            "original_filename": file_obj.name,
            "file_type": file_obj.content_type,
            "size": file_obj.size,
            "hash": file_hash,
        }

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class StorageSummaryView(APIView):
    def get(self, request):
        all_files = File.objects.all()
        total_size = sum(f.size for f in all_files)

        # Group by hash and get minimum id (or any one row per hash)
        unique_file_ids = (
            File.objects.values("hash")
            .annotate(min_id=Min("id"))
            .values_list("min_id", flat=True)
        )

        unique_files = File.objects.filter(id__in=unique_file_ids)
        unique_size = sum(f.size for f in unique_files)

        savings = total_size - unique_size

        return Response(
            {
                "total_files": all_files.count(),
                "unique_files": unique_files.count(),
                "total_size": total_size,
                "unique_size": unique_size,
                "savings": savings,
            }
        )