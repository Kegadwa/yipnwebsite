// Gallery configuration for individual image URLs
// Add individual image URLs to display them in a Pinterest-style layout
export interface GalleryFolder {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
}

// Configure your gallery folders here - add individual image URLs
export const GALLERY_FOLDERS: Record<string, GalleryFolder> = {
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
};

// Helper function to get folder by ID
export const getGalleryFolder = (folderId: string): GalleryFolder | null => {
  return GALLERY_FOLDERS[folderId] || null;
};

// Helper function to get all folder IDs
export const getGalleryFolderIds = (): string[] => {
  return Object.keys(GALLERY_FOLDERS);
};

// Helper function to update gallery folder
export const updateGalleryFolder = (folder: GalleryFolder) => {
  GALLERY_FOLDERS[folder.id] = folder;
};
