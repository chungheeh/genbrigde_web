"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import VoiceRecorder from "@/features/senior/components/VoiceRecorder";
import { SeniorHeader } from "@/features/senior/components/SeniorHeader";
import { Database } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import ImageUploader from "@/features/senior/components/ImageUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from 'zod';
import { textValidationSchema } from '@/lib/validation';

const CATEGORIES = [
  { value: '건강', label: '건강' },
  { value: '생활', label: '생활' },
  { value: '안전/응급상황', label: '안전/응급상황' },
  { value: '식사/영양', label: '식사/영양' },
  { value: '운동/재활', label: '운동/재활' },
  { value: '여가활동', label: '여가활동' },
  { value: '디지털도움', label: '디지털도움' },
  { value: '복지', label: '복지' },
] as const;

export default function SeniorPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('생활');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) {
      return;
    }

    if (!content.trim() || !category) {
      toast.error('내용과 카테고리를 모두 입력해주세요.');
      return;
    }

    try {
      // 내용 유효성 검사
      const validationResult = textValidationSchema.safeParse(content);
      if (!validationResult.success) {
        toast.error(validationResult.error.errors[0]?.message || '입력값이 올바르지 않습니다.');
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User error:', userError);
        toast.error('사용자 정보를 가져오는데 실패했습니다.');
        return;
      }

      if (!user?.id) {
        toast.error('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('questions')
        .insert([
          {
            title: category,
            content: content.trim(),
            category: category,
            image_url: imageUrl,
            user_id: user.id,
            is_ai_question: false,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        toast.error('질문 등록에 실패했습니다: ' + error.message);
        return;
      }

      toast.success('질문이 등록되었습니다.');
      router.push('/senior/answers');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('예기치 않은 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscriptionComplete = (text: string) => {
    setContent((prev) => prev + (prev ? '\n' : '') + text);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 섹션 */}
      <SeniorHeader />

      {/* 탭 메뉴 */}
      <div className="senior-nav">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex gap-8">
            <Link 
              href="/senior/ask"
              className="py-4 text-lg font-medium border-b-2 border-[#00C73C] text-[#00C73C]"
            >
              질문하기
            </Link>
            <Link 
              href="/senior/answers"
              className="py-4 text-lg font-medium text-neutral-400 hover:text-neutral-600"
            >
              답변 확인
            </Link>
            <Link 
              href="/senior/ask-ai"
              className="py-4 text-lg font-medium text-neutral-400 hover:text-neutral-600"
            >
              AI에게 질문하기
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-black">질문하기</h1>
            <div className="flex gap-4">
              <Button 
                asChild
                className="bg-[#00C73C] hover:bg-[#00912C] text-white rounded-full h-10 px-4 flex items-center gap-2"
              >
                <Link href="/senior/answers">
                  <Search className="h-4 w-4" />
                  <span>답변확인</span>
                </Link>
              </Button>
            </div>
          </div>
          <p className="text-xl text-neutral-400 mb-8">궁금하신 질문을 자유롭게 물어보세요.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 왼쪽: 질문 입력 폼 */}
            <Card className="border border-neutral-200">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-medium text-black">질문 작성</h2>
                    <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
                  </div>
                  
                  {/* 카테고리 선택 */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      카테고리
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 내용 입력 필드 */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      내용
                    </label>
                    <Textarea
                      id="content"
                      placeholder="궁금한 점을 입력하세요..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] resize-none bg-white border-neutral-200 text-xl p-4"
                    />
                  </div>

                  {/* 이미지 업로드 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이미지 첨부
                    </label>
                    <ImageUploader
                      imageUrl={imageUrl}
                      onImageUpload={setImageUrl}
                      onImageRemove={() => setImageUrl('')}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? '등록 중...' : '질문하기'}
                    </Button>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#00C73C] text-[#00C73C] hover:bg-[#00C73C] hover:text-white"
                  >
                    <Link href="/senior/ask-ai">
                      AI에게 질문하기
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 오른쪽: 도움말 */}
            <div className="space-y-6">
              <Card className="border border-neutral-200">
                <CardContent className="p-8">
                  <h3 className="text-xl font-medium mb-4">질문 작성 도움말</h3>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex gap-2">
                      <span className="text-[#00C73C]">•</span>
                      <span>카테고리를 선택하여 질문의 주제를 알려주세요.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00C73C]">•</span>
                      <span>궁금한 점을 구체적으로 설명해주세요.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00C73C]">•</span>
                      <span>필요한 경우 이미지를 첨부하여 상황을 설명해주세요.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00C73C]">•</span>
                      <span>음성으로도 질문을 작성할 수 있습니다.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 