import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDCmYcn7Fe95kVz0IPTGlShUh82SySrJrA",
  authDomain: "grieenbi-home.firebaseapp.com",
  projectId: "grieenbi-home",
  storageBucket: "grieenbi-home.firebasestorage.app",
  messagingSenderId: "323560629953",
  appId: "1:323560629953:web:cd38ea412673a914df1640",
  measurementId: "G-9EYFWEVJFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
