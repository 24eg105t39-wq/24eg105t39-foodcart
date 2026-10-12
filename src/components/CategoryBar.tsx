import React from 'react';
import { Category } from '../types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 scrollbar-none">
      <div className="flex items-center gap-3 min-w-max">
        {/* "All" Category Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs font-black transition-smooth border shadow-sm ${
            selectedCategoryId === 'all'
              ? 'bg-brand-red text-white border-brand-red shadow-brand-red/20'
              : 'bg-white text-stone-700 hover:bg-cream-100 border-cream-300'
          }`}
        >
          <span className="text-base">🍽️</span>
          <span>All Cravings</span>
        </button>

        {/* Categories from backend */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-black transition-smooth border shadow-sm ${
                isSelected
                  ? 'bg-brand-red text-white border-brand-red shadow-brand-red/20'
                  : 'bg-white text-stone-700 hover:bg-cream-100 border-cream-300'
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-7 h-7 rounded-xl object-cover bg-cream-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80';
                }}
              />
              <span className="truncate max-w-[120px]">{cat.name}</span>
              {cat.itemCount !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-cream-200 text-stone-500'
                  }`}
                >
                  {cat.itemCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
