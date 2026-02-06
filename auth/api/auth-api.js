import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail 
} from "firebase/auth";

import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "./firebase-config.js";

export async function signUp(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function updateUserProfile(user, data) {
  return await updateProfile(user, data);
}

export async function resetPassword(email) {
  return await sendPasswordResetEmail(auth, email);
}

export async function ensureUserDocument(user, displayName) {
  if (!user) return;


  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      createdAt: Timestamp.now()
    });
  }

  const publicRef = doc(db, "users", user.uid, "public", "profile");
  const publicSnap = await getDoc(publicRef);
  if (!publicSnap.exists()) {
    await setDoc(publicRef, {
      name: displayName || "Unnamed",
      streak: 1,
      language: "en",
      location: "",
    });
  }

  const privateRef = doc(db, "users", user.uid, "private", "account");
  const privateSnap = await getDoc(privateRef);
  if (!privateSnap.exists()) {
    await setDoc(privateRef, {
      email: user.email || "",
      isAdmin: false,
    });
  }
}

