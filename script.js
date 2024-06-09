// Function to save search history to session storage
function saveToSessionStorage(word, definition) {
    // Check if session storage is supported
    if (typeof(Storage) !== "undefined") {
        // Retrieve existing history or initialize empty array
        let history = JSON.parse(sessionStorage.getItem('searchHistory')) || [];
        
        // Check if word already exists in history
        const existingIndex = history.findIndex(entry => entry.word === word);
        if (existingIndex !== -1) {
            // Update definition if word exists
            history[existingIndex].definition = definition;
        } else {
            // Add new entry to the beginning of history if word doesn't exist
            history.unshift({ word, definition });
        }
        
        // Save updated history back to session storage
        sessionStorage.setItem('searchHistory', JSON.stringify(history));
    } else {
        console.log("Session storage is not supported.");
    }
}

// Function to retrieve and display search history
function displaySearchHistory() {
    // Retrieve search history from session storage
    const history = JSON.parse(sessionStorage.getItem('searchHistory'));
    const historyList = document.getElementById('historyList');
    
    if (history && history.length > 0) {
        // Clear existing list items
        historyList.innerHTML = '';
        
        // Display history on the history page
        history.forEach(entry => {
            const listItem = document.createElement('li');
            if (entry && entry.word && entry.definition) {
                listItem.textContent = `${entry.word}: ${entry.definition}`;
                historyList.appendChild(listItem);
            }
        });
    } else {
        // Display a message if no history found
        historyList.innerHTML = '<li>No search history available.</li>';
    }
}

// Event listener for the search input
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        search();
    }
});

// Function to handle search
async function search() {
    const word = document.getElementById('searchInput').value.trim(); // Trim whitespace
    if (!word) {
        alert("Please enter a word to search.");
        return;
    }
    const API_KEY = 'ff4d3cce-b0a1-48d4-9cdd-96be5745cbaf';
    try {
        const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${API_KEY}`);
        const data = await response.json();
        if (data.length > 0 && data[0].shortdef && data[0].shortdef.length > 0) {
            const definition = data[0].shortdef[0];
            document.getElementById('word').innerText = word;
            document.getElementById('definition').innerText = definition;
            document.getElementById('definitionContainer').style.display = 'block';
            
            // Save search to session storage
            saveToSessionStorage(word, definition);
        } else {
            alert("No definition found for the word.");
        }
    } catch (error) {
        console.log(error);
        alert("An error occurred while fetching the definition.");
    }
}
