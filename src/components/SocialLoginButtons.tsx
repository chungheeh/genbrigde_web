"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";

export default function SocialLoginButtons() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState<{
    google: boolean;
    kakao: boolean;
  }>({
    google: false,
    kakao: false
  });

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(prev => ({ ...prev, google: true }));
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('구글 로그인 오류:', error);
      toast({
        title: "로그인 실패",
        description: error.message || "구글 로그인 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(prev => ({ ...prev, kakao: true }));
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('카카오 로그인 오류:', error);
      toast({
        title: "로그인 실패",
        description: error.message || "카카오 로그인 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, kakao: false }));
    }
  };

  return (
    <div className="space-y-3">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleGoogleLogin}
        disabled={isLoading.google}
        className="w-full relative"
      >
        {isLoading.google ? (
          <span className="inline-block">로그인 중...</span>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            <span>Google로 로그인</span>
          </>
        )}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleKakaoLogin}
        disabled={isLoading.kakao}
        className="w-full bg-[#FEE500] hover:bg-[#E6CF00] text-black hover:text-black border-[#FEE500] hover:border-[#E6CF00]"
      >
        {isLoading.kakao ? (
          <span className="inline-block">로그인 중...</span>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C17.2874 3 21.5716 6.40372 21.5716 10.5986C21.5716 14.7934 17.2874 18.1971 12 18.1971C11.4724 18.1971 10.9457 18.156 10.4269 18.0754L6.90679 20.6523C6.69289 20.8093 6.39578 20.7477 6.23866 20.5338C6.18941 20.4677 6.16327 20.3879 6.16327 20.3062V16.6802C3.9034 15.2452 2.42847 13.0546 2.42847 10.5986C2.42847 6.40372 6.7126 3 12 3Z" fill="#371C1D"/>
            </svg>
            <span>Kakao로 로그인</span>
          </>
        )}
      </Button>
    </div>
  );
} 