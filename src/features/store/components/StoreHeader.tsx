"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function StoreHeader() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">포인트 기프티콘 스토어</h1>
      <p className="text-gray-600 mb-6">
        포인트를 사용하여 다양한 브랜드의 기프티콘을 구매해보세요!
      </p>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="브랜드 또는 상품명 검색..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
} 