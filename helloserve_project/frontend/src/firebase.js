// firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  connectAuthEmulator 
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your Firebase configuration (from console)
const firebaseConfig = {
  apiKey: "AIzaSyBJBW5t-HjauGHM_Zm8EuckZpBqaWa23oI",
  authDomain: "helloserve247.firebaseapp.com",
  projectId: "helloserve247",
  storageBucket: "helloserve247.appspot.com", 
  messagingSenderId: "236040776331",
  appId: "1:236040776331:web:9fc879e3c786585383428e",
  measurementId: "G-0SNYQ3K8H9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Configure Google Auth Provider
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === 'development') {
  /*
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  */
}

// Export auth functions (signOut is exported for the helper below)
export { signInWithPopup, onAuthStateChanged }; 

// Helper function for Sign-Out - CRITICAL EXPORT
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
    return true;
  } catch (error) {
    console.error('Sign-out error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

// Helper function to get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// ... (Rest of firebase.js content - omitted for brevity)

// Default export
export default app;