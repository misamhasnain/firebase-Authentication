let messageBox = document.createElement("div");
messageBox.id = "ui-message";
document.body.appendChild(messageBox);

export function showMessage(text, type = "success") {
    messageBox.textContent = text;

    messageBox.className = "";
    messageBox.classList.add(type); 
    messageBox.classList.add("show");

    setTimeout(() => {
        messageBox.classList.remove("show");
    }, 3000);
}