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

// 1. Auth State Observer (Single source of truth)
let getCurrentUser = () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.replace("./index.html");
            return;
        }

        userId = user.uid;
        console.log("current uid =>", userId);

        // Sirf tab chalenge jab valid userId mil jaye
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

        if (!user) {
            console.log("No user is currently logged in.");
            return;
        }

        
        await deleteUserFromDb(user).then(() =>{
            console.log("User data deleted from database successfully.");

            deleteUserFromDb().then(() =>{
                window.location.replace("./index.html")
            })
        });

        // 2. Phir user ko authentication se delete karein
        await deleteUser(user);
        console.log("Successfully account deleted from Auth.");

        // 3. Last mein redirect karein
        window.location.replace("./index.html");

    } catch (error) {
        console.error("Can't delete user account");
        console.error(error);
        
        // Ek aam error jo Firebase deta hai: auth/requires-recent-login
        if (error.code === 'auth/requires-recent-login') {
            alert("Security Alert: Please log in again before deleting your account.");
        }
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

// sign out
let userSignOut = async () => {
    try {
        await signOut(auth);
        console.log('success on sign out');
        requireGuest();


         setTimeout(() => {
            window.location.replace("./index.html");
        }, 1000);

    } catch (error) {
        console.log('error on sign out => ', error);
        howMessage("Sign out failed", "error");
    }
}

// Create Post
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

        await userPost(); // Nayi posts reload

    } catch (error) {
        console.log(error);
                showMessage("Failed to create post", "error");

    }
}

// Fetch Specific User Posts
let userPost = async () => {
    try {
        // Guard clause: Agar userId abhi null hai toh query na chale
        if (!userId) return;

        posts = []; // Purani posts clear

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

// Event Listeners
deleteBtn.addEventListener("click", () => deleteUserAccount());
sigoutBtn.addEventListener("click", () => userSignOut());
postBtn.addEventListener("click", () => create());