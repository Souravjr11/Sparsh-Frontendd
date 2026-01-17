const API = "https://sparsh-backend-1prm.onrender.com";
console.log("JS Loaded");

const WHATSAPP_NUMBER = "919903634178";

function openWhatsApp() {
  const message = "Hello, I want to book a musical band";
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

window.openLogin = function () {
  document.getElementById("loginModal").style.display = "flex";
};

window.closeLogin = function () {
  document.getElementById("loginModal").style.display = "none";
};


document.addEventListener("DOMContentLoaded", function () {

  // ======= MOBILE MENU FIX =======
  const navMenu = document.getElementById("navMenu");
  const overlay = document.getElementById("overlay");

  // Make toggleMenu usable from HTML onclick="toggleMenu()"
  window.toggleMenu = function () {
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  // Close when clicking overlay
  overlay.addEventListener("click", () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Close when clicking menu links (About/Bands/Book)
  document.querySelectorAll("#navMenu a").forEach(a => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  });

  // ======= LOGIN SYSTEM =======
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const confirmPassword = document.getElementById("confirmPassword");
  const registerBtn = document.getElementById("registerBtn");
  const toggleRegister = document.getElementById("toggleRegister");
  const loginMsg = document.getElementById("loginMsg");

  function setModeRegister() {
    loginMsg.innerText = "";
    confirmPassword.style.display = "block";
    registerBtn.style.display = "block";
    toggleRegister.style.display = "none";
  }

  toggleRegister.addEventListener("click", setModeRegister);

  // LOGIN
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      loginMsg.innerText = "Please enter email and password";
      return;
    }

    fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("loggedIn", "yes");
          loginBtn.style.display = "none";
          logoutBtn.style.display = "inline";
          loginMsg.innerText = "Login successful";
          setTimeout(window.closeLogin, 800);
        } else {
          loginMsg.innerText = data.message || "Invalid email or password";
        }
      })
      .catch(() => {
        loginMsg.innerText = "Backend not reachable";
      });
  });

  // REGISTER
  registerBtn.addEventListener("click", function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = confirmPassword.value.trim();

    if (!email || !password || !confirm) {
      loginMsg.innerText = "Please fill all fields";
      return;
    }

    if (password !== confirm) {
      loginMsg.innerText = "Passwords do not match";
      return;
    }

    fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loginMsg.innerText = "Account created! Now login.";
          registerBtn.style.display = "none";
          confirmPassword.style.display = "none";
        } else {
          loginMsg.innerText = data.message || "Registration failed";
        }
      })
      .catch(() => {
        loginMsg.innerText = "Backend not reachable";
      });
  });

  // LOGOUT
  logoutBtn.addEventListener("click", async () => {
    // If firebase auth exists, sign out from Google too
    if (window.googleLogout) {
      try { await window.googleLogout(); } catch (e) {}
    }
  
    // Always clear your own session UI
    localStorage.removeItem("loggedIn");
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
    const badge = document.getElementById("userBadge");
    if (badge) badge.style.display = "none";
  });
  
  

  if (localStorage.getItem("loggedIn")) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
  }

  // ======= BOOKING FORM =======
  const bookingForm = document.getElementById("bookingForm");
  const bookMsg = document.getElementById("bookMsg");

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("bookName").value.trim();
      const phone = document.getElementById("bookPhone").value.trim();
      const band = document.getElementById("bookBand").value.trim();
      const date = document.getElementById("bookDate").value;

      if (!name || !phone || !band || !date) {
        bookMsg.innerText = "Please fill all booking details";
        return;
      }

      fetch(`${API}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, band, date })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            bookMsg.innerText = "Booking saved! Opening WhatsApp...";
            setTimeout(() => openWhatsApp(), 800);
            bookingForm.reset();
          } else {
            bookMsg.innerText = data.message || "Booking failed. Try again.";
          }
        })
        .catch(() => {
          bookMsg.innerText = "Backend not reachable";
        });
    });
  }

});
