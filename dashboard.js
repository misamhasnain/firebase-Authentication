import { showMessage } from "./uiMessage.js";
import { requireGuest } from "./auth-guard.js";
import { addDoc, auth, collection, db, deleteDoc, doc, getAuth, getDocs, onAuthStateChanged, query, where, signOut, deleteUser } from "./firebaseConfig.js";
let sigoutBtn = document.querySelector("#sigout-btn");
let deleteBtn = document.querySelector("#delete-btn");
let userId = null;
let currentUserData = null;
let posts = [];
let postInp = document.querySelector("#post-inp");
let postBtn = document.querySelector("#post-btn");
let postMain = document.querySelector(".post-main");

let getCurrentUser = () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.replace("./index.html");
            return;
        }

        userId = user.uid;
        console.log("current uid =>", userId);

        getUser();
        userPost();
    });
}

getCurrentUser();

/// delete user data from db
let deleteUserFromDb = async () => {
    try {
        if (currentUserData?.id) {
            await deleteDoc(doc(db, "users", currentUserData.id));
            console.log("successfully user deleted from db.");
        }
    } catch (error) {
        console.error("error in deleting user from db.", error);
    }
}

/// delete user account
let deleteUserAccount = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return;

        showMessage("Deleting account...", "info");

        await deleteUserFromDb();
        console.log("User data deleted from DB");

        await deleteUser(user);

        console.log("User deleted from Auth");

        showMessage("Account deleted successfully", "success");

        window.location.replace("./index.html");

    } catch (error) {
        console.error("Delete failed:", error);
        showMessage("Failed to delete account", "error");
    }
}

// get user from db using uid
let getUser = async () => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            currentUserData = { id: doc.id, ...doc.data() };
        });
    } catch (error) {
        console.log("error in getting user data from db", error);
    }
}


let userSignOut = async () => {
    try {
        await signOut(auth);
                showMessage("Signed out successfully", "info");

        console.log('success on sign out');
        requireGuest();


         setTimeout(() => {
            window.location.replace("./index.html");
        }, 1000);

    } catch (error) {
        console.log('error on sign out => ', error);
        showMessage("Sign out failed", "error");
    }
}

let create = async () => {
    try {
        if (!userId || postInp.value.trim().length < 1){
                        showMessage("Write something first", "error");
                        return;
                    } 
                        
        let newDate = new Date();

        await addDoc(collection(db, "posts"), {
            text: postInp.value,
            uid: userId,
            post_Id: newDate.getTime(),
        });

        postInp.value = "";
                showMessage("Post created successfully", "success");

        await userPost(); 

    } catch (error) {
        console.log(error);
                showMessage("Failed to create post", "error");

    }
}

let userPost = async () => {
    try {

        if (!userId) return;

        posts = [];

        const queryPost = query(
            collection(db, "posts"),
            where("uid", "==", userId)
        );

        let querySnapshot = await getDocs(queryPost);

        querySnapshot.forEach((post) => {
            posts.push({
                id: post.id,
                ...post.data()
            });
        });

        renderPosts();

    } catch (error) {
        console.log("Error fetching posts: ", error);
    }
}

// Render posts
let renderPosts = () => {
    postMain.innerHTML = "";

    if (posts.length === 0) {
        postMain.innerHTML = "<p>No posts yet</p>";
        return;
    }

    posts.forEach((post) => {
        postMain.innerHTML += `
            <div class="post">
                ${post.text}
            </div>
        `;
    });
}

deleteBtn.addEventListener("click", () => deleteUserAccount());
sigoutBtn.addEventListener("click", () => userSignOut());
postBtn.addEventListener("click", () => create());