import { addDoc, and, collection, db, doc, getDocs, onSnapshot, or, query, serverTimestamp, where } from "./firebaseConfig.js";
 
let user = [];
let Message = [];
let userId = null;
let selectedUser = null;
let unsubscribeMsg = null; 
 
let userDiv = document.querySelector(".users");
let chatDiv = document.querySelector(".msg-section");
let sendMessageBtn = document.querySelector("#msg-send-btn");
let MessageInp = document.querySelector("#msg-text");
 
if (!selectedUser) {
  chatDiv.innerHTML = `<h2>No Chat</h2>`;
}
 
let getUserfromLS = () => {
  userId = JSON.parse(window.localStorage.getItem("uid"));
  console.log("uid ==> ", userId);
};
getUserfromLS();
 
let getuser = async () => {
  try {
  
    if (!userId) {
      console.log("userId not found in localStorage — cannot fetch users");
      user = [];
      renderUser();
      return;
    }
 
    let userQuery = query(collection(db, "users"), where("uid", "!=", userId));
    let queryShot = await getDocs(userQuery);
    user = []; 
    queryShot.forEach((element) => {
      user.push({ id: element.id, ...element.data() });
    });
    renderUser();
  } catch (error) {
    console.log("error fetching users =>", error);
  }
};
getuser();
 
let renderUser = () => {
  userDiv.innerHTML = "";
  if (user.length < 1) {
    userDiv.innerHTML = `<div><span>No User</span></div>`;
    return;
  }
  user.forEach((userData) => {
    let cardUser = document.createElement("div");
    cardUser.className = "user-card";
    // BUG FIX: backticks missing tha, isliye ye pehle syntax error tha
    cardUser.innerHTML = `<div><h6>${userData.email}</h6></div>`;
    cardUser.addEventListener("click", () => {
      userChat(userData.uid);
    });
    userDiv.appendChild(cardUser);
  });
};
 
let renderMessage = () => {
  if (Message.length < 1) {
    chatDiv.innerHTML = `<div><span>No Message</span></div>`;
    return;
  }
  chatDiv.innerHTML = "";
  Message.forEach((messData) => {
    chatDiv.innerHTML += `
      <div class="msg ${messData?.from == userId ? "right" : "left"}">
        <span>${messData?.text}</span>
      </div>`;
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;
};
 
let getMessage = () => {
  try {
   
    if (unsubscribeMsg) {
      unsubscribeMsg();
      unsubscribeMsg = null;
    }
 
    let msgQuery = query(
      collection(db, "message"),
      or(
        and(where("from", "==", userId), where("to", "==", selectedUser)),
        and(where("from", "==", selectedUser), where("to", "==", userId))
      )
    );
 
    unsubscribeMsg = onSnapshot(
      msgQuery,
      (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((docSnap) => {
          msgs.push(docSnap.data());
        });
        Message = msgs.sort(
          (a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
        );
        console.log("current msgs =>", msgs);
        renderMessage();
      },
      (error) => {
    
        console.log("onSnapshot error =>", error);
      }
    );
  } catch (error) {
    console.log(error);
  }
};
 
let userChat = (id) => {
  console.log(id);
  selectedUser = id;
  if (selectedUser) {
    getMessage();
  }
};
 
let sendMessage = async () => {
  if (!MessageInp.value.trim()) return;
  try {
    await addDoc(collection(db, "message"), {
      text: MessageInp.value,
      to: selectedUser,
      from: userId,
      createdAt: serverTimestamp(),
    });
    MessageInp.value = "";
  } catch (error) {
    console.log(error);
  }
};
 
sendMessageBtn.addEventListener("click", () => {
  if (!MessageInp.value.trim()) {
    console.error("please type to send msg!");
    return;
  }
  if (!userId || !selectedUser) {
    console.error("can't send a msg!");
    return;
  }
  sendMessage();
});
 