import { z } from 'zod';

// 욕설과 비속어 목록 (실제 서비스에서는 더 포괄적인 목록이 필요합니다)
const PROHIBITED_WORDS = [
  '시발', '씨발', 'ㅅㅂ', 'ㅆㅂ',
  '병신', 'ㅂㅅ',
  '지랄', 'ㅈㄹ',
  '새끼', 'ㅅㄲ',
  '개새', '썅',
  '니미', '엠창',
  '좆', 'ㅈ같',
  '존나', 'ㅈㄴ',
] as const;

// 욕설/비속어 포함 여부 확인 함수
export const containsProhibitedWords = (text: string): boolean => {
  const normalizedText = text.toLowerCase().replace(/\s/g, '');
  return PROHIBITED_WORDS.some(word => normalizedText.includes(word));
};

// 텍스트 유효성 검사 스키마
export const textValidationSchema = z.string()
  .min(2, '최소 2자 이상 입력해주세요.')
  .max(1000, '최대 1000자까지 입력 가능합니다.')
  .refine(
    (text) => !containsProhibitedWords(text),
    { message: '부적절한 표현이 포함되어 있습니다.' }
  );

// 질문 유효성 검사 스키마
export const questionValidationSchema = textValidationSchema;

// 답변 유효성 검사 스키마
export const answerValidationSchema = textValidationSchema;

// 유효성 검사 에러 처리 함수
export const handleValidationError = (error: z.ZodError) => {
  return error.errors[0]?.message || '입력값이 올바르지 않습니다.';
}; 