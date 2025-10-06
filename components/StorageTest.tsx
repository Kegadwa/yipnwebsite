import React, { useState } from 'react';
import { FaUpload, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { imageService } from '../lib/firebase-services';

interface TestResult {
  success: boolean;
  message: string;
  url?: string;
  error?: string;
}

const StorageTest: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTestResult(null);
    }
  };

  const testUpload = async () => {
    if (!selectedFile) {
      setTestResult({
        success: false,
        message: 'Please select a file first'
      });
      return;
    }

    setIsUploading(true);
    setTestResult(null);

    try {
      console.log('Testing upload with file:', selectedFile.name);
      
      // Test upload to gallery folder
      const uploadPath = `gallery/test/${Date.now()}_${selectedFile.name}`;
      const downloadURL = await imageService.uploadImage(selectedFile, uploadPath);
      
      setTestResult({
        success: true,
        message: 'Upload successful!',
        url: downloadURL
      });
      
      console.log('Upload test successful:', downloadURL);
    } catch (error: any) {
      console.error('Upload test failed:', error);
      
      setTestResult({
        success: false,
        message: 'Upload failed',
        error: error.message || 'Unknown error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const testConnection = async () => {
    setIsUploading(true);
    setTestResult(null);

    try {
      // Test Firebase connection
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
      
      const uploadPath = `test-connection/${Date.now()}_test.txt`;
      const downloadURL = await imageService.uploadImage(testFile, uploadPath);
      
      setTestResult({
        success: true,
        message: 'Connection test successful!',
        url: downloadURL
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: 'Connection test failed',
        error: error.message || 'Unknown error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Firebase Storage Test</h2>
      
      <div className="space-y-6">
        {/* File Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Image File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Test Buttons */}
        <div className="flex gap-4">
          <button
            onClick={testConnection}
            disabled={isUploading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
            Test Connection
          </button>
          
          <button
            onClick={testUpload}
            disabled={isUploading || !selectedFile}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
            Test Upload
          </button>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className={`p-4 rounded-lg ${
            testResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {testResult.success ? (
                <FaCheck className="text-green-600 mt-1" />
              ) : (
                <FaExclamationTriangle className="text-red-600 mt-1" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.message}
                </h3>
                
                {testResult.error && (
                  <p className="text-red-700 text-sm mt-1">
                    Error: {testResult.error}
                  </p>
                )}
                
                {testResult.url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Download URL:</p>
                    <a 
                      href={testResult.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {testResult.url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Test Instructions:</h3>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Click "Test Connection" to verify Firebase connection</li>
            <li>Select an image file (JPG, PNG, GIF, WebP)</li>
            <li>Click "Test Upload" to test image upload functionality</li>
            <li>Check the results and any error messages</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default StorageTest;


