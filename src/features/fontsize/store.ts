import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 글꼴 크기 유형
export type FontSizeType = 'normal' | 'large' | 'xlarge';

// 글꼴 크기 스토어 상태 인터페이스
interface FontSizeState {
  fontSize: FontSizeType;
  setFontSize: (size: FontSizeType) => void;
}

// 글꼴 크기 스토어 생성
export const useFontSizeStore = create<FontSizeState>()(
  persist(
    (set) => ({
      fontSize: 'normal', // 기본값: 보통 크기
      setFontSize: (size) => set({ fontSize: size }),
    }),
    {
      name: 'font-size-storage', // 로컬 스토리지 키 이름
    }
  )
); 