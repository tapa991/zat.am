import { auth, db } from "../api/firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", async () => {
  const emailDiv = document.getElementById("user-email");
  const logoutBtn = document.getElementById("logout-btn");

  if (!emailDiv || !logoutBtn) return; // safety check

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // PUBLIC profile
    const profileRef = doc(db, "users", user.uid, "public", "profile");
    const profileSnap = await getDoc(profileRef);
    const profile = profileSnap.exists() ? profileSnap.data() : {};

    // PRIVATE account
    const accountRef = doc(db, "users", user.uid, "private", "account");
    const accountSnap = await getDoc(accountRef);
    const account = accountSnap.exists() ? accountSnap.data() : {};

    emailDiv.innerHTML = `
      <p>Name: ${profile.name || "No name found"}</p>
      <p>Email: ${account.email || user.email || "No email found"}</p>
      <p>🔥 Your current streak is: ${profile.streak || 0}</p>
    `;
  });

  logoutBtn.addEventListener("click", async () => {
    await auth.signOut();
    window.location.href = "login.html";
  });
});
