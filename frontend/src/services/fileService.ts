import axios from 'axios';
import { File as FileType } from '../types/file';
import { StorageSummary } from '../types/summary';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const fileService = {
  async uploadFile(file: File): Promise<FileType> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/files/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getFiles(queryParams = ''): Promise<FileType[]> {
    const url = queryParams ? `${API_URL}/files/?${queryParams}` : `${API_URL}/files/`;
    const response = await axios.get(url);
    return response.data;
  },

  async deleteFile(id: string): Promise<void> {
    await axios.delete(`${API_URL}/files/${id}/`);
  },

  async downloadFile(fileUrl: string, filename: string): Promise<void> {
    try {
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to download file');
    }
  },

  async getStorageSummary(): Promise<StorageSummary> {
    console.log('Fetching storage summary from:', `${API_URL}/storage-summary/`);
    const response = await axios.get(`${API_URL}/storage-summary/`);
    console.log(response.data);  
    return response.data;
  },
}; 