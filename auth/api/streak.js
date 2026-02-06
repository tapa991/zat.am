import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase-config.js";

  async function updateStreak(user) {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const profile = snap.data().public?.profile || {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 1;
    let lastLogin = snap.exists() && snap.data().lastLogin ? snap.data().lastLogin.toDate() : null;

    if (lastLogin) {
      lastLogin.setHours(0,0,0,0);
      const today = new Date();
      today.setHours(0,0,0,0);

      const diffDays = Math.floor((today - lastLogin) / (1000*60*60*24));

      if (diffDays === 1) streak = snap.data().streak + 1;
      else if (diffDays > 1) streak = 1; // missed days
      else streak = snap.data().streak; // already logged in today
    }

  // finally update Firestore
  await updateDoc(profileRef, {
    streak,
    lastLogin: Timestamp.now()
  });
  return streak;
}
