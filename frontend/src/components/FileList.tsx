import React from 'react';
import { fileService } from '../services/fileService';
import { File as FileType } from '../types/file';
import { 
  DocumentIcon, 
  TrashIcon, 
  ArrowDownTrayIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFileFilters } from '../hooks/useFileFilters';
import { FileListItem } from './FileListItem';
import { FilterPanel } from './FilterPanel';
import { ActiveFilters } from './ActiveFilters';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

// Constants
const COMMON_FILE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'application/pdf', label: 'PDF' },
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'application/msword', label: 'DOC' },
  { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'DOCX' },
  { value: 'text/plain', label: 'TXT' },
  { value: 'application/zip', label: 'ZIP' },
] as const;

const SORT_OPTIONS = [
  { value: 'desc', label: 'Newest first' },
  { value: 'asc', label: 'Oldest first' },
] as const;

export const FileList: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Custom hook for filter management
  const {
    inputSearchTerm,
    setInputSearchTerm,
    inputFileType,
    setInputFileType,
    inputMinSize,
    setInputMinSize,
    inputMaxSize,
    setInputMaxSize,
    inputSortOrder,
    setInputSortOrder,
    showFilters,
    setShowFilters,
    queryFilters,
    applyFilters,
    clearFilters,
    removeSingleFilter,
    handleSortChange
  } = useFileFilters();

  // Query for fetching files with filters
  const { data: files, isLoading, error } = useQuery({
    queryKey: ['files', queryFilters],
    queryFn: () => fileService.getFiles(buildQueryParams(queryFilters)),
  });

  // Mutation for deleting files
  const deleteMutation = useMutation({
    mutationFn: fileService.deleteFile,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['files'] }),
        queryClient.invalidateQueries({ queryKey: ['storage-summary'] }),
      ]);
    },
  });

  // Mutation for downloading files
  const downloadMutation = useMutation({
    mutationFn: ({ fileUrl, filename }: { fileUrl: string; filename: string }) =>
      fileService.downloadFile(fileUrl, filename),
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDownload = async (fileUrl: string, filename: string) => {
    try {
      await downloadMutation.mutateAsync({ fileUrl, filename });
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Uploaded Files</h2>
        <div className="flex items-center space-x-2">
          {/* Sort Order Dropdown */}
          <div className="relative">
            <select
              value={queryFilters.ordering}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          {queryFilters.isFiltering && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={inputSearchTerm}
            onChange={(e) => setInputSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search by filename"
          />
        </div>
        <button
          onClick={applyFilters}
          className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Search
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          inputFileType={inputFileType}
          setInputFileType={setInputFileType}
          inputMinSize={inputMinSize}
          setInputMinSize={setInputMinSize}
          inputMaxSize={inputMaxSize}
          setInputMaxSize={setInputMaxSize}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
          commonFileTypes={COMMON_FILE_TYPES}
        />
      )}

      {/* Active Filters Display */}
      {queryFilters.isFiltering && (
        <ActiveFilters
          queryFilters={queryFilters}
          removeSingleFilter={removeSingleFilter}
          commonFileTypes={COMMON_FILE_TYPES}
        />
      )}

      {/* File List */}
      {!files || files.length === 0 ? (
        <EmptyState isFiltering={queryFilters.isFiltering} />
      ) : (
        <div className="mt-6 flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {files.map((file) => (
              <FileListItem
                key={file.id}
                file={file}
                onDelete={handleDelete}
                onDownload={handleDownload}
                isDownloading={downloadMutation.isPending}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Helper function to build query parameters
const buildQueryParams = (filters: {
  searchTerm: string;
  fileType: string;
  minSize: string;
  maxSize: string;
  ordering: string;
}) => {
  const params = new URLSearchParams();
  
  if (filters.searchTerm) params.append('search', filters.searchTerm);
  if (filters.fileType) params.append('file_type', filters.fileType);
  if (filters.minSize) params.append('min_size', (parseInt(filters.minSize) * 1024).toString());
  if (filters.maxSize) params.append('max_size', (parseInt(filters.maxSize) * 1024).toString());
  
  if (filters.ordering === 'asc') {
    params.append('sort', 'asc');
  }
  
  return params.toString();
};