import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp,
  Query,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

// Import Firebase instances from the main firebase.ts file
import { db, storage, auth } from './firebase';

// User Roles and Permissions
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export interface UserPermissions {
  canManageUsers: boolean;
  canManageInstructors: boolean;
  canManageBlog: boolean;
  canManageMerchandise: boolean;
  canUploadImages: boolean;
  canExportData: boolean;
  canDeleteContent: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageInstructors: true,
    canManageBlog: true,
    canManageMerchandise: true,
    canUploadImages: true,
    canExportData: true,
    canDeleteContent: true,
  },
  [UserRole.MODERATOR]: {
    canManageUsers: false,
    canManageInstructors: true,
    canManageBlog: true,
    canManageMerchandise: true,
    canUploadImages: true,
    canExportData: true,
    canDeleteContent: false,
  },
  [UserRole.EDITOR]: {
    canManageUsers: false,
    canManageInstructors: false,
    canManageBlog: true,
    canManageMerchandise: false,
    canUploadImages: true,
    canExportData: false,
    canDeleteContent: false,
  },
  [UserRole.VIEWER]: {
    canManageUsers: false,
    canManageInstructors: false,
    canManageBlog: false,
    canManageMerchandise: false,
    canUploadImages: false,
    canExportData: false,
    canDeleteContent: false,
  },
};

// User Management
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  permissions: UserPermissions;
  isActive: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

export const userService = {
  // Get current user
  getCurrentUser: (): FirebaseUser | null => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Sign out
  signOut: async () => {
    await signOut(auth);
  },

  // Get user profile from Firestore
  getUserProfile: async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Create user profile
  createUserProfile: async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const userRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
      });
      return userRef.id;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (uid: string, updates: Partial<User>) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Check if user has permission
  hasPermission: (user: User | null, permission: keyof UserPermissions): boolean => {
    if (!user || !user.isActive) return false;
    return user.permissions[permission] || false;
  },
};

// Image Upload Service
export const imageService = {
  // Upload image to Firebase Storage
  uploadImage: async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      
      // Add metadata to help with CORS
      const metadata = {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      };
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Handle CORS errors specifically
      if (error.code === 'storage/unauthorized' || error.message?.includes('CORS')) {
        console.error('CORS error detected. Please check Firebase Storage CORS configuration.');
        throw new Error('Image upload failed due to CORS configuration. Please try again or contact support.');
      }
      
      throw error;
    }
  },

  // Delete image from Firebase Storage
  deleteImage: async (imageUrl: string): Promise<void> => {
    try {
      // Extract the path from the full URL
      const url = new URL(imageUrl);
      const path = url.pathname.split('/o/')[1]?.split('?')[0];
      
      if (!path) {
        throw new Error('Invalid image URL format');
      }
      
      const decodedPath = decodeURIComponent(path);
      const imageRef = ref(storage, decodedPath);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Generate unique filename
  generateFileName: (originalName: string, prefix: string = ''): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${prefix}${timestamp}_${randomString}.${extension}`;
  },
};

// Data Export/Import Service
export const dataService = {
  // Export data to JSON
  exportData: async (collectionName: string, filters?: any): Promise<any[]> => {
    try {
      let q: Query<DocumentData> = collection(db, collectionName);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          q = query(q, where(key, '==', value));
        });
      }
      
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  // Import data from JSON
  importData: async (collectionName: string, data: any[]): Promise<void> => {
    try {
      const batch = writeBatch(db);
      
      data.forEach((item) => {
        const { id, ...itemData } = item;
        const docRef = doc(collection(db, collectionName), id);
        batch.set(docRef, {
          ...itemData,
          importedAt: serverTimestamp(),
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  },

  // Download data as JSON file
  downloadAsJSON: (data: any[], filename: string): void => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

// Real-time Listeners Service
export const realtimeService = {
  // Listen to collection changes
  onCollectionChange: <T>(
    collectionName: string,
    callback: (data: T[]) => void,
    filters?: any,
    orderByField?: string,
    limitCount?: number
  ) => {
    let q: Query<DocumentData> = collection(db, collectionName);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        q = query(q, where(key, '==', value));
      });
    }
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, 'desc'));
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      callback(data);
    });
  },

  // Listen to single document changes
  onDocumentChange: <T>(
    collectionName: string,
    docId: string,
    callback: (data: T | null) => void
  ) => {
    const docRef = doc(db, collectionName, docId);
    
    return onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = { id: docSnapshot.id, ...docSnapshot.data() } as T;
        callback(data);
      } else {
        callback(null);
      }
    });
  },
};

// Enhanced CRUD Services with real-time updates
export const createCRUDService = <T extends { id?: string }>(
  collectionName: string
) => ({
  // Create document
  create: async (data: Omit<T, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
      throw error;
    }
  },

  // Read single document
  read: async (id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error reading ${collectionName}:`, error);
      throw error;
    }
  },

  // Read all documents
  readAll: async (filters?: any): Promise<T[]> => {
    try {
      let q: Query<DocumentData> = collection(db, collectionName);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          q = query(q, where(key, '==', value));
        });
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error reading ${collectionName}:`, error);
      throw error;
    }
  },

  // Update document
  update: async (id: string, data: Partial<T>): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      throw error;
    }
  },

  // Delete document
  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error);
      throw error;
    }
  },

  // Listen to real-time updates
  onSnapshot: (
    callback: (data: T[]) => void,
    filters?: any,
    orderByField?: string,
    limitCount?: number
  ) => {
    return realtimeService.onCollectionChange<T>(
      collectionName,
      callback,
      filters,
      orderByField,
      limitCount
    );
  },
});

// Specific service instances
export const instructorService = createCRUDService<any>('instructors');
export const blogService = createCRUDService<any>('blog_posts');
export const productService = createCRUDService<any>('products');
export const categoryService = createCRUDService<any>('categories');
export const orderService = createCRUDService<any>('orders');
export const galleryService = createCRUDService<any>('gallery');

// Test Firebase connection
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    const testDoc = await getDocs(collection(db, 'test'));
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Legacy services (keeping for backward compatibility)
export const ticketService = {
  createTicket: async (ticketData: any) => {
    try {
      const docRef = await addDoc(collection(db, 'tickets'), {
        ...ticketData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },
};

export const emailService = {
  sendTicketConfirmation: async (ticketData: any, eventData: any) => {
    // TODO: Implement actual email service
    console.log('Sending ticket confirmation:', { ticketData, eventData });
    return true;
  },
};

// Event interface for backward compatibility
export interface Event {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  price: number;
  maxTickets: number;
  availableTickets: number;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}
