//
// File: src/App.js
//
import React, { useState, useEffect } from 'react';
import './App.css';
import AddProductForm from './AddProductForm'; // Import the new component

function App() {
  // --- State for API data and loading status ---
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect Hook to fetch categories - kept in App.js
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const username = '01moynul'; // <-- REPLACE THIS if needed
        const applicationPassword = 'cdcB 77WT AYOD PLdd IPkz 7azB'; // <-- REPLACE THIS if needed
        const headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(username + ':' + applicationPassword));

        const response = await fetch('http://localhost/taptosell.my/wp-json/taptosell/v1/product/categories', {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // --- IMPORTANT: Ensure data format matches what AddProductForm expects ---
        // The API returns { id: term_id, name: '...', slug: '...' }
        // Let's keep this format as it's good practice to use 'id'
        setCategories(data); // Assuming API returns [{id: 1, name: 'T-Shirts'}, ...]

      } catch (e) {
        console.error("Error fetching categories:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // --- Render Logic ---
  // Loading and Error states are handled here
  if (isLoading) {
    return (
      <div className="App">
        <div className="add-product-layout-container">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="add-product-layout-container error-message">Error: {error}</div>
      </div>
    );
  }

  // --- Main 3-Column Layout ---
  return (
    <div className="App">
      {/* Container for the 3-column Shopee-like layout */}
      <div className="add-product-layout-container">

        {/* --- Column 1: Filing Suggestions (Placeholder) --- */}
        <div className="layout-column suggestions-column">
          <h2>Filing Suggestions</h2>
          {/* Static content for now */}
          <ul>
            <li>✅ Add at least 3 images</li>
            <li>⬜️ Add video</li>
            <li>✅ Add characters for name to 25~100</li>
            <li>⬜️ Add at least 100 characters or 1 image for description</li>
            {/* ... other suggestions */}
          </ul>
           <h2>Tips</h2>
           <p>Variation: Add up to 2 tiers...</p>
        </div>

        {/* --- Column 2: Add Product Form --- */}
        <div className="layout-column form-column">
          {/* Render the AddProductForm component, passing necessary props */}
          <AddProductForm
            categories={categories}
            isLoading={isLoading} // Pass loading/error to potentially disable form later
            error={error}
          />
        </div>

        {/* --- Column 3: Product Preview (Placeholder) --- */}
        <div className="layout-column preview-column">
          <h2>Preview</h2>
          <div className="preview-content">
            {/* Static placeholder content */}
            <div className="preview-image-placeholder">[Image Placeholder]</div>
            <p className="preview-title-placeholder">[Product Title]</p>
            <p className="preview-price-placeholder">[Price]</p>
            <button disabled>Buy Now</button>
            <p><small>This is for reference only.</small></p>
          </div>
        </div>

      </div> {/* End add-product-layout-container */}
    </div>
  );
}

export default App;