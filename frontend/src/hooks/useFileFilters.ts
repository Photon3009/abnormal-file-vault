import { useState, useEffect } from 'react';

export interface FileFilters {
  searchTerm: string;
  fileType: string;
  minSize: string;
  maxSize: string;
  ordering: string;
  isFiltering: boolean;
}

export const useFileFilters = () => {
  // UI state (not directly affecting queries)
  const [inputSearchTerm, setInputSearchTerm] = useState('');
  const [inputFileType, setInputFileType] = useState('');
  const [inputMinSize, setInputMinSize] = useState('');
  const [inputMaxSize, setInputMaxSize] = useState('');
  const [inputSortOrder, setInputSortOrder] = useState('desc'); // Default to newest first
  const [showFilters, setShowFilters] = useState(false);
  
  // Query state (only updated when filters are applied)
  const [queryFilters, setQueryFilters] = useState<FileFilters>({
    searchTerm: '',
    fileType: '',
    minSize: '',
    maxSize: '',
    ordering: 'desc', // Default to newest first
    isFiltering: false
  });

  // Apply filters from input state to query state
  const applyFilters = () => {
    setQueryFilters({
      searchTerm: inputSearchTerm,
      fileType: inputFileType,
      minSize: inputMinSize,
      maxSize: inputMaxSize,
      ordering: inputSortOrder,
      isFiltering: true
    });
    setShowFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    // Clear input state
    setInputSearchTerm('');
    setInputFileType('');
    setInputMinSize('');
    setInputMaxSize('');
    setInputSortOrder('desc'); // Reset to default sort
    
    // Clear query state
    setQueryFilters({
      searchTerm: '',
      fileType: '',
      minSize: '',
      maxSize: '',
      ordering: 'desc', // Reset to default sort
      isFiltering: false
    });
  };

  // Function to remove a single filter
  const removeSingleFilter = (filterName: keyof FileFilters) => {
    if (filterName === 'ordering') {
      // For sort order, reset to default instead of clearing
      setQueryFilters(prev => ({
        ...prev,
        ordering: 'desc'
      }));
      setInputSortOrder('desc');
      return;
    }
    
    setQueryFilters(prev => ({
      ...prev,
      [filterName]: '',
      isFiltering: Object.keys(prev).some(key => 
        key !== filterName && 
        key !== 'isFiltering' && 
        key !== 'ordering' && 
        prev[key as keyof FileFilters] !== ''
      )
    }));
    
    // Also clear the corresponding input
    switch(filterName) {
      case 'searchTerm':
        setInputSearchTerm('');
        break;
      case 'fileType':
        setInputFileType('');
        break;
      case 'minSize':
        setInputMinSize('');
        break;
      case 'maxSize':
        setInputMaxSize('');
        break;
    }
  };

  // Change sort order and apply it immediately
  const handleSortChange = (value: string) => {
    setInputSortOrder(value);
    setQueryFilters(prev => ({
      ...prev,
      ordering: value
    }));
  };

  // Initialize input fields when filters are applied
  useEffect(() => {
    setInputSearchTerm(queryFilters.searchTerm);
    setInputFileType(queryFilters.fileType);
    setInputMinSize(queryFilters.minSize);
    setInputMaxSize(queryFilters.maxSize);
    setInputSortOrder(queryFilters.ordering);
  }, [queryFilters]);

  return {
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
  };
}; 