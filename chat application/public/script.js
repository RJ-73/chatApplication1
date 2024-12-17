const socket = io();
let username = '';
let room = '';

// DOM elements
const setUsernameButton = document.getElementById('set-username');
const usernameInput = document.getElementById('username');
const roomInput = document.getElementById('room');
const messageInput = document.getElementById('input');
const sendButton = document.getElementById('send');
const messagesContainer = document.getElementById('messages');

// Set username and room
setUsernameButton.addEventListener('click', () => {
    const enteredUsername = usernameInput.value.trim();
    const enteredRoom = roomInput.value.trim();

    if (enteredUsername && enteredRoom) {
        username = enteredUsername;
        room = enteredRoom;

        // Disable inputs and buttons
        usernameInput.disabled = true;
        roomInput.disabled = true;
        setUsernameButton.disabled = true;

        // Join the specified room
        socket.emit('join room', { username, room });

        appendSystemMessage(`You joined room ${room}`);
    }
});

// Send message on button click or Enter key
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message && username && room) {
        // Emit the message to the server
        socket.emit('chat message', { username, room, message });

        // Clear the input field after sending the message
        messageInput.value = ''; 
    }
}

// Append messages to the chat
function appendMessage({ username, message }, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(type);

    // Add the username above the message
    const usernameElement = document.createElement('span');
    usernameElement.classList.add('username');
    usernameElement.textContent = username;

    const textElement = document.createElement('div');
    textElement.textContent = message;

    messageElement.appendChild(usernameElement);
    messageElement.appendChild(textElement);
    messagesContainer.appendChild(messageElement);

    // Scroll to the latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Append system messages
function appendSystemMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('info');
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);

    // Scroll to the latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Listen for messages from the server
socket.on('chat message', ({ username: sender, message }) => {
    // Check if the message is sent by the current user or someone else
    if (sender === username) {
        appendMessage({ username: sender, message }, 'self');  // Sent by the user
    } else {
        appendMessage({ username: sender, message }, 'other');  // Received message
    }
});
