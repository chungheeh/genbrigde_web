"use client";

import { GiftCard, Brand } from "@/features/store/constants/types";
import { GiftCardItem } from "./GiftCardItem";

interface GiftCardGridProps {
  brands: Brand[];
}

export function GiftCardGrid({ brands }: GiftCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {brands.map((brand) => (
        <div key={brand.id}>
          <h3 className="text-lg font-semibold mb-3">{brand.name}</h3>
          <div className="grid grid-cols-1 gap-4">
            {brand.giftCards.map((giftCard) => (
              <GiftCardItem 
                key={giftCard.id} 
                giftCard={giftCard} 
                brandName={brand.name} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 