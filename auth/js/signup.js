import { signUp, updateUserProfile, ensureUserDocument } from "../api/auth-api.js";

const signupForm = document.getElementById("signup-form");
const nameInput = document.getElementById("signup-name");
const emailInput = document.getElementById("signup-email");
const passwordInput = document.getElementById("signup-password");
const confirmPasswordInput = document.getElementById("signup-cpassword");
const message = document.getElementById("message");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // ---------- VALIDATION ----------
  if (!name) {
    message.textContent = "Please enter your full name.";
    message.style.color = "red";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match!";
    message.style.color = "red";
    return;
  }

  if (password.length < 8) {
    message.textContent = "Password must be at least 8 characters.";
    message.style.color = "red";
    return;
  }

  try {
    const userCred = await signUp(email, password);
    const user = userCred.user;

    await updateUserProfile(user, {
      displayName: name,
    });

    await user.reload();

  await ensureUserDocument(user, name); 


    message.textContent = "Account created! Redirecting to login...";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } catch (error) {
    console.error(error);
    message.textContent = error.message;
    message.style.color = "red";
  }
});
