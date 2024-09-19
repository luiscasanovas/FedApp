// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoiIdjavAphAr77_mys6lyf9n9rhvE4f4",
  authDomain: "feedmeapp-2261c.firebaseapp.com",
  projectId: "feedmeapp-2261c",
  storageBucket: "feedmeapp-2261c.appspot.com",
  messagingSenderId: "140894208905",
  appId: "1:140894208905:web:c309c353a92a1f8d4f1758"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
