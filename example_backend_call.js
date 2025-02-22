// frontend.js
const { fork } = require('child_process');

function sendMessageToBackend(message) {
    return new Promise((resolve, reject) => {
        // Fork the backend.py script
        const backendProcess = fork('backend.py');

        // Send the message to the backend
        backendProcess.send({ message: message });

        // Listen for the response from the backend
        backendProcess.on('message', (response) => {
            resolve(response);
        });

        // Handle errors
        backendProcess.on('error', (error) => {
            reject(error);
        });

        // Handle process exit
        backendProcess.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Backend process exited with code ${code}`));
            }
        });
    });
}

// Example usage
sendMessageToBackend("What startups are the most difficult to get into?")
    .then((response) => {
        console.log("LLM Response:", response);
    })
    .catch((error) => {
        console.error("Error:", error);
    });