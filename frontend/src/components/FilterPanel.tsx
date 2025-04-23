import React from 'react';

interface FileTypeOption {
  readonly value: string;
  readonly label: string;
}

interface FilterPanelProps {
  inputFileType: string;
  setInputFileType: (value: string) => void;
  inputMinSize: string;
  setInputMinSize: (value: string) => void;
  inputMaxSize: string;
  setInputMaxSize: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  commonFileTypes: readonly FileTypeOption[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  inputFileType,
  setInputFileType,
  inputMinSize,
  setInputMinSize,
  inputMaxSize,
  setInputMaxSize,
  applyFilters,
  clearFilters,
  commonFileTypes
}) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
          <select
            value={inputFileType}
            onChange={(e) => setInputFileType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            {commonFileTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size Range (KB)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={inputMinSize}
              onChange={(e) => setInputMinSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={inputMaxSize}
              onChange={(e) => setInputMaxSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Clear
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}; 