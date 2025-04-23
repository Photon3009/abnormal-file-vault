import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StorageSummary as StorageSummaryData } from '../types/summary';
import { fileService } from '../services/fileService';

export const StorageSummary: React.FC = () => {
  // Query for fetching the storage summary
  const { data: summary, isLoading, error } = useQuery<StorageSummaryData>({
    queryKey: ['storage-summary'],
    queryFn: fileService.getStorageSummary,
  });

  const formatSize = (bytes: number) => `${(bytes / (1024 ** 2)).toFixed(2)} MB`;

  if (isLoading) {
    return (
      <div className="p-4 text-gray-500 italic">
        Loading storage summary...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Failed to load storage summary.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Storage Summary</h2>
      <ul className="space-y-1 text-gray-700 text-sm">
        <li>Total Files: <span className="font-medium">{summary?.total_files}</span></li>
        <li>Unique Files: <span className="font-medium">{summary?.unique_files}</span></li>
        <li>Total Size: <span className="font-medium">{formatSize(summary?.total_size || 0)}</span></li>
        <li>Unique Size: <span className="font-medium">{formatSize(summary?.unique_size || 0)}</span></li>
        <li className="text-green-600">
          Storage Saved: <span className="font-bold">{formatSize(summary?.savings || 0)}</span>
        </li>
      </ul>
    </div>
  );
};
