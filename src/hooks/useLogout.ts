'use client'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function useLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // 브라우저 환경에서만 실행
      if (typeof window !== 'undefined') {
        // 브라우저 스토리지 정리
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.removeItem('supabase.auth.token')
        
        // 쿠키 기반 세션의 클라이언트를 사용하여 로그아웃
        const supabase = createClientComponentClient()
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          throw error
        }
        
        // 스토리지와 상태를 완전히 정리하기 위해 페이지 리로드
        window.location.href = '/'
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
      
      // 오류가 발생해도 홈페이지로 리디렉션
      window.location.href = '/'
    }
  }

  return { handleLogout }
} 