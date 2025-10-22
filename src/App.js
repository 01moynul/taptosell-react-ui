//
// File: src/App.js
//
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- State Variables ---
  // Stores the list of product categories fetched from the API
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // <-- ADD THIS LINE
  // Stores values for the form inputs
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [brand, setBrand] = useState('');
  // Add these lines for Sales Information
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  // Add these lines for Product Variations
  const [hasVariations, setHasVariations] = useState(false);
  // REPLACE it with this line:
  const [variations, setVariations] = useState([]); // Start with an empty array
  // Add this line
  const [variationTableData, setVariationTableData] = useState([]);

  // Tracks whether the categories are still being loaded
  const [isLoading, setIsLoading] = useState(true);
  // Stores any error messages
  const [error, setError] = useState(null);

  // ... rest of the component

  /**
   * useEffect Hook
   * This runs once when the component is first loaded (due to the empty dependency array []).
   * Its job is to fetch the product categories from our WordPress API.
   */
  useEffect(() => {
    // Define the async function to fetch categories
    const fetchCategories = async () => {
      try {
        // Set up the Basic Authentication header
        // IMPORTANT: Replace 'your_username' and 'your_app_password' with your actual credentials
        const username = '01moynul'; // <-- REPLACE THIS
        const applicationPassword = 'cdcB 77WT AYOD PLdd IPkz 7azB'; // <-- REPLACE THIS
        const headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(username + ':' + applicationPassword));

        // Make the API request
        const response = await fetch('http://localhost/taptosell.my/wp-json/taptosell/v1/product/categories', {
          method: 'GET',
          headers: headers,
        });

        // Check if the network response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON data from the response
        const data = await response.json();
        
        // Update our state with the fetched categories
        setCategories(data);

      } catch (e) {
        // If an error occurs, store the error message
        console.error("Error fetching categories:", e);
        setError(e.message);
      } finally {
        // Whether successful or not, we are no longer loading
        setIsLoading(false);
      }
    };

    // Call the function to fetch categories
    fetchCategories(); 

  }, []); // The empty array [] means this effect runs only once on mount

  // This hook syncs the table data with the variation options
  useEffect(() => {
    // Only run if variations are enabled and we have at least one group
    if (!hasVariations || variations.length === 0) {
      setVariationTableData([]); // Clear table if variations are off
      return;
    }

    // --- We are only handling ONE variation group for now, as requested ---
    if (variations.length === 1) {
      const group1 = variations[0];
      const options1 = group1.options;

      // Create new table data based on the options
      const newTableData = options1.map(optionName => {
        // Find existing data for this option to preserve it
        // We use 'id' to track the row, which we set to the optionName
        const existingRow = variationTableData.find(row => row.id === optionName);
        
        return {
          id: optionName, // Use the option name as a unique ID
          optionName: optionName,
          price: existingRow?.price || '', // Preserve old price
          stock: existingRow?.stock || '', // Preserve old stock
          sku: existingRow?.sku || '',   // Preserve old SKU
          image: existingRow?.image || null // Placeholder for image
        };
      });
      
      setVariationTableData(newTableData);
    } else {
      // --- Logic for 2 variation groups (combinations) will go here later ---
      // For now, clear the table if we have more than 1 group
      setVariationTableData([]); 
    }

    // We watch 'hasVariations' and a stringified version of 'variations'
    // This makes the hook re-run whenever *any* variation data changes
  }, [hasVariations, JSON.stringify(variations)]);

  // --- Render Logic ---

  // Show a loading message while fetching data
  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Loading categories...</p>
        </header>
      </div>
    );
  }

  // Show an error message if something went wrong
  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Error loading categories: {error}</p>
          <p>Please check your WP username and Application Password in src/App.js and ensure your local WordPress site is running.</p>
        </header>
      </div>
    );
  }

  // --- Variation Handlers ---

  /**
   * Toggles the variations UI on or off.
   * When turning on, it initializes the first variation group.
   */
  const toggleVariations = () => {
    if (hasVariations) {
      // Turning OFF
      setHasVariations(false);
      setVariations([]); // Clear all variation data
    } else {
      // Turning ON
      setHasVariations(true);
      // Add the first default variation group object
      setVariations([
        { 
          id: Date.now(), 
          name: '',            // e.g., 'Color'
          options: [],         // e.g., ['Red', 'Green']
          showCustom: false,   // To control the 'Custom...' input
          currentOptionInput: '' ,// To control the 'Add Option' input
          sizeFormat: '' // <-- ADD THIS LINE
        }
      ]);
    }
  };

  // --- NEW HANDLER FUNCTIONS ---

  /**
   * Generic helper function to update a specific variation group.
   */
  const updateVariationGroup = (index, updatedProperties) => {
    setVariations(prevVariations => {
      // Create a deep copy of the array
      const newVariations = JSON.parse(JSON.stringify(prevVariations));
      
      // Merge the updated properties into the specific group
      newVariations[index] = { ...newVariations[index], ...updatedProperties };
      
      return newVariations;
    });
  };

  /**
   * Handles changes to the "Variation Name" dropdown (e.g., Color, Size, Custom)
   */
  const handleGroupNameChange = (event, index) => {
    const value = event.target.value;

    if (value === 'custom') {
      // Show custom input, clear the name, reset size format
      updateVariationGroup(index, { name: '', showCustom: true, sizeFormat: '' });
    } else if (value === 'Size') {
      // It's Size - Hide custom input, set the name, reset size format
       updateVariationGroup(index, { name: value, showCustom: false, sizeFormat: '' });
    } else {
      // It's Color or another non-custom name - Hide custom input, set the name, reset size format
      updateVariationGroup(index, { name: value, showCustom: false, sizeFormat: '' });
    }
  };

  /**
   * Handles changes to the Size Format radio buttons
   */
  const handleSizeFormatChange = (event, index) => {
    const value = event.target.value;
    updateVariationGroup(index, { sizeFormat: value });
  };

  /**
   * Handles typing in the "Custom Variation Name" input field
   */
  const handleCustomGroupNameChange = (event, index) => {
    const value = event.target.value;
    // Update the name property for the correct group
    updateVariationGroup(index, { name: value });
  };

  /**
   * Handles typing in the "Add Option" input field
   */
  const handleCurrentOptionChange = (event, index) => {
    const value = event.target.value;
    // Update the currentOptionInput property for the correct group
    updateVariationGroup(index, { currentOptionInput: value });
  };

  /**
   * Handles pressing "Enter" in the "Add Option" input field
   */
  const handleAddOption = (event, index) => {
    const group = variations[index];
    const value = group.currentOptionInput.trim();

    // Check if Enter was pressed and the value is not empty
    if (event.key === 'Enter' && value !== '') {
      event.preventDefault(); // Stop form submission
      
      // Add the new option to the group's options array
      // and clear the input field
      updateVariationGroup(index, {
        options: [...group.options, value],
        currentOptionInput: ''
      });
    }
  };

  /**
   * Handles changes to the inputs within the variation list table
   */
  const handleTableInputChange = (event, rowIndex, fieldName) => {
    const value = event.target.value;
    
    setVariationTableData(prevData => {
      // Create a copy of the array
      const newData = [...prevData];
      // Update the specific field in the specific row object
      newData[rowIndex] = { ...newData[rowIndex], [fieldName]: value };
      return newData;
    });
  };

  /**
   * Adds a new, empty variation group
   * (Triggered by "+ Add Variation 2")
   */
  const addVariationGroup = () => {
    // We only allow a max of 2 variation groups as per Shopee structure
    if (variations.length < 2) {
      setVariations(prevVariations => [
        ...prevVariations,
        {
          id: Date.now(),
          name: '',
          options: [],
          showCustom: false,
          currentOptionInput: '',
          sizeFormat: '' // <-- ADD THIS LINE
        }
      ]);
    }
  };

  // Render the main "Add Product" form
    return (
      <div className="App">
        <header className="App-header">
          <h1>Add New Product</h1>
          
          <form className="add-product-form">
            
            {/* --- Basic Information Section --- */}
            <div className="form-section">
              <h2>1. Basic Information</h2>
              
              <div className="form-group">
                <label>Product Images *</label>
                <div className="placeholder-uploader">
                  This is the placeholder for the Image Uploader.
                </div>
              </div>

              <div className="form-group">
                <label>Product Video</label>
                <div className="placeholder-uploader">
                  This is the placeholder for the Video Uploader.
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="productName">Product Name *</label>
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productCategory">Product Category *</label>
                <select
                  id="productCategory"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(category => (
                    <option key={category.term_id} value={category.term_id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">Product Description *</label>
                <textarea
                  id="productDescription"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows="8"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g., Nike, Adidas (Leave blank for 'No Brand')"
                />
              </div>
            </div>

            {/* --- Sales Information Section --- */}
            <div className="form-section">
              <h2>2. Sales Information</h2>

              <div className="form-group">
                <label htmlFor="productPrice">Your Price (RM) *</label>
                <input
                  type="number"
                  id="productPrice"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                  placeholder="e.g., 25.50"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productSku">SKU (Stock Keeping Unit) *</label>
                <input
                  type="text"
                  id="productSku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                  placeholder="e.g., TSHIRT-BLK-M"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productStock">Stock Quantity *</label>
                <input
                  type="number"
                  id="productStock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  step="1"
                  min="0"
                  required
                  placeholder="e.g., 100"
                />
              </div>
            </div>

            {/* --- Product Variations Section --- */}
            <div className="form-section">
              <h2>3. Product Variations</h2>

              <div className="form-group">
                <button
                  type="button"
                  onClick={toggleVariations}
                  className={`button ${hasVariations ? 'button-secondary' : 'button-primary'}`}
                >
                  {hasVariations ? 'Disable Variations' : 'Enable Variations'}
                </button>
                <p className="form-hint">
                  Enable this if your product comes in different options like size or color.
                </p>
              </div>

              {/* --- Variation Details UI will go here --- */}
              {hasVariations && (
                <div id="variations-details">

                  {/* === Map over the variations state array === */}
                  {variations.map((group, index) => (
                    <div key={group.id} className="variation-group">
                      
                      {/* --- Variation Name Group (Dynamic) --- */}
                      <div className="form-group variation-name-group">
                        <label htmlFor={`variation-name-${index}`}>Variation {index + 1} Name *</label>
                        
                        <select
                          id={`variation-name-${index}`}
                          value={group.showCustom ? 'custom' : (group.name || '')}
                          onChange={(e) => handleGroupNameChange(e, index)}
                        >
                          <option value="" disabled>Select or Type</option>
                          <option value="Color">Color</option>
                          <option value="Size">Size</option>
                          <option value="custom">Custom...</option>
                        </select>

                        {/* Conditional input for custom name */}
                        {group.showCustom && (
                          <input
                            type="text"
                            id={`variation-custom-name-${index}`}
                            placeholder="Enter Custom Variation Name"
                            value={group.name}
                            onChange={(e) => handleCustomGroupNameChange(e, index)}
                            style={{ marginTop: '10px' }}
                          />
                        )}
                        
                        <button type="button" className="button-icon remove-variation-group" title="Remove Variation Group">&times;</button>
                      </div>

                      {/* === Conditional Size Format Group === */}
                      {group.name === 'Size' && (
                        <div className="form-group variation-size-format">
                          <label>Size Format</label>
                          <div className="radio-group">
                            <label>
                              <input 
                                type="radio" 
                                name={`size-format-${index}`} 
                                value="International" 
                                checked={group.sizeFormat === 'International'}
                                onChange={(e) => handleSizeFormatChange(e, index)}
                              />
                              International (S, M, L)
                            </label>
                            <label>
                              <input 
                                type="radio" 
                                name={`size-format-${index}`} 
                                value="EU" 
                                checked={group.sizeFormat === 'EU'}
                                onChange={(e) => handleSizeFormatChange(e, index)}
                              />
                              EU (38, 39, 40)
                            </label>
                            <label>
                              <input 
                                type="radio" 
                                name={`size-format-${index}`} 
                                value="Custom" 
                                checked={group.sizeFormat === 'Custom'}
                                onChange={(e) => handleSizeFormatChange(e, index)}
                              />
                              Custom
                            </label>
                          </div>

                          {/* Placeholder for custom size format input */}
                          {group.sizeFormat === 'Custom' && (
                            <input
                              type="text"
                              placeholder="Enter custom size format (e.g., US, UK)"
                              style={{ marginTop: '10px' }}
                              // We'll add state for this later if needed
                            />
                          )}
                        </div>
                      )}
                      {/* === END Size Format Group === */}


                      {/* === Conditional Variation Options Group === */}
                      {(group.name !== 'Size' || (group.name === 'Size' && group.sizeFormat)) && (
                        <div className="form-group variation-options-group">
                          <label htmlFor={`variation-options-${index}`}>Options *</label>

                          <div className="variation-options-display">
                            {group.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="variation-option-item">
                                <span>{option}</span>
                                {/* <button type="button" onClick={() => handleRemoveOption(index, optionIndex)}>&times;</button> */}
                              </div>
                            ))}
                          </div>

                          <input
                            type="text"
                            id={`variation-options-${index}`}
                            placeholder={
                              group.name === 'Size' 
                              ? `e.g., S (Type and press Enter)` 
                              : `e.g., Red (Type and press Enter)`
                            }
                            value={group.currentOptionInput}
                            onChange={(e) => handleCurrentOptionChange(e, index)}
                            onKeyDown={(e) => handleAddOption(e, index)}
                          />
                          <p className="form-hint">Press Enter after typing each option.</p>
                        </div>
                      )}
                      {/* === END Conditional Options Group === */}

                    </div>
                  ))}
                  {/* === End of .map() loop === */}

                  {/* === NEW: Variation List Table === */}
                  {variationTableData.length > 0 && variations.length === 1 && (
                    <div className="variation-table-container">
                      <table className="variation-table">
                        <thead>
                          <tr>
                            {/* Dynamic header from the variation group name */}
                            <th>{variations[0].name || 'Variation'}</th>
                            <th>Price (RM) *</th>
                            <th>Stock Quantity *</th>
                            <th>SKU *</th>
                            <th>Image</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variationTableData.map((row, rowIndex) => (
                            <tr key={row.id}>
                              {/* Option Name */}
                              <td>{row.optionName}</td>
                              
                              {/* Price Input */}
                              <td>
                                <input 
                                  type="number"
                                  value={row.price}
                                  onChange={(e) => handleTableInputChange(e, rowIndex, 'price')}
                                  placeholder="e.g., 25.50"
                                  step="0.01"
                                  min="0"
                                />
                              </td>
                              
                              {/* Stock Input */}
                              <td>
                                <input 
                                  type="number"
                                  value={row.stock}
                                  onChange={(e) => handleTableInputChange(e, rowIndex, 'stock')}
                                  placeholder="e.g., 100"
                                  step="1"
                                  min="0"
                                />
                              </td>

                              {/* SKU Input */}
                              <td>
                                <input 
                                  type="text"
                                  value={row.sku}
                                  onChange={(e) => handleTableInputChange(e, rowIndex, 'sku')}
                                  placeholder="e.g., TSHIRT-RED"
                                />
                              </td>

                              {/* Image Placeholder */}
                              <td>
                                <div className="placeholder-image-uploader" title="Add variation image">
                                  +
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {/* === END: Variation List Table === */}
                  

                  {/* --- Button to add more groups --- */}
                  {variations.length < 2 && (
                    <div className="form-group">
                        <button 
                          type="button" 
                          className="button button-secondary add-variation-group"
                          onClick={addVariationGroup} // Corrected function name
                        >
                            + Add Variation {variations.length + 1}
                        </button>
                    </div>
                  )}

                </div>
              )}
            </div>
            {/* --- End Product Variations Section --- */}

          </form>
        </header> {/* <-- Note: The closing </header> tag is here */}
      </div>
    );
  }

export default App;