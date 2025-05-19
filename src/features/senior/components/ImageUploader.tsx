'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  onImageRemove: () => void;
  imageUrl?: string;
}

export default function ImageUploader({ onImageUpload, onImageRemove, imageUrl }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClientComponentClient();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    // 이미지 파일 타입 검사
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    try {
      setIsUploading(true);

      // 파일 이름에 타임스탬프 추가
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `question-images/${fileName}`;

      // Storage에 파일 업로드
      const { error: uploadError, data } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 업로드된 파일의 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      onImageUpload(publicUrl);
      toast.success('이미지가 업로드되었습니다.');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="업로드된 이미지"
            className="w-full max-h-[300px] object-cover rounded-lg"
          />
          <button
            onClick={onImageRemove}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
          >
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            <div className="text-sm text-gray-600">
              {isUploading ? '업로드 중...' : '이미지를 선택하거나 드래그하세요'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              (최대 5MB)
            </div>
          </label>
        </div>
      )}
    </div>
  );
} 