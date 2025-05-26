"use client";

import { Suspense } from "react";
import { StoreContent } from "@/features/store/components/StoreContent";
import { StoreHeader } from "@/features/store/components/StoreHeader";

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <StoreHeader />
      <Suspense fallback={<div>로딩 중...</div>}>
        <StoreContent />
      </Suspense>
    </div>
  );
} 