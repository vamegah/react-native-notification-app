// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAr5iEZMefluhqvchJ-hrj3OQ27yiCXyOQ",
  authDomain: "media-manager-app-109c3.firebaseapp.com",
  projectId: "media-manager-app-109c3",
  storageBucket: "media-manager-app-109c3.firebasestorage.app",
  messagingSenderId: "706099214974",
  appId: "1:706099214974:web:f7f954e858e2870b3bf62f",
  measurementId: "G-MXPQGZGPKG"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
