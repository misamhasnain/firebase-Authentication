import { requireAuth } from "./auth-guard.js";
import { auth,signInWithEmailAndPassword } from "./firebaseConfig.js";



let login = document.querySelector("#login-form");
let EmailInpt = document.querySelector("#Email-input");
let PassInput = document.querySelector("#password-input");
let submitBtn = document.querySelector("#submit-btn");


let validataFrom = ()=>{
    if (EmailInpt.value.length < 3 || PassInput.value.length < 4) {
        console.error(new Error("All fields must be filled!"))
        alert("Invalid email or password");

        return false
    }
    return true;
}

let loginUser =async ()=>{
    try {
        if (!validataFrom()) {
            console.error(new Error("user can not login!"))
            return
        }

        await signInWithEmailAndPassword(auth, EmailInpt.value, PassInput.value)
  ((userCredential) => {
    // Signed in 
    const auth = getAuth();
    const user = userCredential.user;
    // ...
                console.log("success on login")
                console.log("userCredential =>", user);
        window.localStorage.setItem('uid', JSON.stringify(user.uid))
        window.location.replace("./dashboard.html")
  })
    } catch (error) {
        console.error(error);
    }
}

login.addEventListener("submit" , (e)=>{
    e.preventDefault();
    if (validataFrom) {
        requireAuth();

        loginUser();
    }
})