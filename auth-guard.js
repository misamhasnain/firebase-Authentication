import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

export function requireAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.replace("dashboard.html");
        }
    });
}

export function requireGuest() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.replace("index.html");
        }
    });
}