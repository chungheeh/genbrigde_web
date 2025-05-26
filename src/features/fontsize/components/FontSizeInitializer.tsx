'use client';

import { useEffect } from 'react';
import { useFontSizeStore } from '../store';

export function FontSizeInitializer() {
  const { fontSize } = useFontSizeStore();

  // 글씨 크기 초기화
  useEffect(() => {
    // 모든 폰트 크기 클래스 제거
    document.documentElement.classList.remove('text-normal', 'text-large', 'text-xlarge');
    // 현재 설정된 폰트 크기 클래스 추가
    document.documentElement.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  // 아무것도 렌더링하지 않음 (보이지 않는 컴포넌트)
  return null;
} 