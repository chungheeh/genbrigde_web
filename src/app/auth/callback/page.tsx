"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('인증 콜백 처리 시작...');
        
        // 현재 세션 확인
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('세션 확인 오류:', error);
          router.push('/login?error=로그인 처리 중 오류가 발생했습니다.');
          return;
        }
        
        if (!session) {
          console.error('세션이 없습니다.');
          router.push('/login?error=인증에 실패했습니다.');
          return;
        }
        
        console.log('소셜 로그인 성공, 사용자 ID:', session.user.id);
        
        // 유저 정보 확인 및 프로필 처리
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        // 프로필 조회 오류 처리
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // PGRST116은 데이터가 없는 경우의 에러 코드
            console.log('프로필이 없습니다. 역할 선택 페이지로 이동합니다.');
            router.push('/role-selection');
            return;
          }
          
          console.error('프로필 조회 오류:', profileError);
          router.push('/login?error=프로필 정보를 불러오는데 실패했습니다.');
          return;
        }
        
        // 프로필은 있지만 역할이 설정되어 있지 않은 경우
        if (!profile || !profile.role) {
          console.log('역할이 없습니다. 역할 선택 페이지로 이동합니다.');
          router.push('/role-selection');
          return;
        }
        
        // 역할이 설정되어 있는 경우 해당 역할 페이지로 이동
        if (profile.role === 'YOUTH') {
          console.log('청년 역할이 확인되었습니다. 청년 페이지로 이동합니다.');
          router.push('/youth');
        } else if (profile.role === 'SENIOR') {
          console.log('시니어 역할이 확인되었습니다. 시니어 페이지로 이동합니다.');
          router.push('/senior');
        } else {
          // 역할이 설정되어 있지만 지원되지 않는 역할인 경우
          console.log('지원되지 않는 역할입니다. 역할 선택 페이지로 이동합니다:', profile.role);
          router.push('/role-selection');
        }
      } catch (err) {
        console.error('인증 콜백 처리 오류:', err);
        router.push('/login?error=로그인 처리 중 오류가 발생했습니다.');
      }
    };
    
    handleAuthCallback();
  }, [router, searchParams, supabase]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-500" />
        <h1 className="text-2xl font-bold mb-2">로그인 처리 중...</h1>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
} 