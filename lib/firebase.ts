import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyADXcyjpGO4rkDOri1LSxnoDvRJ5t30XG8",
  authDomain: "thewebsite-3cd60.firebaseapp.com",
  projectId: "thewebsite-3cd60",
  storageBucket: "thewebsite-3cd60.appspot.com",
  messagingSenderId: "321355070137",
  appId: "1:321355070137:web:215f46eaf744e7dc4f3968"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app, firebaseConfig.storageBucket);
export const auth = getAuth(app);

export default app;
