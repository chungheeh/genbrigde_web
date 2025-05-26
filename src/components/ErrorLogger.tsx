"use client";

import { useEffect, useState } from 'react';

/**
 * 개발 환경에서만 사용되는 에러 로깅 컴포넌트
 * 콘솔에 기록된 에러를 화면에 표시하여 디버깅을 용이하게 함
 */
export default function ErrorLogger() {
  const [errors, setErrors] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 개발 환경에서만 에러 로그를 표시
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // 원본 console.error 메서드 저장
    const originalError = console.error;

    // console.error를 오버라이드하여 에러 로그를 수집
    console.error = (...args: any[]) => {
      // 원본 동작 유지
      originalError(...args);

      // 에러 메시지 변환 및 저장
      const errorMessages = args.map(arg => {
        if (arg instanceof Error) {
          return `${arg.name}: ${arg.message}\n${arg.stack}`;
        } else if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        } else {
          return String(arg);
        }
      });

      // 에러 목록 업데이트
      setErrors(prev => [...prev, ...errorMessages]);
    };

    // 컴포넌트 언마운트 시 원래 메서드로 복원
    return () => {
      console.error = originalError;
    };
  }, []);

  if (process.env.NODE_ENV !== 'development' || errors.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      >
        {isVisible ? '에러 로그 숨기기' : `에러 로그 (${errors.length})`}
      </button>
      
      {isVisible && (
        <div className="mt-2 p-4 bg-black bg-opacity-90 text-white rounded-lg shadow-xl max-h-[50vh] overflow-y-auto w-[95vw] max-w-3xl">
          <h3 className="text-lg font-bold mb-2">에러 로그</h3>
          <button 
            onClick={() => setErrors([])}
            className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
          >
            초기화
          </button>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="border-b border-gray-700 pb-2 whitespace-pre-wrap font-mono text-xs">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 