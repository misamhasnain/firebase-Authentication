import { addDoc,getAuth, auth, collection, createUserWithEmailAndPassword, db } from "./firebaseConfig.js";

let register = document.querySelector("#register-form");
let EmailInpt = document.querySelector("#Email-input");
let PassInput = document.querySelector("#password-input");
let submitBtn = document.querySelector("#sudmit-btn");


let validataFrom = ()=>{
    if (EmailInpt.value.length < 3 || PassInput.value.length < 4) {
        console.error(new Error("All fields must be filled!"))
        alert("Password must be at least 4 characters");

        return false
    }
    return true;
}


let addUserInDB = async (user)=>{
    try {
        console.log("user for add func =>" , user);

        // add doc in users collection
        let userdata = {
            uid : user?.uid,
            displayName : user?.displayName,
            email : user?.emil,
            phoneNumber : user?.phoneNumber
        }

        await addDoc(collection(db, 'users'), userdata)
        .then(() => {
            console.log("user stored in db");
            // add uid to localstorage
            window.localStorage.setItem('uid', JSON.stringify(userdata.uid))

        })
        
    } catch (error) {
        console.error(new Error('error in adding user to db!'))
        console.error(error);
        
    }
}




let creatUser = async ()=>{
    try {
        if(!validataFrom()){
            console.error(new Error("user account can not be created!"))
            return
        }

        const auth = getAuth();
       await createUserWithEmailAndPassword(auth, EmailInpt.value, PassInput.value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log("success!");
    console.log("userCredential =>", user)
    
    addUserInDB(user).then(()=>window.location.replace("./dashboard.html"));
    
    // ...
  })
    } catch (error) {


    console.error(error);
    
    }
}



register.addEventListener("submit" , (e)=>{
    e.preventDefault();
    if (validataFrom()) {
        creatUser();
    }
    
})