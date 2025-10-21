import React, { useState } from 'react';
import './App.css';

function App() {
  // State to store our API response
  const [apiResponse, setApiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * This function is called when the button is clicked.
   */
const fetchCategories = () => {
    console.log('Button clicked, attempting to fetch categories...');
    setIsLoading(true);
    setApiResponse('');

    const apiUrl = 'http://localhost/taptosell.my/wp-json/taptosell/v1/product/categories';

    // --- NEW: Authentication using Application Password ---
    // Replace with your WP username
    const username = '01moynul'; 
    // Replace with the Application Password you generated (keep the spaces!)
    const appPassword = 'cdcB 77WT AYOD PLdd IPkz 7azB'; 

    // Encode the username and password for the Authorization header
    const basicAuth = btoa(`${username}:${appPassword}`); 
    // --- END NEW AUTH ---

    console.log(`Fetching from: ${apiUrl} using Basic Auth`); // Log for debugging

    fetch(apiUrl, {
      // We NO LONGER need credentials: 'include' when using Basic Auth
      // credentials: 'include', 
      headers: {
        // --- UPDATED: Use Authorization Header ---
        'Authorization': `Basic ${basicAuth}`
        // --- END UPDATED ---
      }
    })
      .then(response => {
        if (!response.ok) {
          // Try parsing the JSON error first
          return response.json().then(errorData => {
            // Include code in the error message for better debugging
            throw new Error(`API Error (${response.status} - ${errorData.code}): ${errorData.message || 'Unknown error'}`);
          }).catch(() => {
             // If JSON parsing fails, throw a generic error
             throw new Error(`API Error (${response.status}): ${response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        setApiResponse(JSON.stringify(data, null, 2));
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        setApiResponse(error.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TapToSell React App</h1>
        <p>Click the button to test the API connection.</p>
        
        {/* Our Test Button */}
        <button onClick={fetchCategories} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Product Categories'}
        </button>

        {/* This <pre> tag will display the API response */}
        {apiResponse && (
          <pre className="ApiResponse">
            {apiResponse}
          </pre>
        )}
      </header>
    </div>
  );
}

export default App;