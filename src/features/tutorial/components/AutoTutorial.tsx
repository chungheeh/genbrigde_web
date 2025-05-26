'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TutorialContent } from './TutorialContent';

export function AutoTutorial() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 튜토리얼을 본 적이 있는지 확인
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    
    // 튜토리얼을 본 적이 없으면 튜토리얼 표시
    if (!hasSeenTutorial) {
      setOpen(true);
      // 튜토리얼을 봤다고 표시
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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