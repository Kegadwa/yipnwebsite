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
    imageUrls: [
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 6.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 13.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 21.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 22.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 23.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 26.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 30.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 35.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 49.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 51.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 52.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 53.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 56.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 66.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 67.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 74.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 78.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 79.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 84.webp',
      '/Ed1webp/OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 88.webp'
    ]
  },
  'edition-2': {
    id: 'edition-2',
    name: 'Gallery Edition 2',
    description: 'Experience the energy and transformation of our second YIPN event.',
    imageUrls: [
      '/Ed2webp/IMG_8550.webp',
      '/Ed2webp/IMG_8552.webp',
      '/Ed2webp/IMG_8553.webp',
      '/Ed2webp/IMG_8557.webp',
      '/Ed2webp/IMG_8558.webp',
      '/Ed2webp/IMG_8560.webp',
      '/Ed2webp/IMG_8562.webp',
      '/Ed2webp/IMG_8569.webp',
      '/Ed2webp/IMG_8585.webp',
      '/Ed2webp/IMG_8587.webp',
      '/Ed2webp/IMG_8589.webp',
      '/Ed2webp/IMG_8592.webp',
      '/Ed2webp/IMG_8602.webp',
      '/Ed2webp/IMG_8609.webp',
      '/Ed2webp/IMG_8611.webp',
      '/Ed2webp/IMG_8614.webp',
      '/Ed2webp/IMG_8622.webp',
      '/Ed2webp/IMG_8637.webp',
      '/Ed2webp/IMG_8640.webp',
      '/Ed2webp/IMG_8642.webp',
      '/Ed2webp/IMG_8645.webp',
      '/Ed2webp/IMG_8646.webp',
      '/Ed2webp/IMG_8647.webp',
      '/Ed2webp/IMG_8651.webp',
      '/Ed2webp/IMG_8658.webp',
      '/Ed2webp/IMG_8661.webp',
      '/Ed2webp/IMG_8665.webp',
      '/Ed2webp/IMG_8669.webp',
      '/Ed2webp/IMG_8672.webp',
      '/Ed2webp/IMG_8679.webp',
      '/Ed2webp/IMG_8682.webp',
      '/Ed2webp/IMG_8685.webp',
      '/Ed2webp/IMG_8687.webp',
      '/Ed2webp/IMG_8696.webp',
      '/Ed2webp/IMG_8698.webp',
      '/Ed2webp/IMG_8715.webp',
      '/Ed2webp/IMG_8719.webp',
      '/Ed2webp/IMG_8721.webp',
      '/Ed2webp/IMG_8727.webp',
      '/Ed2webp/IMG_8731.webp',
      '/Ed2webp/IMG_8737.webp',
      '/Ed2webp/IMG_8743.webp',
      '/Ed2webp/IMG_8747.webp',
      '/Ed2webp/IMG_8749.webp',
      '/Ed2webp/IMG_8750.webp',
      '/Ed2webp/IMG_8754.webp',
      '/Ed2webp/IMG_8755.webp',
      '/Ed2webp/IMG_8763.webp',
      '/Ed2webp/IMG_8771.webp',
      '/Ed2webp/IMG_8778.webp',
      '/Ed2webp/IMG_8780.webp',
      '/Ed2webp/IMG_8784.webp',
      '/Ed2webp/IMG_8789.webp',
      '/Ed2webp/IMG_8797.webp',
      '/Ed2webp/IMG_8798.webp',
      '/Ed2webp/IMG_8807.webp',
      '/Ed2webp/IMG_8813.webp',
      '/Ed2webp/IMG_8817.webp',
      '/Ed2webp/IMG_8823.webp',
      '/Ed2webp/IMG_8826.webp',
      '/Ed2webp/IMG_8835.webp',
      '/Ed2webp/IMG_8837.webp',
      '/Ed2webp/IMG_8838.webp',
      '/Ed2webp/IMG_8841.webp',
      '/Ed2webp/IMG_8842.webp',
      '/Ed2webp/IMG_8848.webp',
      '/Ed2webp/IMG_8852.webp',
      '/Ed2webp/IMG_8855.webp',
      '/Ed2webp/IMG_8858.webp',
      '/Ed2webp/IMG_8861.webp',
      '/Ed2webp/IMG_8873.webp',
      '/Ed2webp/IMG_8880.webp',
      '/Ed2webp/IMG_8883.webp',
      '/Ed2webp/IMG_8902.webp',
      '/Ed2webp/IMG_8913.webp',
      '/Ed2webp/IMG_8916.webp',
      '/Ed2webp/IMG_8972.webp',
      '/Ed2webp/IMG_8973.webp',
      '/Ed2webp/IMG_8981.webp',
      '/Ed2webp/IMG_9004.webp',
      '/Ed2webp/IMG_9009.webp',
      '/Ed2webp/IMG_9027.webp',
      '/Ed2webp/IMG_9029.webp',
      '/Ed2webp/IMG_9040.webp',
      '/Ed2webp/IMG_9041.webp',
      '/Ed2webp/IMG_9045.webp',
      '/Ed2webp/IMG_9049.webp'
    ]
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
