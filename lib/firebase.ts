import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Analytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADXcyjpGO4rkDOri1LSxnoDvRJ5t30XG8",
  authDomain: "thewebsite-3cd60.firebaseapp.com",
  projectId: "thewebsite-3cd60",
  storageBucket: "thewebsite-3cd60.firebasestorage.app",
  messagingSenderId: "321355070137",
  appId: "1:321355070137:web:215f46eaf744e7dc4f3968",
  measurementId: "G-Q687ZNB6V5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (only load on client/browser)
let analytics: Analytics | null = null;

// Safe analytics initialization
export const initializeAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window !== "undefined" && !analytics) {
    try {
      const { getAnalytics } = await import("firebase/analytics");
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn("Analytics initialization failed:", error);
    }
  }
  return analytics;
};

// Export analytics safely
export const getAnalytics = (): Analytics | null => analytics;

export { app };
