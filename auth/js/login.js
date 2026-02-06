import { auth, db } from "../api/firebase-config.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ensureUserDocument } from "../api/auth-api.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("signin-email");
const passwordInput = document.getElementById("signin-password");
const message = document.getElementById("message");
const streakMessage = document.getElementById("streak-message");
const googleSignInBtn = document.getElementById("google-signin");

async function updateStreak(user) {
  const profileRef = doc(db, "users", user.uid, "public", "profile");
  const snap = await getDoc(profileRef);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 1;
  let lastLogin = null;

  if (snap.exists()) {
    const data = snap.data();
    streak = data.streak || 0;
    lastLogin = data.lastLogin ? data.lastLogin.toDate() : null;
  }

  if (lastLogin) {
    lastLogin.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) streak += 1;
    else if (diffDays > 1) streak = 1;
  }

  await updateDoc(profileRef, {
    streak,
    lastLogin: Timestamp.fromDate(today)
  });

  streakMessage.textContent = `🔥 ${streak}-day streak`;
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const cred = await signInWithEmailAndPassword(
      auth,
      emailInput.value.trim(),
      passwordInput.value
    );

    await ensureUserDocument(cred.user);
    await updateStreak(cred.user);

    message.textContent = "Login successful!";
    message.style.color = "green";

    setTimeout(() => window.location.href = "/index24.html", 800);

  } catch (error) {
    console.error(error);
    message.textContent = "Invalid email or password.";
    message.style.color = "red";
  }
});

googleSignInBtn.addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);

    await ensureUserDocument(cred.user);
    await updateStreak(cred.user);

    message.textContent = "Login successful!";
    message.style.color = "green";

    setTimeout(() => window.location.href = "/index24.html", 800);

  } catch (error) {
    console.error(error);
    message.textContent = "Google sign-in failed.";
    message.style.color = "red";
  }
});
