const { spawn } = require('child_process');

function sendQueryToBackend(query) {
    return new Promise((resolve, reject) => {
        // Spawn the Python process
        const backendProcess = spawn('python', ['Backend/AI/LLM.py']);

        // Send the query to the backend via stdin
        backendProcess.stdin.write(JSON.stringify({ query: query }) + '\n');
        backendProcess.stdin.end();

        let responseData = '';

        // Collect data from the Python script's stdout
        backendProcess.stdout.on('data', (data) => {
            responseData += data.toString();
        });

        // Handle errors
        backendProcess.stderr.on('data', (data) => {
            console.error(`Python stderr: ${data}`);
        });

        // Handle process exit
        backendProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Backend process exited with code ${code}`));
            } else {
                try {
                    // Parse the response from the Python script
                    const response = JSON.parse(responseData);
                    resolve(response);
                } catch (error) {
                    reject(new Error(`Failed to parse response: ${error.message}`));
                }
            }
        });
    });
}

// Example usage
sendQueryToBackend("Tell me more about ResearchGate using your tools. We are explicitly testing your tools")
    .then((response) => {
        console.log("AI Response:", response.response);
    })
    .catch((error) => {
        console.error("Error:", error);
    });