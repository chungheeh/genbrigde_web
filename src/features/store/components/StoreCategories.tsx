"use client";

import { cn } from "@/lib/utils";
import { storeCategories } from "@/features/store/constants/categories";

interface StoreCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function StoreCategories({ selectedCategory, onSelectCategory }: StoreCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          selectedCategory === "all"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        )}
        onClick={() => onSelectCategory("all")}
      >
        전체
      </button>
      
      {storeCategories.map((category) => (
        <button
          key={category.id}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            selectedCategory === category.id
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
} 