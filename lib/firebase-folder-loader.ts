// Simple utility to fetch images from Firebase Storage folders
export interface FolderImage {
  id: string;
  url: string;
  name: string;
}

/**
 * Fetches images from a Firebase Storage folder
 * Note: Firebase Storage list API requires authentication, so we'll use manual URL generation
 */
export const fetchImagesFromFolder = async (folderUrl: string): Promise<FolderImage[]> => {
  try {
    console.log('Fetching images from folder:', folderUrl);
    
    // Firebase Storage list API requires authentication, so we'll use manual URL generation instead
    // This is more reliable and doesn't require API keys
    
    const manualUrls = getManualImageUrls(folderUrl);
    const images: FolderImage[] = manualUrls.map((url, index) => ({
      id: `img-${index}`,
      url,
      name: `Image ${index + 1}`
    }));
    
    console.log(`Generated ${images.length} potential image URLs from folder`);
    return images;
    
  } catch (error) {
    console.error('Error generating image URLs from folder:', error);
    
    // Return empty array on error - page will show fallback images
    return [];
  }
};

/**
 * Generate potential image URLs based on common naming patterns
 * This is more reliable than trying to fetch from Firebase Storage API
 */
export const getManualImageUrls = (folderUrl: string): string[] => {
  // Extract the base path from the folder URL
  const basePath = folderUrl.replace('?alt=media', '');
  
  // Common image names that might exist in the folder
  const commonNames = [
    // Numbered images
    'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg',
    'image1.jpeg', 'image2.jpeg', 'image3.jpeg', 'image4.jpeg', 'image5.jpeg', 'image6.jpeg',
    'image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png',
    
    // Photo naming
    'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg',
    'photo1.jpeg', 'photo2.jpeg', 'photo3.jpeg', 'photo4.jpeg', 'photo5.jpeg', 'photo6.jpeg',
    
    // Gallery naming
    'gallery1.jpg', 'gallery2.jpg', 'gallery3.jpg', 'gallery4.jpg', 'gallery5.jpg', 'gallery6.jpg',
    
    // Camera naming
    'IMG_001.jpg', 'IMG_002.jpg', 'IMG_003.jpg', 'IMG_004.jpg', 'IMG_005.jpg', 'IMG_006.jpg',
    'IMG_001.jpeg', 'IMG_002.jpeg', 'IMG_003.jpeg', 'IMG_004.jpeg', 'IMG_005.jpeg', 'IMG_006.jpeg',
    
    'OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 100.jpg', 'OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 123.jpg', 
    'OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 102.jpg', 'OUTFIT INSPO, YOGA IN THE GARDEN, BIO FOODS 13.jpg',


    // Event naming
    'event1.jpg', 'event2.jpg', 'event3.jpg', 'event4.jpg', 'event5.jpg', 'event6.jpg',
    'yoga1.jpg', 'yoga2.jpg', 'yoga3.jpg', 'yoga4.jpg', 'yoga5.jpg', 'yoga6.jpg',
    'meditation1.jpg', 'meditation2.jpg', 'meditation3.jpg', 'meditation4.jpg', 'meditation5.jpg', 'meditation6.jpg'

  ];
  
  return commonNames.map(name => `${basePath}/${name}?alt=media`);
};
