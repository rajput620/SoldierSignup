const socket = io.connect('http://yourserver.com'); // Replace with your WebSocket server URL

// Toggle chat interface visibility
function toggleChatInterface() {
    const chatInterface = document.getElementById('chat-interface');
    chatInterface.style.display = chatInterface.style.display === 'none' ? 'block' : 'none';
}

// Send a message to the server
function sendMessage() {
    const messageInput = document.getElementById('chat-message');
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('sendMessage', message);  // Emit message to server
        messageInput.value = '';  // Clear input field
    }
}

// Receive messages from the server and display them
socket.on('receiveMessage', (message) => {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
});
