import React, { useState, useEffect } from 'react';
import { galleryImageService, STORAGE_FOLDERS, StorageImage } from '../../lib/firebase-storage';
import { FaUpload, FaTrash, FaEye, FaFolder, FaImage, FaSpinner } from 'react-icons/fa';

const AdminGallery = () => {
  const [selectedFolder, setSelectedFolder] = useState(STORAGE_FOLDERS.GALLERY_EDITION_1);
  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const folders = [
    { value: STORAGE_FOLDERS.GALLERY_EDITION_1, label: 'Gallery Edition 1', icon: '📸' },
    { value: STORAGE_FOLDERS.GALLERY_EDITION_2, label: 'Gallery Edition 2', icon: '📸' },
    { value: STORAGE_FOLDERS.BLOG_IMAGES, label: 'Blog Images', icon: '📝' },
    { value: STORAGE_FOLDERS.EVENT_IMAGES, label: 'Event Images', icon: '🎫' },
    { value: STORAGE_FOLDERS.PROFILE_IMAGES, label: 'Profile Images', icon: '👤' }
  ];

  useEffect(() => {
    loadImages();
  }, [selectedFolder]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const folderImages = await galleryImageService.getImagesFromFolder(selectedFolder);
      setImages(folderImages);
    } catch (error) {
      console.error('Error loading images:', error);
      setError('Failed to load images from this folder');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const uploadPromises = Array.from(selectedFiles).map(file => 
        galleryImageService.uploadImage(file, selectedFolder)
      );

      await Promise.all(uploadPromises);
      
      setSuccess(`Successfully uploaded ${selectedFiles.length} image(s) to ${selectedFolder}`);
      setSelectedFiles(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Reload images
      await loadImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imagePath: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      await galleryImageService.deleteImage(imagePath);
      setSuccess('Image deleted successfully');
      await loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    }
  };

  const getFolderIcon = (folderValue: string) => {
    const folder = folders.find(f => f.value === folderValue);
    return folder?.icon || '📁';
  };

  const getFolderLabel = (folderValue: string) => {
    const folder = folders.find(f => f.value === folderValue);
    return folder?.label || folderValue;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaImage className="mr-2 text-primary" />
          Gallery Image Management
        </h2>

        {/* Folder Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Folder
          </label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {folders.map((folder) => (
              <option key={folder.value} value={folder.value}>
                {folder.icon} {folder.label}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaUpload className="mr-2 text-secondary" />
            Upload Images to {getFolderIcon(selectedFolder)} {getFolderLabel(selectedFolder)}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Images
              </label>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF. Max file size: 10MB per image.
              </p>
            </div>

            {selectedFiles && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>{selectedFiles.length}</strong> file(s) selected for upload
                </p>
                <div className="mt-2 space-y-1">
                  {Array.from(selectedFiles).map((file, index) => (
                    <p key={index} className="text-xs text-blue-600">
                      • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFiles || uploading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" />
                  Upload Images
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Images Display */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaFolder className="mr-2 text-secondary" />
            Images in {getFolderIcon(selectedFolder)} {getFolderLabel(selectedFolder)} ({images.length})
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-2xl text-primary mx-auto mb-2" />
              <p className="text-gray-600">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No images found in this folder</p>
              <p className="text-sm text-gray-400">Upload some images to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={image.path} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 items-center justify-center bg-gray-100">
                      <FaImage className="text-3xl text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 truncate mb-1">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                    
                    <div className="flex space-x-2">
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded text-center hover:bg-blue-200 transition-colors"
                      >
                        <FaEye className="inline mr-1" />
                        View
                      </a>
                      <button
                        onClick={() => handleDeleteImage(image.path)}
                        className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
                      >
                        <FaTrash className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
