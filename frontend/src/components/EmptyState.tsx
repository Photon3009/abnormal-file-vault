import React from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  isFiltering: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isFiltering }) => {
  return (
    <div className="text-center py-12">
      <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
      <p className="mt-1 text-sm text-gray-500">
        {isFiltering ? 'No files match your filters' : 'Get started by uploading a file'}
      </p>
    </div>
  );
}; 