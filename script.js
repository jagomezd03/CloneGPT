const chatInput = document.querySelector("#chat-input")
const sendButton = document.querySelector("#send-btn")
const themeButton = document.querySelector("#theme-btn")
const deleteButton = document.querySelector("#delete-btn")
const chatContainer = document.querySelector(".chat-container")

let userText = null;
const API_KEY = "";

const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.getItem("theme-color");
    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode"
    chatContainer.innerHTML = localStorage.getItem("all-chats");
}

loadDataFromLocalStorage();

const createElement = (ht, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = ht;
    return chatDiv;
}

const getChatresponse = async(incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/chat/completions"
    const pElement = document.createElement("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: userText
                }
            ],
            max_tokens: 128
        })
    }
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].message.content;
    } catch (error) {
        console.log(error);
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML)
}

const copyResponse = (copyButton) => {
    const responseTextElement = copyButton.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyButton.textContent = "Done";
    setTimeout(() => copyButton.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    const ht = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="Images/chatbot.jpg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay:0.2s"></div>
                            <div class="typing-dot" style="--delay:0.3s"></div>
                            <div class="typing-dot" style="--delay:0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`
    const incomingChatDiv = createElement(ht, "incoming")
    chatContainer.appendChild(incomingChatDiv);
    getChatresponse(incomingChatDiv);
}

const handleOutgoingchat = () => {
    userText = chatInput.value.trim();
    if(!userText) return;
    const ht = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="Images/user.jpg" alt="user-img">
                        <p></p>
                    </div>
                </div>`;
    const outgoingChatDiv = createElement(ht, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypingAnimation, 500);
}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText)
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode"
})

sendButton.addEventListener("click", handleOutgoingchat);