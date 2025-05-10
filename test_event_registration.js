/**
 * Test script for the event_registration.js functionality
 */

// Mock the FitAiConfig global for testing
window.FitAiConfig = {
    apiKeys: {
        serper: 'mock-serper-key-for-testing'
    },
    apiBaseUrls: {
        serper: 'https://serper.dev/api'
    }
};

// Manually run the get_event_registration_links function when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Import the function from event_registration.js
    // This works because we include both scripts in the test HTML
    
    const resultDiv = document.getElementById('test-results');
    resultDiv.innerHTML = '<p>Testing event_registration_links function...</p>';
    
    try {
        // Test with Bengaluru, India
        const events = await get_event_registration_links('Bengaluru', 'India');
        
        // Display the results
        resultDiv.innerHTML += `<p class="success">Successfully retrieved ${events.length} events!</p>`;
        
        let resultsHtml = '<ul>';
        events.forEach(event => {
            resultsHtml += `
                <li>
                    <strong>${event.name}</strong><br>
                    Date: ${event.date}<br>
                    <a href="${event.url}" target="_blank">Event Link</a>
                </li>
            `;
        });
        resultsHtml += '</ul>';
        
        resultDiv.innerHTML += resultsHtml;
        
    } catch (error) {
        resultDiv.innerHTML += `<p class="error">Error: ${error.message}</p>`;
        console.error('Test failed:', error);
    }
});
