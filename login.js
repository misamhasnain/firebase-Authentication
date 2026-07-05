import { auth,sendPasswordResetEmail, signInWithEmailAndPassword } from "./firebaseConfig.js";
import { showMessage } from "./uiMessage.js";

let login = document.querySelector("#login-form");
let EmailInpt = document.querySelector("#Email-input");
let PassInput = document.querySelector("#password-input");
let forgotLink = document.querySelector("#forgot-password-link"); // Forgot password selector



// validate form
let validateForm = () => {
    if (EmailInpt.value.length < 3 || PassInput.value.length < 4) {
        showMessage("Invalid email or password", "error");
        return false;
    }
    return true;
};













// login user
let loginUser = async () => {
    try {
        if (!validateForm()) return;

        const userCredential = await signInWithEmailAndPassword(auth,EmailInpt.value,PassInput.value);

        const user = userCredential.user;

        console.log("success on login");
        console.log("user =>", user);

        localStorage.setItem("uid", JSON.stringify(user.uid));

        showMessage("Login successful!", "success");

        setTimeout(() => {
            window.location.replace("./dashboard.html");
        }, 1000);

    } catch (error) {
        console.error(error);
        showMessage("Login failed. Check email/password", "error");
    }
};


// --- FORGOT PASSWORD LOGIC ADDED HERE ---
let resetPassword = async () => {
    let email = EmailInpt.value.trim();

    // Check agar user ne email input khali chora hai
    if (email.length < 3) {
        showMessage("Please enter your valid email address first.", "error");
        return;
    }

    try {
        // Firebase code reset email bhejne ke liye
        await sendPasswordResetEmail(auth, email);
        showMessage("Password reset link sent to your email!", "success");
    } catch (error) {
        console.error("Reset Error:", error);
        
        // Professional Error Handling aapke uiMessage ke sath
        if (error.code === "auth/user-not-found") {
            showMessage("No account found with this email.", "error");
        } else if (error.code === "auth/invalid-email") {
            showMessage("The email address is badly formatted.", "error");
        } else {
            showMessage("Failed to send reset email. Try again.", "error");
        }
    }
};






// form submit
login.addEventListener("submit", (e) => {
    e.preventDefault();
    loginUser();
});


// Click event for Forgot Password
forgotLink.addEventListener("click", (e) => {
    e.preventDefault(); // Page reload hone se rokne ke liye
    resetPassword();
});