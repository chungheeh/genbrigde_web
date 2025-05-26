"use client";

import { useState } from "react";
import { StoreCategories } from "./StoreCategories";
import { GiftCardGrid } from "./GiftCardGrid";
import { storeBrands } from "@/features/store/constants/brands";

export function StoreContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // 선택된 카테고리에 따라 브랜드 필터링
  const filteredBrands = selectedCategory === "all" 
    ? storeBrands 
    : storeBrands.filter(brand => brand.category === selectedCategory);

  return (
    <div>
      <StoreCategories 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <GiftCardGrid brands={filteredBrands} />
    </div>
  );
} 