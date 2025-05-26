'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TutorialContent } from './TutorialContent';

export function TutorialButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-senior hover:bg-senior-hover"
          aria-label="사용 가이드"
        >
          <HelpCircle className="h-5 w-5 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold mb-4">
            노인 서비스 사용 가이드
          </DialogTitle>
        </DialogHeader>
        <TutorialContent />
      </DialogContent>
    </Dialog>
  );
} 