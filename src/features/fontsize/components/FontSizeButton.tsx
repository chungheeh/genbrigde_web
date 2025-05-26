'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FontSizeType, useFontSizeStore } from "../store";
import { cn } from "@/lib/utils";
import { Type } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function FontSizeButton() {
  const { fontSize, setFontSize } = useFontSizeStore();
  const [open, setOpen] = useState(false);

  // 사이즈 옵션 배열
  const sizeOptions: { value: FontSizeType; label: string }[] = [
    { value: 'normal', label: '보통' },
    { value: 'large', label: '크게' },
    { value: 'xlarge', label: '아주크게' }
  ];

  // 글씨 크기 변경 핸들러
  const handleSizeChange = (size: FontSizeType) => {
    setFontSize(size);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
          aria-label="글씨 크기 조절"
        >
          <Type className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold mb-4">글씨 크기 조절</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {sizeOptions.map((option) => (
            <Button
              key={option.value}
              variant={fontSize === option.value ? "default" : "outline"}
              className={cn(
                "w-full py-6",
                fontSize === option.value ? "bg-primary text-white" : ""
              )}
              onClick={() => handleSizeChange(option.value)}
            >
              <span className={cn(
                "text-base",
                option.value === 'large' && "text-lg",
                option.value === 'xlarge' && "text-xl"
              )}>
                {option.label}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 