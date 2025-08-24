import {
	collection,
	doc,
	addDoc,
	updateDoc,
	deleteDoc,
	getDocs,
	getDoc,
	query,
	where,
	orderBy,
	limit,
	serverTimestamp,
	Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

// Test Firebase connection
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Just test if we can access Firestore without trying to read specific collections
    // This will fail with permissions error if the connection is working but rules are restrictive
    const testQuery = query(collection(db, 'products'), limit(1));
    await getDocs(testQuery);
    return true;
  } catch (error: unknown) {
    console.error('Firebase connection test failed:', error);
    
    // If it's a permissions error, the connection is working but rules are restrictive
    if (error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied') {
      console.log('Firebase connection successful, but permissions are restrictive');
      return true; // Connection is working, just need to set up security rules
    }
    
    // If it's a different error, the connection might be failing
    return false;
  }
};

// Types
export interface Event {
  id?: string;
  title: string;
  description: string;
  date: Date | Timestamp;
  time: string;
  location: string;
  price: number;
  maxTickets: number;
  availableTickets: number;
  imageUrl?: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Ticket {
  id?: string;
  eventId: string;
  eventTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod: string;
  ticketNumber: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  tags: string[];
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GalleryMedia {
  id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: 'edition-1' | 'edition-2' | 'user-submitted';
  tags: string[];
  photographer?: string;
  location?: string;
  date?: Date;
  isApproved: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Order {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Event Services
export const eventService = {
  // Create new event
  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get all events
  async getAllEvents(): Promise<Event[]> {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    } catch (error) {
      console.error('Error getting events:', error);
      throw new Error(`Failed to get events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get upcoming events
  async getUpcomingEvents(): Promise<Event[]> {
    try {
      // Simplified query to avoid index requirements
      const q = query(
        collection(db, 'events'),
        where('status', '==', 'upcoming')
        // Removed date filter and orderBy to avoid composite index requirement
      );
      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      
      // Filter and sort in memory instead of in the query
      const now = new Date();
      return events
        .filter(event => {
          if (!event.date) return false;
          const eventDate = event.date instanceof Date ? event.date : event.date.toDate();
          return eventDate >= now;
        })
        .sort((a, b) => {
          const dateA = a.date instanceof Date ? a.date : a.date.toDate();
          const dateB = b.date instanceof Date ? b.date : b.date.toDate();
          return dateA.getTime() - dateB.getTime();
        });
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      throw new Error(`Failed to get upcoming events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get event by ID
  async getEventById(eventId: string): Promise<Event | null> {
    try {
      const docRef = doc(db, 'events', eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Event;
      }
      return null;
    } catch (error) {
      console.error('Error getting event:', error);
      throw new Error(`Failed to get event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Update event
  async updateEvent(eventId: string, eventData: Partial<Event>): Promise<void> {
    try {
      const docRef = doc(db, 'events', eventId);
      await updateDoc(docRef, {
        ...eventData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Delete event
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const docRef = doc(db, 'events', eventId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Ticket Services
export const ticketService = {
  // Create new ticket
  async createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'tickets'), {
        ...ticketData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw new Error(`Failed to create ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get all tickets
  async getAllTickets(): Promise<Ticket[]> {
    try {
      const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
    } catch (error) {
      console.error('Error getting tickets:', error);
      throw new Error(`Failed to get tickets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get tickets by event
  async getTicketsByEvent(eventId: string): Promise<Ticket[]> {
    try {
      // Simplified query to avoid index requirements
      const q = query(
        collection(db, 'tickets'),
        where('eventId', '==', eventId)
        // Removed orderBy to avoid index requirement
      );
      const querySnapshot = await getDocs(q);
      const tickets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      
      // Sort in memory instead of in the query
      return tickets.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      });
    } catch (error) {
      console.error('Error getting tickets by event:', error);
      throw new Error(`Failed to get tickets by event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: Ticket['status']): Promise<void> {
    try {
      const docRef = doc(db, 'tickets', ticketId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw new Error(`Failed to update ticket status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Product Services
export const productService = {
  // Create new product
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      // Simplified query to avoid index requirements
      const q = query(
        collection(db, 'products'),
        where('isActive', '==', true)
        // Temporarily removed orderBy to avoid index requirement
        // orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // Sort in memory instead of in the query
      return products.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      });
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error(`Failed to get products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      // Simplified query to avoid index requirements
      const q = query(
        collection(db, 'products'),
        where('category', '==', category),
        where('isActive', '==', true)
        // Temporarily removed orderBy to avoid index requirement
        // orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // Sort in memory instead of in the query
      return products.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      });
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw new Error(`Failed to get products by category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get product by ID
  async getProductById(productId: string): Promise<Product | null> {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw new Error(`Failed to get product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Update product
  async updateProduct(productId: string, productData: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Delete product (soft delete)
  async deleteProduct(productId: string): Promise<void> {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Update product stock
  async updateProductStock(productId: string, newStock: number): Promise<void> {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        stock: newStock,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw new Error(`Failed to update product stock: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Create a simple test product (for testing purposes)
  async createTestProduct(): Promise<string> {
    try {
      const testProduct = {
        name: "Test Yoga Mat",
        description: "A test product to verify database connection",
        price: 2500,
        category: "mats",
        stock: 10,
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        tags: ["test", "yoga", "mat"],
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'products'), testProduct);
      return docRef.id;
    } catch (error) {
      console.error('Error creating test product:', error);
      throw new Error(`Failed to create test product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Initialize products collection with sample data if empty
  async initializeProductsCollection(): Promise<void> {
    try {
      // Check if products collection exists and has data
      const productsQuery = query(collection(db, 'products'), limit(1));
      const snapshot = await getDocs(productsQuery);
      
      if (snapshot.empty) {
        console.log('Products collection is empty, creating sample products...');
        
        const sampleProducts = [
          {
            name: "YIPN Premium Yoga Mat",
            description: "High-quality non-slip yoga mat with YIPN branding",
            price: 3500,
            category: "mats",
            stock: 25,
            imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
            tags: ["yoga", "mat", "premium", "non-slip"],
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          {
            name: "Wellness Journal",
            description: "Beautiful journal for tracking your wellness journey",
            price: 1200,
            category: "accessories",
            stock: 15,
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            tags: ["journal", "wellness", "tracking"],
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          {
            name: "Meditation Cushion",
            description: "Comfortable cushion for meditation practice",
            price: 1800,
            category: "wellness",
            stock: 20,
            imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
            tags: ["meditation", "cushion", "comfort"],
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        ];
        
        // Create sample products
        for (const product of sampleProducts) {
          await addDoc(collection(db, 'products'), product);
        }
        
        console.log('Sample products created successfully');
      }
    } catch (error) {
      console.error('Error initializing products collection:', error);
      // Don't throw error here as this is just initialization
    }
  },
};

// Gallery Services
export const galleryService = {
  // Create new media
  async createMedia(mediaData: Omit<GalleryMedia, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'gallery'), {
        ...mediaData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating media:', error);
      throw new Error(`Failed to create media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get all media
  async getAllMedia(): Promise<GalleryMedia[]> {
    try {
      const q = query(
        collection(db, 'gallery'),
        where('isApproved', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryMedia[];
    } catch (error) {
      console.error('Error getting media:', error);
      throw new Error(`Failed to get media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get media by category
  async getMediaByCategory(category: GalleryMedia['category']): Promise<GalleryMedia[]> {
    try {
      const q = query(
        collection(db, 'gallery'),
        where('category', '==', category),
        where('isApproved', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryMedia[];
    } catch (error) {
      console.error('Error getting media by category:', error);
      throw new Error(`Failed to get media by category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get user submitted media (pending approval)
  async getPendingMedia(): Promise<GalleryMedia[]> {
    try {
      const q = query(
        collection(db, 'gallery'),
        where('isApproved', '==', false),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryMedia[];
    } catch (error) {
      console.error('Error getting pending media:', error);
      throw new Error(`Failed to get pending media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Approve media
  async approveMedia(mediaId: string): Promise<void> {
    try {
      const docRef = doc(db, 'gallery', mediaId);
      await updateDoc(docRef, {
        isApproved: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error approving media:', error);
      throw new Error(`Failed to approve media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Delete media
  async deleteMedia(mediaId: string): Promise<void> {
    try {
      const docRef = doc(db, 'gallery', mediaId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting media:', error);
      throw new Error(`Failed to delete media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Order Services
export const orderService = {
  // Create new order
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error getting orders:', error);
      throw new Error(`Failed to get orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error(`Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Analytics Services
export const analyticsService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const [events, tickets, products, orders] = await Promise.all([
        getDocs(collection(db, 'events')),
        getDocs(collection(db, 'tickets')),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'orders')),
      ]);

      const totalEvents = events.size;
      const totalTickets = tickets.size;
      const totalProducts = products.size;
      const totalOrders = orders.size;

      // Calculate revenue from tickets
      let ticketRevenue = 0;
      tickets.forEach(doc => {
        const data = doc.data() as Ticket;
        if (data.status === 'confirmed') {
          ticketRevenue += data.totalAmount;
        }
      });

      // Calculate revenue from orders
      let orderRevenue = 0;
      orders.forEach(doc => {
        const data = doc.data() as Order;
        if (data.status === 'delivered') {
          orderRevenue += data.totalAmount;
        }
      });

      return {
        totalEvents,
        totalTickets,
        totalProducts,
        totalOrders,
        ticketRevenue,
        orderRevenue,
        totalRevenue: ticketRevenue + orderRevenue,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw new Error(`Failed to get dashboard stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Image upload service
export const imageService = {
	// Upload image to Firebase Storage
	async uploadImage(file: File, folder: string = 'products'): Promise<string> {
		try {
			// Create a unique filename
			const timestamp = Date.now();
			const fileName = `${folder}/${timestamp}_${file.name}`;
			const storageRef = ref(storage, fileName);
			
			// Upload the file
			const snapshot = await uploadBytes(storageRef, file);
			
			// Get the download URL
			const downloadURL = await getDownloadURL(snapshot.ref);
			
			return downloadURL;
		} catch (error) {
			console.error('Error uploading image:', error);
			throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	},

	// Delete image from Firebase Storage
	async deleteImage(imageUrl: string): Promise<void> {
		try {
			// Extract the path from the URL
			const url = new URL(imageUrl);
			const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0] || '');
			
			if (path) {
				const storageRef = ref(storage, path);
				await deleteObject(storageRef);
			}
		} catch (error) {
			console.error('Error deleting image:', error);
			// Don't throw error as this is not critical
		}
	},

	// Get image preview URL (for display before upload)
	getImagePreview(file: File): string {
		return URL.createObjectURL(file);
	},

	// Revoke object URL to free memory
	revokeImagePreview(url: string): void {
		URL.revokeObjectURL(url);
	}
};

// Email service
export const emailService = {
	// Send ticket confirmation email
	async sendTicketConfirmation(ticket: Ticket, event: Event): Promise<void> {
		// This would integrate with your email service (SendGrid, AWS SES, etc.)
		console.log('Sending ticket confirmation email:', { ticket, event });
		// Placeholder implementation
	},

	// Send order confirmation email
	async sendOrderConfirmation(order: Order): Promise<void> {
		console.log('Sending order confirmation email:', order);
		// Placeholder implementation
	},

	// Send event reminder email
	async sendEventReminder(event: Event, attendee: { name: string; email: string }): Promise<void> {
		console.log('Sending event reminder email:', { event, attendee });
		// Placeholder implementation
	}
};
