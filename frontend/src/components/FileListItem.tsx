import React from 'react';
import { File as FileType } from '../types/file';
import { DocumentIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface FileListItemProps {
  file: FileType;
  onDelete: (id: string) => void;
  onDownload: (fileUrl: string, filename: string) => void;
  isDownloading: boolean;
  isDeleting: boolean;
}

export const FileListItem: React.FC<FileListItemProps> = ({
  file,
  onDelete,
  onDownload,
  isDownloading,
  isDeleting
}) => {
  return (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <DocumentIcon className="h-8 w-8 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.original_filename}
          </p>
          <p className="text-sm text-gray-500">
            {file.file_type} • {(file.size / 1024).toFixed(2)} KB
          </p>
          <p className="text-sm text-gray-500">
            Uploaded {new Date(file.uploaded_at).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onDownload(file.file, file.original_filename)}
            disabled={isDownloading}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            Download
          </button>
          <button
            onClick={() => onDelete(file.id)}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}; 