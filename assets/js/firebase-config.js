import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkDQ80sVBO3K1NbaLU41D7ebcK8nihlSo",
  authDomain: "antim-fde23.firebaseapp.com",
  projectId: "antim-fde23",
  storageBucket: "antim-fde23.firebasestorage.app",
  messagingSenderId: "600792086326",
  appId: "1:600792086326:web:488fcbb0855ccd1907e597"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
