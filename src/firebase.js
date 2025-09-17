import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정 - chungju-friendship 프로젝트
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCF3QedExhHUJ8wH8zdp8VNz7Ubw7VmlQo",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "chungju-friendship.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "chungju-friendship",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "chungju-friendship.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "377046428444",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:377046428444:web:fa6b97744f4a10fbf868d9"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스 초기화
export const db = getFirestore(app);

export default app;