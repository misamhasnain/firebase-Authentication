import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAnalytics  } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword  , deleteUser , signOut } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import { query, where, onSnapshot, deleteDoc, doc, setDoc, getFirestore, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import{onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCwMBiq3RBycBZNPukx0F19WZKrPpPDiHY",
  authDomain: "testing-3157e.firebaseapp.com",
  projectId: "testing-3157e",
  storageBucket: "testing-3157e.firebasestorage.app",
  messagingSenderId: "459621963161",
  appId: "1:459621963161:web:a0a9c58823356ca503ef08",
  measurementId: "G-F75JBVXDM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth,signInWithEmailAndPassword,signOut,deleteUser,onAuthStateChanged, createUserWithEmailAndPassword, onSnapshot, doc, setDoc, db, addDoc,getAuth, collection, getDocs, deleteDoc, where, query };

