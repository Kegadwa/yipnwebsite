import { ref, uploadBytes, getDownloadURL, listAll, deleteObject, getMetadata } from 'firebase/storage';
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

  // Check if we have a network connection
  private async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch {
      return false;
    }
  }

  // Add timeout wrapper for Firebase operations
  private async withTimeout<T>(operation: Promise<T>, timeoutMs: number = 30000): Promise<T> {
    return Promise.race([
      operation,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      )
    ]);
  }

  // Upload a single image to a specific folder
  async uploadImage(file: File, folderPath: string): Promise<string> {
    try {
      console.log(`Starting upload for file: ${file.name} to folder: ${folderPath}`);
      
      // Validate file
      if (!file || file.size === 0) {
        throw new Error('Invalid file provided');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only images are allowed.');
      }
      
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const fullPath = `${folderPath}/${fileName}`;
      const storageRef = ref(this.storage, fullPath);
      
      console.log(`Uploading to path: ${fullPath}`);
      
      // Add metadata for better handling
      const metadata = {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          folder: folderPath
        }
      };
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      console.log(`Upload completed, getting download URL...`);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log(`Image uploaded successfully to ${fullPath}`);
      console.log(`Download URL: ${downloadURL}`);
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Provide more specific error messages
      if (error.code) {
        switch (error.code) {
          case 'storage/unauthorized':
            throw new Error('Permission denied. Please check your Firebase configuration and authentication.');
          case 'storage/canceled':
            throw new Error('Upload was canceled.');
          case 'storage/unknown':
            throw new Error('Unknown error occurred during upload.');
          case 'storage/invalid-format':
            throw new Error('Invalid file format.');
          case 'storage/invalid-checksum':
            throw new Error('File corruption detected. Please try again.');
          case 'storage/quota-exceeded':
            throw new Error('Storage quota exceeded. Please contact administrator.');
          case 'storage/unauthenticated':
            throw new Error('Authentication required. Please sign in.');
          case 'storage/retry-limit-exceeded':
            throw new Error('Upload failed after multiple attempts. Please check your connection and try again.');
          case 'storage/invalid-event-name':
            throw new Error('Invalid event name in upload process.');
          case 'storage/invalid-url':
            throw new Error('Invalid URL generated for upload.');
          case 'storage/invalid-argument':
            throw new Error('Invalid argument provided to upload function.');
          case 'storage/no-default-bucket':
            throw new Error('No default storage bucket configured.');
          case 'storage/cannot-slice-blob':
            throw new Error('Cannot process the file. Please try a different file.');
          case 'storage/server-file-wrong-size':
            throw new Error('File size mismatch. Please try uploading again.');
        }
      }
      
      // Check for network/connection errors
      if (error.message) {
        if (error.message.includes('retry-limit-exceeded') || 
            error.message.includes('network') ||
            error.message.includes('timeout') ||
            error.message.includes('fetch')) {
          throw new Error('Network connection issue. Please check your internet connection and try again.');
        }
        
        if (error.message.includes('unauthorized') || 
            error.message.includes('permission-denied') ||
            error.message.includes('403')) {
          throw new Error('Permission denied. Please check your Firebase configuration and rules.');
        }

        if (error.message.includes('CORS') || 
            error.message.includes('cors')) {
          throw new Error('CORS error detected. Please check your Firebase storage configuration.');
        }
      }
      
      throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    }
  }

  // Get all images from a specific folder with retry logic
  async getImagesFromFolder(folderPath: string, maxRetries: number = 3): Promise<StorageImage[]> {
    let lastError: any;
    
    // Check connection before starting
    const hasConnection = await this.checkConnection();
    if (!hasConnection) {
      throw new Error('No internet connection detected. Please check your network and try again.');
    }
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempting to load images from folder: ${folderPath} (attempt ${attempt}/${maxRetries})`);
        
        const folderRef = ref(this.storage, folderPath);
        const result = await this.withTimeout(listAll(folderRef), 15000);
        
        console.log(`Found ${result.items.length} items in folder: ${folderPath}`);
        
        const images: StorageImage[] = [];
        
        // Process items in batches to avoid overwhelming the connection
        const batchSize = 5;
        for (let i = 0; i < result.items.length; i += batchSize) {
          const batch = result.items.slice(i, i + batchSize);
          
          const batchPromises = batch.map(async (itemRef) => {
            try {
              console.log(`Processing item: ${itemRef.name}`);
              const url = await this.withTimeout(getDownloadURL(itemRef), 10000);
              const metadata = await this.getMetadata(itemRef.fullPath);
              
              return {
                name: itemRef.name,
                url,
                path: itemRef.fullPath,
                size: metadata.size || 0,
                contentType: metadata.contentType || 'image/jpeg',
                createdAt: new Date(metadata.timeCreated || Date.now())
              };
            } catch (error) {
              console.warn(`Failed to get metadata for ${itemRef.name}:`, error);
              return null;
            }
          });
          
          const batchResults = await Promise.all(batchPromises);
          const validResults = batchResults.filter(result => result !== null) as StorageImage[];
          images.push(...validResults);
          
          // Add a small delay between batches to prevent overwhelming the connection
          if (i + batchSize < result.items.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        // Sort by creation date (newest first)
        images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        console.log(`Successfully loaded ${images.length} images from ${folderPath}`);
        return images;
      } catch (error) {
        lastError = error;
        console.error(`Error getting images from folder (attempt ${attempt}/${maxRetries}):`, error);
        
        // Check if it's a retryable error
        if (error instanceof Error) {
          const isRetryable = error.message.includes('retry-limit-exceeded') || 
                             error.message.includes('network') ||
                             error.message.includes('timeout') ||
                             error.message.includes('fetch') ||
                             error.message.includes('connection');
          
          if (isRetryable && attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        
        // If it's the last attempt or not retryable, throw the error
        if (attempt === maxRetries) {
          break;
        }
      }
    }
    
    // Handle the final error
    if (lastError instanceof Error) {
      if (lastError.message.includes('retry-limit-exceeded') || 
          lastError.message.includes('network') ||
          lastError.message.includes('timeout')) {
        throw new Error('Network connection issue. Please check your internet connection and try again.');
      }
    }
    
    throw new Error(`Failed to get images from folder after ${maxRetries} attempts: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`);
  }

  // Get metadata for a file
  private async getMetadata(filePath: string) {
    try {
      const fileRef = ref(this.storage, filePath);
      const metadata = await getMetadata(fileRef);
      return {
        size: metadata.size || 0,
        contentType: metadata.contentType || 'image/jpeg',
        timeCreated: metadata.timeCreated || Date.now()
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

