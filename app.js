import { addDoc, getAuth, auth, collection, createUserWithEmailAndPassword, db, signInWithPopup, GoogleAuthProvider } from "./firebaseConfig.js";

let register = document.querySelector("#register-form");
let EmailInpt = document.querySelector("#Email-input");
let PassInput = document.querySelector("#password-input");
let googleBtn = document.querySelector("#google-btn"); 

let validataFrom = ()=>{
    if (EmailInpt.value.length < 3 || PassInput.value.length < 4) {
        console.error(new Error("All fields must be filled!"));
        alert("Password must be at least 4 characters");
        return false;
    }
    return true;
}

let addUserInDB = async (user)=>{
    try {
        console.log("user for add func =>" , user);
        let userdata = {
            uid : user?.uid,
            displayName : user?.displayName || "Anonymous",
            email : user?.email, 
            phoneNumber : user?.phoneNumber || null
        }

        await addDoc(collection(db, 'users'), userdata);
        console.log("user stored in db");
        window.localStorage.setItem('uid', JSON.stringify(userdata.uid));
    } catch (error) {
        console.error('error in adding user to db!', error);
    }
}

let creatUser = async ()=>{
    try {
        if(!validataFrom()) return;
        const authInstance = getAuth();
        const userCredential = await createUserWithEmailAndPassword(authInstance, EmailInpt.value, PassInput.value);
        const user = userCredential.user;
        console.log("success!", user);
        await addUserInDB(user);
        window.location.replace("./dashboard.html");
    } catch (error) {
        console.error(error);
        
    }
}

let signWithGoogle = async ()=>{
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Success! Google user signed in:", user);
        await addUserInDB(user);
        window.location.replace("./dashboard.html");
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        
    }
};

register.addEventListener("submit" , (e)=>{
    e.preventDefault();
    creatUser();
});

if (googleBtn) {
    googleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        signWithGoogle();
    });
}