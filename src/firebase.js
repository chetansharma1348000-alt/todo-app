import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwH_oDndIpicaZg5-bjpkdvL8Sg4MZJP0",
  authDomain: "todo-app-2ba91.firebaseapp.com",
  projectId: "todo-app-2ba91",
  storageBucket: "todo-app-2ba91.firebasestorage.app",
  messagingSenderId: "488839201030",
  appId: "1:488839201030:web:b9d7a35a1ec63c9b8f1e87",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
