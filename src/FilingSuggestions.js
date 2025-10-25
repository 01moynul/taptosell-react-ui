//
// File: src/FilingSuggestions.js
//
import React from 'react';

/**
 * A single suggestion item.
 * @param {object} props
 * @param {string} props.text - The suggestion text to display.
 * @param {boolean} props.isComplete - Whether the suggestion is complete.
 */
const SuggestionItem = ({ text, isComplete }) => (
  <li className={`suggestion-item ${isComplete ? 'complete' : 'incomplete'}`}>
    <span className="suggestion-icon">{isComplete ? '✅' : '⬜️'}</span>
    <span className="suggestion-text">{text}</span>
  </li>
);

/**
 * Renders the dynamic list of filing suggestions.
 * It checks the form state (passed as props) to see which suggestions are complete.
 */
function FilingSuggestions({
  productName,
  selectedCategory,
  productDescription,
  price,
  hasVariations,
  variationTableData,

  // --- ADDED PROPS ---
  sku,
  stock,
  weight,
  pkgLength,
  pkgWidth,
  pkgHeight,
}) {
    
  // --- Define the suggestions and their completion logic ---
  const suggestions = [
    {
      id: 'name',
      text: 'Product Name added (min 10 chars)',
      isComplete: productName.trim().length > 10,
    },
    {
      id: 'category',
      text: 'Category selected',
      isComplete: selectedCategory !== '',
    },
    {
      id: 'description',
      text: 'Description added (min 50 chars)',
      isComplete: productDescription.trim().length > 50,
    },
    {
      id: 'price',
      text: 'Price is set',
      // Logic: If variations are ON, check all table rows. If OFF, check simple price field.
      isComplete: hasVariations
        ? variationTableData.length > 0 && variationTableData.every(v => v.price.trim() !== '')
        : price.trim() !== '',
    },
    // --- NEW SUGGESTIONS START HERE ---
    {
      id: 'sku',
      text: 'SKU is set',
      // Logic: If variations are ON, check all table rows. If OFF, check simple SKU field.
      isComplete: hasVariations
        ? variationTableData.length > 0 && variationTableData.every(v => v.sku.trim() !== '')
        : sku.trim() !== '',
    },
    {
      id: 'stock',
      text: 'Stock is set',
      // Logic: If variations are ON, check all table rows. If OFF, check simple stock field.
      isComplete: hasVariations
        ? variationTableData.length > 0 && variationTableData.every(v => v.stock.trim() !== '')
        : stock.trim() !== '',
    },
    {
      id: 'weight',
      text: 'Weight is set',
      // Logic: Simple check on the weight field
      isComplete: weight.trim() !== '',
    },
    {
      id: 'dimensions',
      text: 'Package Dimensions are set',
      // Logic: Check that all three dimension fields are filled
      isComplete: pkgLength.trim() !== '' && pkgWidth.trim() !== '' && pkgHeight.trim() !== '',
    },
    // --- NEW SUGGESTIONS END HERE ---
    {
      id: 'images',
      text: 'Add at least 3 images',
      isComplete: false, // Placeholder
    },
    {
      id: 'video',
      text: 'Add video',
      isComplete: false, // Placeholder
    },
  ];

  // Calculate the completion score
  const completedCount = suggestions.filter(s => s.isComplete).length;
  const totalCount = suggestions.length;
  const score = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="filing-suggestions-component">
      <h2>Filing Suggestions</h2>
      
      {/* --- Score Bar --- */}
      <div className="suggestion-score">
        <p>Score: {score}%</p>
        <div className="score-bar-container">
          <div className="score-bar-fill" style={{ width: `${score}%` }}></div>
        </div>
      </div>

      {/* --- Suggestion List --- */}
      <ul className="filing-suggestions-list">
        {suggestions.map(suggestion => (
          <SuggestionItem
            key={suggestion.id}
            text={suggestion.text}
            isComplete={suggestion.isComplete}
          />
        ))}
      </ul>

      {/* --- Tips Section (Static) --- */}
      <div className="static-tips">
        <h2>Tips</h2>
        <p>Variation: Add up to 2 tiers (e.g., Color, Size). Adding 2 tiers will generate a table for all combinations.</p>
        <p>Images: Use high-quality images with a 3:4 aspect ratio for the best results.</p>
      </div>
    </div>
  );
}

export default FilingSuggestions;