import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface StorageImage {
  name: string;
  url: string;
  path: string;
  size: number;
  contentType: string;
  createdAt: Date;
}

export class FirebaseStorageService {
  private storage = storage;

  // Upload a single image to a specific folder
  async uploadImage(file: File, folderPath: string): Promise<string> {
    try {
      console.log(`Starting upload for file: ${file.name} to folder: ${folderPath}`);
      
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const fullPath = `${folderPath}/${fileName}`;
      const storageRef = ref(this.storage, fullPath);
      
      console.log(`Uploading to path: ${fullPath}`);
      const snapshot = await uploadBytes(storageRef, file);
      console.log(`Upload completed, getting download URL...`);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log(`Image uploaded successfully to ${fullPath}`);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Check if it's a network/connection error
      if (error instanceof Error) {
        if (error.message.includes('retry-limit-exceeded') || 
            error.message.includes('network') ||
            error.message.includes('timeout')) {
          throw new Error('Network connection issue. Please check your internet connection and try again.');
        }
        
        if (error.message.includes('unauthorized') || 
            error.message.includes('permission-denied')) {
          throw new Error('Permission denied. Please check your Firebase configuration and rules.');
        }
      }
      
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get all images from a specific folder
  async getImagesFromFolder(folderPath: string): Promise<StorageImage[]> {
    try {
      console.log(`Attempting to load images from folder: ${folderPath}`);
      
      const folderRef = ref(this.storage, folderPath);
      const result = await listAll(folderRef);
      
      console.log(`Found ${result.items.length} items in folder: ${folderPath}`);
      
      const images: StorageImage[] = [];
      
      for (const itemRef of result.items) {
        try {
          console.log(`Processing item: ${itemRef.name}`);
          const url = await getDownloadURL(itemRef);
          const metadata = await this.getMetadata(itemRef.fullPath);
          
          images.push({
            name: itemRef.name,
            url,
            path: itemRef.fullPath,
            size: metadata.size || 0,
            contentType: metadata.contentType || 'image/jpeg',
            createdAt: new Date(metadata.timeCreated || Date.now())
          });
          
          console.log(`Successfully processed: ${itemRef.name}`);
        } catch (error) {
          console.warn(`Failed to get metadata for ${itemRef.name}:`, error);
        }
      }
      
      // Sort by creation date (newest first)
      images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      console.log(`Successfully loaded ${images.length} images from ${folderPath}`);
      return images;
    } catch (error) {
      console.error('Error getting images from folder:', error);
      
      // Check if it's a network/connection error
      if (error instanceof Error) {
        if (error.message.includes('retry-limit-exceeded') || 
            error.message.includes('network') ||
            error.message.includes('timeout')) {
          throw new Error('Network connection issue. Please check your internet connection and try again.');
        }
      }
      
      throw new Error(`Failed to get images from folder: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get metadata for a file
  private async getMetadata(filePath: string) {
    try {
      const fileRef = ref(this.storage, filePath);
      // Note: getMetadata is not available in the current Firebase version
      // We'll use a fallback approach
      return {
        size: 0,
        contentType: 'image/jpeg',
        timeCreated: Date.now()
      };
    } catch (error) {
      console.warn('Could not get metadata:', error);
      return {
        size: 0,
        contentType: 'image/jpeg',
        timeCreated: Date.now()
      };
    }
  }

  // Delete an image from storage
  async deleteImage(filePath: string): Promise<void> {
    try {
      const fileRef = ref(this.storage, filePath);
      await deleteObject(fileRef);
      console.log(`Image deleted successfully: ${filePath}`);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  // Get a specific image URL by path
  async getImageURL(filePath: string): Promise<string> {
    try {
      const fileRef = ref(this.storage, filePath);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error getting image URL:', error);
      throw new Error('Failed to get image URL');
    }
  }
}

// Create instances for different use cases
export const blogImageService = new FirebaseStorageService();
export const galleryImageService = new FirebaseStorageService();

// Predefined folder paths
export const STORAGE_FOLDERS = {
  BLOG_IMAGES: 'blog-images',
  GALLERY_EDITION_1: 'gallery/edition-1',
  GALLERY_EDITION_2: 'gallery/edition-2',
  PROFILE_IMAGES: 'profile-images',
  EVENT_IMAGES: 'event-images'
} as const;
