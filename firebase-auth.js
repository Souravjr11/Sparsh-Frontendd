import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB5YtmBKUQdhqGKINm87jBYDB-N8EIny48",
    authDomain: "sparsh-events.firebaseapp.com",
    projectId: "sparsh-events",
    storageBucket: "sparsh-events.firebasestorage.app",
    messagingSenderId: "376857740098",
    appId: "1:376857740098:web:aeefed1a0096732777fedb",
    measurementId: "G-41KHPYMDR3"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.googleLogin = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    localStorage.setItem("loggedIn", "yes");

    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline";

    const badge = document.getElementById("userBadge");
    badge.style.display = "flex";
    document.getElementById("userName").innerText = user.displayName || user.email;
    document.getElementById("userPhoto").src = user.photoURL || "";

    document.getElementById("loginModal").style.display = "none";
  } catch (e) {
    alert("Google login failed: " + e.message);
  }
};

window.googleLogout = async function () {
  await signOut(auth);

  localStorage.removeItem("loggedIn");

  document.getElementById("loginBtn").style.display = "inline";
  document.getElementById("logoutBtn").style.display = "none";

  document.getElementById("userBadge").style.display = "none";
};