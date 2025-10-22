//
// File: src/ProductPreview.js
//
import React from 'react';

// Accept all the form state data as props
function ProductPreview({
  productName,
  price, // Base price for simple product
  stock, // Base stock for simple product
  hasVariations,
  variationTableData, // Data for the variation table (price, stock per variant)
  // Add other props here as needed later (e.g., image, description)
  productDescription,
  brand,
  selectedCategory, // We might need categories array later to get name from ID
  categories,
}) {

  // Helper function to find category name from ID
  const getCategoryName = (id) => {
    const category = categories.find(cat => cat.id === parseInt(id)); // Ensure ID is integer for comparison
    return category ? category.name : 'Unknown';
  };

  // Determine the price and stock to display
  // If variations are enabled AND there's data, use the first variant's info
  // Otherwise, use the simple product price/stock
  let displayPrice = price;
  let displayStock = stock;
  let variationInfo = null;

  if (hasVariations && variationTableData && variationTableData.length > 0) {
    const firstVariant = variationTableData[0];
    displayPrice = firstVariant.price || 'N/A'; // Use variant price if set
    displayStock = firstVariant.stock || 'N/A'; // Use variant stock if set
    // We could add logic here to show selected variation later
    variationInfo = `(Variation: ${firstVariant.optionName})`;
  }

  return (
    <div className="product-preview-component">
      {/* --- Preview Column Header --- */}
      <h2>Preview</h2>

      <div className="preview-content">
        {/* --- Image Placeholder --- */}
        <div className="preview-image-placeholder">
          [Image Placeholder]
          {/* We'll add the actual image preview later */}
        </div>

        {/* --- Dynamic Product Title --- */}
        <p className="preview-title">
          {productName || "[Product Title]"} {/* Show placeholder if name is empty */}
        </p>

        {/* --- Dynamic Price --- */}
        <p className="preview-price">
          RM {displayPrice || "0.00"} {/* Show 0.00 if price is empty */}
          {variationInfo && <small style={{ display: 'block' }}>{variationInfo}</small>}
        </p>

        {/* --- Dynamic Stock --- */}
        <p className="preview-stock">
          Stock: {displayStock || "0"} {/* Show 0 if stock is empty */}
        </p>

        {/* --- Static Buttons for now --- */}
        <div className="preview-actions">
          <button type="button" disabled>Add to Cart</button>
          <button type="button" className="buy-now" disabled>Buy Now</button>
        </div>

        {/* --- Dynamic Category & Brand (Optional) --- */}
        {(selectedCategory || brand) && (
          <div className="preview-meta">
            {selectedCategory && <p>Category: {getCategoryName(selectedCategory)}</p>}
            {brand && <p>Brand: {brand}</p>}
          </div>
        )}

        {/* --- Dynamic Description (Optional) --- */}
        {productDescription && (
          <div className="preview-description">
            <h4>Description</h4>
            <p>{productDescription.substring(0, 150)}{productDescription.length > 150 ? '...' : ''}</p>
          </div>
        )}

        {/* --- Footer Note --- */}
        <p><small>This is for reference only.</small></p>
      </div>
    </div>
  );
}

export default ProductPreview;