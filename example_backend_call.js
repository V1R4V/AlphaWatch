const { fork } = require('child_process');

function sendQueryToBackend(query) {
    return new Promise((resolve, reject) => {
        // Fork the backend.py script
        const backendProcess = fork('backend.py');

        // Send the query to the backend
        backendProcess.send({ query: query });

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
sendQueryToBackend("Find all people with Python skills.")
    .then((response) => {
        console.log("AI Response:", response.response);
    })
    .catch((error) => {
        console.error("Error:", error);
    });