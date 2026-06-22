let messageBox = document.createElement("div");
document.body.appendChild(messageBox);

export function showMessage(text, type) {
    messageBox.innerText = text;
    messageBox.className = type;

    setTimeout(() => {
        messageBox.innerText = "";
        messageBox.className = "";
    }, 3000);
}