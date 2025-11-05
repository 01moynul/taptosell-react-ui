//
// File: src/App.js (Corrected Version)
//
import React, { useState, useEffect } from 'react';
import './App.css';
import AddProductForm from './AddProductForm';
import ProductPreview from './ProductPreview'; 
import FilingSuggestions from './FilingSuggestions';

function App() {
  // --- State for API data and loading status ---
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State Variables (ALL form state lives here) ---
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState([]);
  const [variationTableData, setVariationTableData] = useState([]);
  const [weight, setWeight] = useState('');
  const [pkgLength, setPkgLength] = useState('');
  const [pkgWidth, setPkgWidth] = useState('');
  const [pkgHeight, setPkgHeight] = useState('');
  
  // --- NEW State for active tab ---
  const [activeSection, setActiveSection] = useState('basic-info-section');
  // --- ADD THESE NEW CONSTANTS ---
  const apiBaseUrl = 'http://localhost/taptosell.my/wp-json/taptosell/v1';
  const username = '01moynul'; // <-- Your WordPress username
  const applicationPassword = 'cdcB 77WT AYOD PLdd IPkz 7azB'; // <-- Your Application Password

  // Create a reusable headers object
  const apiAuthHeaders = new Headers();
  apiAuthHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + applicationPassword));
  apiAuthHeaders.set('Content-Type', 'application/json'); // We'll need this for POST requests
  // --- END ADD ---

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
        
        // API returns [{term_id: 1, name: '...'}, ...]
        // Let's transform it to the format our form expects {id: 1, name: '...'}
        const formattedCategories = data.map(category => ({
          id: category.term_id, // Use 'id'
          name: category.name
        }));
        setCategories(formattedCategories);

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
        <div className="add-product-layout-container error-message">
          <p>Error: {error}</p>
          <p>Please check your WP username and Application Password in src/App.js and ensure your local WordPress site is running.</p>
        </div>
      </div>
    );
  }

  // --- Main 3-Column Layout ---
  return (
    <div className="App">
      {/* Container for the 3-column Add Product layout */}
      <div className="add-product-layout-container">

        {/* --- Column 1: Dynamic Filing Suggestions --- */}
        <div className="layout-column suggestions-column">
          {/* Render the FilingSuggestions component, passing down relevant state */}
          <FilingSuggestions
            productName={productName}
            selectedCategory={selectedCategory}
            productDescription={productDescription}
            price={price}
            hasVariations={hasVariations}
            variationTableData={variationTableData}
            
            // --- ADD THESE NEW PROPS ---
            sku={sku}
            stock={stock}
            weight={weight}
            pkgLength={pkgLength}
            pkgWidth={pkgWidth}
            pkgHeight={pkgHeight}
            // --- END ADD ---
          />
        </div>

        {/* --- Column 2: Add Product Form --- */}
        <div className="layout-column form-column">
          {/* Render the AddProductForm component, passing ALL state and setters */}
          <AddProductForm

            // --- ADD THESE TWO NEW PROPS ---
            apiBaseUrl={apiBaseUrl}
            apiAuthHeaders={apiAuthHeaders}
            // --- END ADD ---
            
            // Pass categories (already doing this)
            categories={categories}

            // --- Pass Basic Info State & Setters ---
            productName={productName}
            setProductName={setProductName}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            brand={brand}
            setBrand={setBrand}

            // --- Pass Sales Info State & Setters ---
            price={price}
            setPrice={setPrice}
            sku={sku}
            setSku={setSku}
            stock={stock}
            setStock={setStock}

            // --- Pass Variations State & Setters ---
            hasVariations={hasVariations}
            setHasVariations={setHasVariations}
            variations={variations}
            setVariations={setVariations}
            variationTableData={variationTableData}
            setVariationTableData={setVariationTableData}

            // --- Pass Shipping State & Setters ---
            weight={weight}
            setWeight={setWeight}
            pkgLength={pkgLength}
            setPkgLength={setPkgLength}
            pkgWidth={pkgWidth}
            setPkgWidth={setPkgWidth}
            pkgHeight={pkgHeight}
            setPkgHeight={setPkgHeight}

            // --- Pass Navigation State & Setter ---
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* --- Column 3: Live Product Preview --- */}
        <div className="layout-column preview-column">
          {/* Render the ProductPreview component, passing down the relevant state */}
          <ProductPreview
            productName={productName}
            price={price}
            stock={stock}
            hasVariations={hasVariations}
            variationTableData={variationTableData}
            // Pass other needed props
            productDescription={productDescription}
            brand={brand}
            selectedCategory={selectedCategory}
            categories={categories} // Pass the category list for name lookup
          />
        </div>

      </div> {/* End add-product-layout-container */}
    </div>
  );
}

export default App;