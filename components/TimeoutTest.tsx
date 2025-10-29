import React, { useState } from 'react';
import { FaCheck, FaTimes, FaSpinner, FaClock } from 'react-icons/fa';
import { galleryImageService, STORAGE_FOLDERS } from '../lib/firebase-storage';

const TimeoutTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    duration?: number;
    imageCount?: number;
    error?: string;
  } | null>(null);

  const testTimeout = async () => {
    setIsLoading(true);
    setResult(null);

    const startTime = Date.now();

    try {
      console.log('Testing gallery loading with timeout handling...');
      
      // Test loading images from Edition 2 folder
      const images = await galleryImageService.getImagesFromFolder(STORAGE_FOLDERS.GALLERY_EDITION_2);
      
      const duration = Date.now() - startTime;
      
      setResult({
        success: true,
        message: 'Gallery loaded successfully',
        duration: Math.round(duration / 1000),
        imageCount: images.length
      });
      
      console.log(`Gallery loading test completed in ${duration}ms:`, images.length, 'images found');
    } catch (error) {
      const duration = Date.now() - startTime;
      
      setResult({
        success: false,
        message: 'Gallery loading failed',
        duration: Math.round(duration / 1000),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error('Gallery loading test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <FaSpinner className="animate-spin text-blue-500" />;
    if (result?.success) return <FaCheck className="text-green-500" />;
    if (result?.error?.includes('timeout')) return <FaClock className="text-yellow-500" />;
    return <FaTimes className="text-red-500" />;
  };

  const getStatusColor = () => {
    if (isLoading) return 'border-blue-200 bg-blue-50';
    if (result?.success) return 'border-green-200 bg-green-50';
    if (result?.error?.includes('timeout')) return 'border-yellow-200 bg-yellow-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <FaClock className="mr-2" />
        Timeout Test
      </h2>
      <p className="text-gray-600 mb-6">
        This test checks if the gallery loading works with the improved timeout handling.
        It measures how long the operation takes and provides detailed error information.
      </p>

      <button
        onClick={testTimeout}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-6"
      >
        {getStatusIcon()}
        <span>{isLoading ? 'Testing...' : 'Test Gallery Loading'}</span>
      </button>

      {result && (
        <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
          <div className="flex items-center space-x-3 mb-2">
            {getStatusIcon()}
            <h3 className={`font-medium ${
              result.success ? 'text-green-900' : 
              result.error?.includes('timeout') ? 'text-yellow-900' : 'text-red-900'
            }`}>
              {result.message}
            </h3>
          </div>
          
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Duration:</strong> {result.duration}s</p>
            {result.imageCount !== undefined && (
              <p><strong>Images Found:</strong> {result.imageCount}</p>
            )}
            {result.error && (
              <p className="text-red-600"><strong>Error:</strong> {result.error}</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Timeout Configuration:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Default timeout:</strong> 60 seconds</li>
          <li>• <strong>Folder listing:</strong> 30 seconds</li>
          <li>• <strong>Image download URL:</strong> 20 seconds</li>
          <li>• <strong>Retry attempts:</strong> 3 with exponential backoff</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">If Timeout Occurs:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Check your internet connection</li>
          <li>• Try again - the system will retry automatically</li>
          <li>• Large galleries may take longer to load</li>
          <li>• Firebase may be experiencing high load</li>
        </ul>
      </div>
    </div>
  );
};

export default TimeoutTest;


