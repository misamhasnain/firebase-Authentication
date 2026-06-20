import { requireGuest } from "./auth-guard.js";
import { addDoc, auth, collection, db, deleteDoc, doc, getAuth, getDocs, onAuthStateChanged, query, where, signOut, deleteUser } from "./firebaseConfig.js";
let sigoutBtn = document.querySelector("#sigout-btn");
let deleteBtn = document.querySelector("#delete-btn");
let userId = null;
let currentUserData = null;


//get user from local storge

/// get uid from localstorage
let getUserfromLocalStorage = () => {
    userId = JSON.parse(window.localStorage.getItem("uid"));
    console.log("uid = >", userId)
}
getUserfromLocalStorage();

/// detele user data from db
let deleteUserFromDb = async () => {
    try {
        await deleteDoc(doc(db, "users", currentUserData.id));
        console.log("successfully user deleted from db.")
    } catch (error) {
        console.error(new Error("error in deleting user from db."))
        console.error(error)
    }
}


/// detele user account
let deleteUserAccount = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return console.log("No user found");

        await deleteUser(user);

        console.log("Account deleted");

        if (currentUserData?.id) {
            await deleteUserFromDb();
        }

        window.location.replace("./index.html");

    } catch (error) {
        console.error("can't delete user account", error);
    }

}

// get user from db using uid
let getUser = async () => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", userId));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            currentUserData = { id: doc.id, ...doc.data() }
        });
    } catch (error) {
        // console.error(new Error('error in getting user data from db'));
        console.log(error);

    }
}
getUser().then(() => {

    console.log(currentUserData)
})



// sign out
let userSignOut = async () => {
    await signOut(auth).then(() => {
        // Sign-out successful.
        console.log('success on sign out')
        requireGuest();
    }).catch((error) => {
        // An error happened.
        console.log('error on sign out => ', error)
    });
}

deleteBtn.addEventListener("click", () => deleteUserAccount())
sigoutBtn.addEventListener("click", () => userSignOut())