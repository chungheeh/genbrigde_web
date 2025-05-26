'use client';

import { Button } from "@/components/ui/button";
import { FontSizeType, useFontSizeStore } from "../store";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Type } from "lucide-react";

export function FontSizeControl() {
  const { fontSize, setFontSize } = useFontSizeStore();

  // 글씨 크기 변경 시 HTML에 클래스 적용
  useEffect(() => {
    document.documentElement.classList.remove('text-normal', 'text-large', 'text-xlarge');
    document.documentElement.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  // 사이즈 라벨 매핑
  const sizeLabels: Record<FontSizeType, string> = {
    'normal': '보통',
    'large': '크게',
    'xlarge': '아주크게'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 px-3 text-gray-700 hover:bg-gray-100"
        >
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline">글씨 크기</span>
          <span className="ml-1 text-primary font-medium">({sizeLabels[fontSize]})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setFontSize("normal")}
          className={cn(fontSize === "normal" && "bg-primary/10")}
        >
          보통
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setFontSize("large")}
          className={cn(fontSize === "large" && "bg-primary/10")}
        >
          크게
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setFontSize("xlarge")}
          className={cn(fontSize === "xlarge" && "bg-primary/10")}
        >
          아주크게
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 