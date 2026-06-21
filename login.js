import { auth, signInWithEmailAndPassword } from "./firebaseConfig.js";
import { showMessage } from "./uiMessage.js";

let login = document.querySelector("#login-form");
let EmailInpt = document.querySelector("#Email-input");
let PassInput = document.querySelector("#password-input");

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

// form submit
login.addEventListener("submit", (e) => {
    e.preventDefault();
    loginUser();
});