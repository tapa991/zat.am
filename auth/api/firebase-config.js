// Firebase Configuration for zat.am project
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDqib4xA11ewp4oIPFMG8qJdt0j9LVIeTA",
  authDomain: "fir-zatam.firebaseapp.com",
  projectId: "fir-zatam",
  storageBucket: "fir-zatam.firebasestorage.app",
  messagingSenderId: "204626553520",
  appId: "1:204626553520:web:29e63fb5329bd1bdb26975",
  measurementId: "G-529H8EQVCY"
};

const leaderboardConfig = {
  apiKey: "AIzaSyDqib4xA11ewp4oIPFMG8qJdt0j9LVIeTA",
  authDomain: "fir-zatam.firebaseapp.com",
  projectId: "fir-zatam",
  storageBucket: "fir-zatam.firebasestorage.app",
  messagingSenderId: "204626553520",
  appId: "1:204626553520:web:29e63fb5329bd1bdb26975",
};


// Initialize Leaderboard Database
const leaderboardApp = initializeApp(leaderboardConfig, "leaderboardApp");
const leaderboardDb = getFirestore(leaderboardApp);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  leaderboardDb
};
