import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaFolder, FaPlus, FaTrash, FaImage } from 'react-icons/fa';
import { galleryService } from '../../lib/firebase-services';

interface GalleryFolder {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
}

const AdminGalleryConfig = () => {
  const [folders, setFolders] = useState<Record<string, GalleryFolder>>({
    'edition-1': {
      id: 'edition-1',
      name: 'Gallery Edition 1',
      description: 'Relive the magic of our first YIPN event through these beautiful captured moments of community and wellness.',
      imageUrls: []
    },
    'edition-2': {
      id: 'edition-2',
      name: 'Gallery Edition 2',
      description: 'Experience the energy and transformation of our second YIPN event.',
      imageUrls: []
    }
  });

  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    loadGalleryFolders();
  }, []);

  const loadGalleryFolders = async () => {
    try {
      // Load from Firestore collection 'gallery1'
      const galleryData = await galleryService.readAll();
      
      if (galleryData && galleryData.length > 0) {
        // Convert Firestore data to our format
        const loadedFolders: Record<string, GalleryFolder> = {};
        
        galleryData.forEach((item: any) => {
          if (item.folderId) {
            loadedFolders[item.folderId] = {
              id: item.folderId,
              name: item.name || `Gallery ${item.folderId}`,
              description: item.description || '',
              imageUrls: item.imageUrls || []
            };
          }
        });
        
        setFolders(loadedFolders);
      }
    } catch (error) {
      console.error('Error loading gallery folders:', error);
    }
  };

  const handleFolderEdit = (folderId: string) => {
    setEditingFolder(folderId);
  };

  const handleFolderSave = async (folderId: string) => {
    try {
      setEditingFolder(null);
      
      const folder = folders[folderId];
      
      // Save to Firestore collection 'gallery1'
      const galleryData = {
        folderId: folder.id,
        name: folder.name,
        description: folder.description,
        imageUrls: folder.imageUrls,
        updatedAt: new Date()
      };
      
      // Check if folder already exists
      const existingData = await galleryService.readAll();
      const existingFolder = existingData.find((item: any) => item.folderId === folderId);
      
      if (existingFolder) {
        // Update existing folder
        await galleryService.update(existingFolder.id, galleryData);
        console.log('Gallery folder updated:', folderId);
      } else {
        // Create new folder
        await galleryService.create(galleryData);
        console.log('Gallery folder created:', folderId);
      }
      
      // Reload data
      await loadGalleryFolders();
      
    } catch (error) {
      console.error('Error saving gallery folder:', error);
      alert('Error saving gallery folder. Please try again.');
    }
  };

  const updateFolderField = (folderId: string, field: keyof GalleryFolder, value: string | string[]) => {
    setFolders(prev => ({
      ...prev,
      [folderId]: {
        ...prev[folderId],
        [field]: value
      }
    }));
  };

  const addImageUrl = (folderId: string) => {
    if (newImageUrl.trim()) {
      const currentUrls = folders[folderId].imageUrls || [];
      updateFolderField(folderId, 'imageUrls', [...currentUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (folderId: string, index: number) => {
    const currentUrls = folders[folderId].imageUrls || [];
    const newUrls = currentUrls.filter((_, i) => i !== index);
    updateFolderField(folderId, 'imageUrls', newUrls);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaFolder className="mr-2 text-primary" />
          Individual Image URL Gallery Management
        </h2>
        <p className="text-gray-600 mb-6">
          Add individual image URLs one by one. Images will be displayed in a Pinterest-style masonry layout without names or cards.
        </p>

        {Object.entries(folders).map(([folderId, folder]) => (
          <div key={folderId} className="border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <FaFolder className="mr-2 text-secondary" />
                {folder.name}
              </h3>
              <button
                onClick={() => handleFolderEdit(folderId)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              >
                <FaEdit className="inline mr-1" />
                Edit
              </button>
            </div>

            {/* Folder Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gallery Name
                </label>
                {editingFolder === folderId ? (
                  <input
                    type="text"
                    value={folder.name}
                    onChange={(e) => updateFolderField(folderId, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="text-gray-900">{folder.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Images
                </label>
                <p className="text-gray-900 font-semibold">{folder.imageUrls?.length || 0} images</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              {editingFolder === folderId ? (
                <textarea
                  value={folder.description}
                  onChange={(e) => updateFolderField(folderId, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                />
              ) : (
                <p className="text-gray-900">{folder.description}</p>
              )}
            </div>

            {/* Individual Image URLs Section */}
            {editingFolder === folderId && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Individual Image URLs
                </label>
                <div className="space-y-3">
                  {/* Add new image URL */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => addImageUrl(folderId)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <FaPlus />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  {/* Display existing image URLs */}
                  {folder.imageUrls && folder.imageUrls.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Current Images:</p>
                      {folder.imageUrls.map((url, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                          <FaImage className="text-gray-400" />
                          <span className="flex-1 text-sm text-gray-700 truncate">{url}</span>
                          <button
                            onClick={() => removeImageUrl(folderId, index)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {editingFolder === folderId && (
              <button
                onClick={() => handleFolderSave(folderId)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mb-4"
              >
                <FaSave className="inline mr-2" />
                Save Gallery
              </button>
            )}

            {/* Gallery Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 mb-2">How This Works:</h4>
              <p className="text-sm text-blue-700 mb-2">
                Add individual image URLs above. The gallery page will:
              </p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Display images in a Pinterest-style masonry layout</li>
                <li>Show images without names, cards, or descriptions</li>
                <li>Use rounded corners for a clean look</li>
                <li>Automatically arrange images to fit anywhere</li>
              </ul>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Adding Images:</h4>
          <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
            <li>Click "Edit" on any gallery</li>
            <li>Paste individual image URLs in the "Add Individual Image URLs" field</li>
            <li>Click "Add" to add each image</li>
            <li>Remove images by clicking the trash icon</li>
            <li>Save the gallery when done</li>
            <li>Images will appear in a beautiful Pinterest-style layout!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryConfig;
