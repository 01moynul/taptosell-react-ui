//
// File: src/AddProductForm.js (Corrected Version)
//
import React from 'react';
// We don't need useState or useEffect here, just 'React'
// import './App.css'; // App.js already imports the CSS

// Accept { categories } as a prop from App.js
function AddProductForm({ categories }) {
  
  // --- State Variables (ALL form state lives here) ---
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [productName, setProductName] = React.useState('');
  const [productDescription, setProductDescription] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [sku, setSku] = React.useState('');
  const [stock, setStock] = React.useState('');
  const [hasVariations, setHasVariations] = React.useState(false);
  const [variations, setVariations] = React.useState([]);
  const [variationTableData, setVariationTableData] = React.useState([]);
  const [weight, setWeight] = React.useState('');
  const [pkgLength, setPkgLength] = React.useState('');
  const [pkgWidth, setPkgWidth] = React.useState('');
  const [pkgHeight, setPkgHeight] = React.useState('');
  
  // --- NEW State for active tab ---
  const [activeSection, setActiveSection] = React.useState('basic-info-section');

  
  // --- Effect Hooks ---

  // Effect for syncing the variation table
  React.useEffect(() => {
    if (!hasVariations || variations.length === 0) {
      setVariationTableData([]); 
      return;
    }
    if (variations.length === 1) {
      const group1 = variations[0];
      const options1 = group1.options;
      const newTableData = options1.map(optionName => {
        const existingRow = variationTableData.find(row => row.id === optionName);
        return {
          id: optionName, 
          optionName: optionName,
          price: existingRow?.price || '',
          stock: existingRow?.stock || '',
          sku: existingRow?.sku || '', 
          image: existingRow?.image || null
        };
      });
      setVariationTableData(newTableData);
    } else {
      setVariationTableData([]); 
    }
  }, [hasVariations, JSON.stringify(variations)]); // Added variationTableData as dependency

  // --- NEW: Effect Hook for Intersection Observer (FIXED) ---
  // This is now at the top level of this component, so it's not conditional
  React.useEffect(() => {
    const sections = [
      document.getElementById('basic-info-section'),
      document.getElementById('sales-info-section'),
      document.getElementById('variations-section'),
      document.getElementById('shipping-section')
    ].filter(el => el != null); 

    if (sections.length === 0) return;

    const observerOptions = {
      root: null, 
      rootMargin: '-25% 0px -75% 0px', 
      threshold: 0 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []); // Empty array, runs once on mount


  // --- Handler Functions (ALL handlers live here) ---

  // --- NEW: Handler for clicking a tab ---
  const handleTabClick = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleVariations = () => {
    if (hasVariations) {
      setHasVariations(false);
      setVariations([]);
    } else {
      setHasVariations(true);
      setVariations([
        { 
          id: Date.now(), 
          name: '',
          options: [],
          showCustom: false,
          currentOptionInput: '',
          sizeFormat: ''
        }
      ]);
    }
  };

  const updateVariationGroup = (index, updatedProperties) => {
    setVariations(prevVariations => {
      const newVariations = JSON.parse(JSON.stringify(prevVariations));
      newVariations[index] = { ...newVariations[index], ...updatedProperties };
      return newVariations;
    });
  };

  const handleGroupNameChange = (event, index) => {
    const value = event.target.value;
    if (value === 'custom') {
      updateVariationGroup(index, { name: '', showCustom: true, sizeFormat: '' });
    } else if (value === 'Size') {
      updateVariationGroup(index, { name: value, showCustom: false, sizeFormat: '' });
    } else {
      updateVariationGroup(index, { name: value, showCustom: false, sizeFormat: '' });
    }
  };

  const handleSizeFormatChange = (event, index) => {
    const value = event.target.value;
    updateVariationGroup(index, { sizeFormat: value });
  };

  const handleCustomGroupNameChange = (event, index) => {
    const value = event.target.value;
    updateVariationGroup(index, { name: value });
  };

  const handleCurrentOptionChange = (event, index) => {
    const value = event.target.value;
    updateVariationGroup(index, { currentOptionInput: value });
  };

  const handleAddOption = (event, index) => {
    const group = variations[index];
    const value = group.currentOptionInput.trim();
    if (event.key === 'Enter' && value !== '') {
      event.preventDefault();
      updateVariationGroup(index, {
        options: [...group.options, value],
        currentOptionInput: ''
      });
    }
  };

  const handleRemoveOption = (groupIndex, optionIndex) => {
    setVariations(prevVariations => {
      const newVariations = JSON.parse(JSON.stringify(prevVariations));
      const group = newVariations[groupIndex];
      if (group && group.options) {
        group.options.splice(optionIndex, 1);
      }
      return newVariations;
    });
  };

  const handleRemoveGroup = (groupIndex) => {
    setVariations(prevVariations => {
      const newVariations = [...prevVariations];
      newVariations.splice(groupIndex, 1);
      return newVariations;
    });
  };

  const handleTableInputChange = (event, rowIndex, fieldName) => {
    const value = event.target.value;
    setVariationTableData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [fieldName]: value };
      return newData;
    });
  };

  const addVariationGroup = () => {
    if (variations.length < 2) {
      setVariations(prevVariations => [
        ...prevVariations,
        {
          id: Date.now(),
          name: '',
          options: [],
          showCustom: false,
          currentOptionInput: '',
          sizeFormat: ''
        }
      ]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const productData = {
      productName: productName,
      selectedCategory: selectedCategory,
      productDescription: productDescription,
      brand: brand,
      price: price,
      sku: sku,
      stock: stock,
      hasVariations: hasVariations,
      variationConfig: hasVariations ? variations : null,
      variationDetails: hasVariations ? variationTableData : null,
      weight: weight,
      packageDimensions: {
        length: pkgLength,
        width: pkgWidth,
        height: pkgHeight,
      },
    };
    console.log("Form Data Submitted (Client-Side):");
    console.log(JSON.stringify(productData, null, 2));
    alert('Check the console (F12) to see the gathered form data!');
  };


  // --- NEW: FormNavTabs Component Definition ---
  const FormNavTabs = () => {
    const tabs = [
      { id: 'basic-info-section', label: '1. Basic Information' },
      { id: 'sales-info-section', label: '2. Sales Information' },
      { id: 'variations-section', label: '3. Product Variations' },
      { id: 'shipping-section', label: '4. Shipping' },
    ];

    return (
      <nav className="form-nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button" 
            className={`nav-tab ${activeSection === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    );
  };
  // --- END: FormNavTabs Component Definition ---


  // --- JSX Structure ---
  // No more isLoading or error checks here
  return (
    <form className="add-product-form">
      <h1>Add New Product</h1>

      {/* --- Render the Nav Tabs Here --- */}
      <FormNavTabs />

      {/* --- Basic Information Section --- */}
      <div id="basic-info-section" className="form-section">
        <h2>1. Basic Information</h2>
        
        <div className="form-group">
          <label>Product Images *</label>
          <div className="placeholder-uploader">Image Uploader Placeholder</div>
        </div>
        
        <div className="form-group">
          <label>Product Video</label>
          <div className="placeholder-uploader">Video Uploader Placeholder</div>
        </div>

        <div className="form-group">
          <label htmlFor="productName">Product Name *</label>
          <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="productCategory">Product Category *</label>
          <select id="productCategory" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
            <option value="" disabled>Select a category</option>
            {/* Use the 'categories' prop passed from App.js */}
            {categories.map(category => ( 
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="productDescription">Product Description *</label>
          <textarea id="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows="8" required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g., Nike, Adidas (Leave blank for 'No Brand')" />
        </div>
      </div>

      {/* --- Sales Information Section --- */}
      <div id="sales-info-section" className="form-section">
        <h2>2. Sales Information</h2>
        <div className="form-group">
          <label htmlFor="productPrice">Your Price (RM) *</label>
          <input type="number" id="productPrice" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" min="0" required={!hasVariations} disabled={hasVariations} placeholder="e.g., 25.50" />
        </div>
        <div className="form-group">
          <label htmlFor="productSku">SKU *</label>
          <input type="text" id="productSku" value={sku} onChange={(e) => setSku(e.target.value)} required={!hasVariations} disabled={hasVariations} placeholder="e.g., TSHIRT-BLK-M" />
        </div>
        <div className="form-group">
          <label htmlFor="productStock">Stock Quantity *</label>
          <input type="number" id="productStock" value={stock} onChange={(e) => setStock(e.target.value)} step="1" min="0" required={!hasVariations} disabled={hasVariations} placeholder="e.g., 100" />
        </div>
      </div>

      {/* --- Product Variations Section --- */}
      <div id="variations-section" className="form-section">
        <h2>3. Product Variations</h2>
        <div className="form-group">
          <button type="button" onClick={toggleVariations} className={`button ${hasVariations ? 'button-secondary' : 'button-primary'}`}>
            {hasVariations ? 'Disable Variations' : 'Enable Variations'}
          </button>
          <p className="form-hint">Enable this if your product comes in different options.</p>
        </div>

        {hasVariations && (
          <div id="variations-details">
            {variations.map((group, index) => (
              <div key={group.id} className="variation-group">
                
                <div className="form-group variation-name-group">
                  <label htmlFor={`variation-name-${index}`}>Variation {index + 1} Name *</label>
                  <select id={`variation-name-${index}`} value={group.showCustom ? 'custom' : (group.name || '')} onChange={(e) => handleGroupNameChange(e, index)}>
                    <option value="" disabled>Select or Type</option>
                    <option value="Color">Color</option>
                    <option value="Size">Size</option>
                    <option value="custom">Custom...</option>
                  </select>
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
                  <button type="button" className="button-icon remove-variation-group" title="Remove Variation Group" onClick={() => handleRemoveGroup(index)}>
                    &times;
                  </button>
                </div>

                {group.name === 'Size' && (
                  <div className="form-group variation-size-format">
                    <label>Size Format</label>
                    <div className="radio-group">
                      <label>
                        <input type="radio" name={`size-format-${index}`} value="International" checked={group.sizeFormat === 'International'} onChange={(e) => handleSizeFormatChange(e, index)} />
                        International (S, M, L)
                      </label>
                      <label>
                        <input type="radio" name={`size-format-${index}`} value="EU" checked={group.sizeFormat === 'EU'} onChange={(e) => handleSizeFormatChange(e, index)} />
                        EU (38, 39, 40)
                      </label>
                      <label>
                        <input type="radio" name={`size-format-${index}`} value="Custom" checked={group.sizeFormat === 'Custom'} onChange={(e) => handleSizeFormatChange(e, index)} />
                        Custom
                      </label>
                    </div>
                    {group.sizeFormat === 'Custom' && (
                      <input type="text" placeholder="Enter custom size format (e.g., US, UK)" style={{ marginTop: '10px' }} />
                    )}
                  </div>
                )}

                {(group.name !== 'Size' || (group.name === 'Size' && group.sizeFormat)) && (
                  <div className="form-group variation-options-group">
                    <label htmlFor={`variation-options-${index}`}>Options *</label>
                    <div className="variation-options-display">
                      {group.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="variation-option-item">
                          <span>{option}</span>
                          <button type="button" onClick={() => handleRemoveOption(index, optionIndex)}>&times;</button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      id={`variation-options-${index}`}
                      placeholder={group.name === 'Size' ? `e.g., S (Type and press Enter)` : `e.g., Red (Type and press Enter)`}
                      value={group.currentOptionInput}
                      onChange={(e) => handleCurrentOptionChange(e, index)}
                      onKeyDown={(e) => handleAddOption(e, index)}
                    />
                    <p className="form-hint">Press Enter after typing each option.</p>
                  </div>
                )}
              </div>
            ))}

            {variationTableData.length > 0 && variations.length === 1 && (
              <div className="variation-table-container">
                <table className="variation-table">
                  <thead>
                    <tr>
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
                        <td>{row.optionName}</td>
                        <td>
                          <input type="number" value={row.price} onChange={(e) => handleTableInputChange(e, rowIndex, 'price')} placeholder="e.g., 25.50" step="0.01" min="0" />
                        </td>
                        <td>
                          <input type="number" value={row.stock} onChange={(e) => handleTableInputChange(e, rowIndex, 'stock')} placeholder="e.g., 100" step="1" min="0" />
                        </td>
                        <td>
                          <input type="text" value={row.sku} onChange={(e) => handleTableInputChange(e, rowIndex, 'sku')} placeholder="e.g., TSHIRT-RED" />
                        </td>
                        <td>
                          <div className="placeholder-image-uploader" title="Add variation image">+</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {variations.length < 2 && (
              <div className="form-group">
                <button type="button" className="button button-secondary add-variation-group" onClick={addVariationGroup}>
                  + Add Variation {variations.length + 1}
                </button>
              </div>
            )}

          </div>
        )}
      </div>

      {/* --- Shipping Section --- */}
      <div id="shipping-section" className="form-section">
        <h2>4. Shipping</h2>
        <div className="form-group">
          <label htmlFor="productWeight">Weight (kg) *</label>
          <input type="number" id="productWeight" name="product_weight" value={weight} onChange={(e) => setWeight(e.target.value)} step="0.01" min="0" required placeholder="e.g., 0.5" />
          <p className="form-hint">Enter the weight of the product after packaging.</p>
        </div>
        <div className="form-group">
          <label>Package Dimensions (cm)</label>
          <div className="form-grid-3">
            <input type="number" name="product_length" value={pkgLength} onChange={(e) => setPkgLength(e.target.value)} step="0.1" min="0" placeholder="Length" aria-label="Package Length in cm" />
            <input type="number" name="product_width" value={pkgWidth} onChange={(e) => setPkgWidth(e.target.value)} step="0.1" min="0" placeholder="Width" aria-label="Package Width in cm" />
            <input type="number" name="product_height" value={pkgHeight} onChange={(e) => setPkgHeight(e.target.value)} step="0.1" min="0" placeholder="Height" aria-label="Package Height in cm" />
          </div>
          <p className="form-hint">Enter the Length x Width x Height of the package after packing.</p>
        </div>
      </div>

      {/* --- Form Submission Button --- */}
      <div className="form-section form-actions" style={{ textAlign: 'right', borderBottom: 'none', paddingBottom: 0 }}>
        <button type="button" onClick={handleSubmit} className="button button-primary">
          Save and Publish (Log Data)
        </button>
      </div>

    </form>
  );
}

export default AddProductForm;