import React, { useState, useEffect } from 'react';
import { useStorage } from '../../hooks';

function StorageExample() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBucket, setSelectedBucket] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  
  const { 
    uploadFile, 
    listFiles, 
    deleteFile, 
    getPublicUrl,
    loading: storageLoading, 
    error: storageError 
  } = useStorage();

  // Load files when component mounts or bucket changes
  useEffect(() => {
    loadFiles();
  }, [selectedBucket]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await listFiles(selectedBucket);
      
      if (response.success) {
        setFiles(response.data || []);
      } else {
        setError('Failed to load files');
      }
    } catch (error) {
      setError(`Error loading files: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Clear any previous preview
      setPreviewUrl('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      // Generate a path with the original filename
      const path = `uploads/${Date.now()}_${selectedFile.name}`;
      
      const response = await uploadFile(
        selectedBucket,
        path,
        selectedFile,
        selectedFile.type
      );
      
      if (response.success) {
        setSuccessMessage(`File uploaded successfully: ${path}`);
        setSelectedFile(null);
        // Reset the file input
        document.getElementById('file-upload').value = '';
        // Refresh the file list
        loadFiles();
      } else {
        setError('Failed to upload file');
      }
    } catch (error) {
      setError(`Error uploading file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (path) => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      const response = await deleteFile(selectedBucket, path);
      
      if (response.success) {
        setSuccessMessage(`File deleted successfully: ${path}`);
        // Refresh the file list
        loadFiles();
      } else {
        setError('Failed to delete file');
      }
    } catch (error) {
      setError(`Error deleting file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetUrl = async (path) => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      const response = await getPublicUrl(selectedBucket, path);
      
      if (response.success && response.url) {
        setPreviewUrl(response.url);
        setSuccessMessage(`Public URL generated: ${response.url}`);
      } else {
        setError('Failed to generate public URL');
      }
    } catch (error) {
      setError(`Error generating URL: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Storage Operations Example</h1>
      
      {(error || storageError) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error || storageError}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      {/* Bucket Selection */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Select Bucket</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedBucket('public')}
            className={`px-4 py-2 rounded-md ${
              selectedBucket === 'public' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Public Bucket
          </button>
          <button
            onClick={() => setSelectedBucket('private')}
            className={`px-4 py-2 rounded-md ${
              selectedBucket === 'private' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Private Bucket
          </button>
        </div>
      </div>
      
      {/* File Upload Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Upload File</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          {selectedFile && (
            <div className="text-sm text-gray-500">
              Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </div>
          )}
          <button
            type="submit"
            disabled={loading || storageLoading || !selectedFile}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              loading || storageLoading || !selectedFile 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700'
            }`}
          >
            {loading || storageLoading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>
      
      {/* File Preview */}
      {previewUrl && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">File Preview</h2>
          <div className="border rounded-md p-4">
            {previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img src={previewUrl} alt="Preview" className="max-w-full h-auto max-h-96 mx-auto" />
            ) : previewUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video controls className="max-w-full h-auto max-h-96 mx-auto">
                <source src={previewUrl} />
                Your browser does not support the video tag.
              </video>
            ) : previewUrl.match(/\.(mp3|wav)$/i) ? (
              <audio controls className="w-full">
                <source src={previewUrl} />
                Your browser does not support the audio tag.
              </audio>
            ) : (
              <div className="text-center">
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open file in new tab
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Files List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-medium">Files in {selectedBucket} Bucket</h2>
          <button
            onClick={loadFiles}
            disabled={loading || storageLoading}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        </div>
        
        {(loading || storageLoading) && !files.length ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No files found in this bucket.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {files.map((file, index) => (
              <li key={index} className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium break-all">{file.name}</h3>
                    {file.created_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(file.created_at).toLocaleString()}
                      </p>
                    )}
                    {file.size && (
                      <p className="text-xs text-gray-400">
                        Size: {Math.round(file.size / 1024)} KB
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGetUrl(file.name)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StorageExample; 