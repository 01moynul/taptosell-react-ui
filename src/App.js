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
    setApiResponse(''); // Clear previous response

    // This URL works because of the "proxy" we set in package.json.
    // React's dev server sees this and forwards it to:
    // http://localhost/taptosell.my/wp-json/taptosell/v1/product/categories
    const apiUrl = '/wp-json/taptosell/v1/product/categories';

    fetch(apiUrl)
      .then(response => {
        // We need to check if the response is OK (e.g., 200)
        if (!response.ok) {
          // If we get a 401 or 403 error, response.json() will fail.
          // So we read the error as text first.
          return response.json().then(errorData => {
            // Throw an error with the message from our API
            throw new Error(`API Error (${response.status}): ${errorData.message}`);
          });
        }
        // If response is OK, parse it as JSON
        return response.json();
      })
      .then(data => {
        // Data is the array of categories!
        console.log('Success:', data);
        // We stringify the JSON to display it nicely in the <pre> tag
        setApiResponse(JSON.stringify(data, null, 2));
        setIsLoading(false);
      })
      .catch(error => {
        // This will catch network errors or the error we threw
        console.error('Fetch Error:', error);
        setApiResponse(error.message); // Show the error message
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