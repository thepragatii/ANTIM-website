<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDkDQ80sVBO3K1NbaLU41D7ebcK8nihlSo",
    authDomain: "antim-fde23.firebaseapp.com",
    projectId: "antim-fde23",
    storageBucket: "antim-fde23.firebasestorage.app",
    messagingSenderId: "600792086326",
    appId: "1:600792086326:web:488fcbb0855ccd1907e597",
    measurementId: "G-XXSFJVKWGL"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
