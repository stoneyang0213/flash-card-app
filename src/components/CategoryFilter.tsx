import React from 'react';
import type { Flashcard } from '../types';
import './CategoryFilter.css';

type Category = Flashcard['category'];
const ALL_CATEGORIES = 'all';

interface CategoryFilterProps {
  selectedCategory: Category | typeof ALL_CATEGORIES;
  onCategoryChange: (category: Category | typeof ALL_CATEGORIES) => void;
  categories: Category[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  const uniqueCategories = [...new Set(categories)];

  return (
    <div className="category-filter-container">
      <label htmlFor="category-select">Category:</label>
      <select
        id="category-select"
        className="category-filter-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as Category | typeof ALL_CATEGORIES)}
      >
        <option value={ALL_CATEGORIES}>All</option>
        {uniqueCategories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter; 