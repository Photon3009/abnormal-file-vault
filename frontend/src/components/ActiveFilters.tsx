import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FileFilters } from '../hooks/useFileFilters';

interface FileTypeOption {
    readonly value: string;
    readonly label: string;
  }
  
  interface ActiveFiltersProps {
    queryFilters: FileFilters;
    removeSingleFilter: (filterName: keyof FileFilters) => void;
    commonFileTypes: readonly FileTypeOption[];
  }
  

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  queryFilters,
  removeSingleFilter,
  commonFileTypes
}) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {queryFilters.searchTerm && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-800">
          Search: {queryFilters.searchTerm}
          <XMarkIcon 
            className="ml-1 h-4 w-4 cursor-pointer" 
            onClick={() => removeSingleFilter('searchTerm')} 
          />
        </span>
      )}
      {queryFilters.fileType && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-800">
          Type: {commonFileTypes.find(t => t.value === queryFilters.fileType)?.label || queryFilters.fileType}
          <XMarkIcon 
            className="ml-1 h-4 w-4 cursor-pointer" 
            onClick={() => removeSingleFilter('fileType')} 
          />
        </span>
      )}
      {queryFilters.minSize && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-800">
          Min Size: {queryFilters.minSize} KB
          <XMarkIcon 
            className="ml-1 h-4 w-4 cursor-pointer" 
            onClick={() => removeSingleFilter('minSize')} 
          />
        </span>
      )}
      {queryFilters.maxSize && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-800">
          Max Size: {queryFilters.maxSize} KB
          <XMarkIcon 
            className="ml-1 h-4 w-4 cursor-pointer" 
            onClick={() => removeSingleFilter('maxSize')} 
          />
        </span>
      )}
    </div>
  );
}; 