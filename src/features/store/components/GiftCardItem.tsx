"use client";

import { useState } from "react";
import Image from "next/image";
import { GiftCard } from "@/features/store/constants/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface GiftCardItemProps {
  giftCard: GiftCard;
  brandName: string;
}

export function GiftCardItem({ giftCard, brandName }: GiftCardItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="aspect-[3/2] relative">
        <Image
          src={giftCard.imageUrl}
          alt={`${brandName} ${giftCard.name} 기프티콘`}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h4 className="font-medium text-sm">{giftCard.name}</h4>
        <div className="mt-2 flex justify-between items-center">
          <div className="text-blue-600 font-bold">{giftCard.price.toLocaleString()}P</div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">구매하기</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>기프티콘 구매</DialogTitle>
                <DialogDescription>
                  아래 내용을 확인하고 포인트로 기프티콘을 구매하세요.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={giftCard.imageUrl}
                      alt={`${brandName} ${giftCard.name} 기프티콘`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{brandName}</h4>
                    <p className="text-sm text-gray-500">{giftCard.name}</p>
                    <p className="text-blue-600 font-bold mt-1">{giftCard.price.toLocaleString()}P</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p>유효기간: {formatDistanceToNow(new Date(giftCard.expiryDate), { addSuffix: true, locale: ko })}</p>
                  <p className="mt-1">구매 후 마이페이지에서 확인할 수 있습니다.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={() => {
                  // 여기에 구매 로직 구현
                  alert("구매가 완료되었습니다!");
                  setIsDialogOpen(false);
                }}>
                  구매 확정
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 