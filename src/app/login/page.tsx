"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from "sonner";
import { AuthError } from '@supabase/supabase-js';
import LoginSuccess from '@/components/LoginSuccess';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SocialLoginButtons from "@/components/SocialLoginButtons";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [showPassword, setShowPassword] = useState(false);
  const [seniorEmail, setSeniorEmail] = useState("");
  const [seniorPassword, setSeniorPassword] = useState("");
  const [youthEmail, setYouthEmail] = useState("");
  const [youthPassword, setYouthPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginSuccessOpen, setLoginSuccessOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  // 페이지 로드 시 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 세션 확인
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("세션 확인 오류:", error);
          return;
        }
        
        // 로그인 되어있지 않은 경우
        if (!session) {
          setIsCheckingAuth(false);
          return;
        }
        
        // 이미 로그인된 사용자의 프로필 확인
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        
        if (profileError) {
          // 프로필이 없는 경우 역할 선택 페이지로 이동
          if (profileError.code === "PGRST116") {
            console.log("프로필이 없음, 역할 선택 페이지로 이동");
            router.push("/role-selection");
            return;
          }
          
          console.error("프로필 확인 오류:", profileError);
          setIsCheckingAuth(false);
          return;
        }
        
        // 역할이 없는 경우 역할 선택 페이지로 이동
        if (!profile.role) {
          console.log("역할이 없음, 역할 선택 페이지로 이동");
          router.push("/role-selection");
          return;
        }
        
        // 역할이 있는 경우 해당 역할 페이지로 이동
        if (profile.role === "YOUTH") {
          router.push("/youth");
        } else if (profile.role === "SENIOR") {
          router.push("/senior");
        } else {
          // 지원되지 않는 역할인 경우 로그아웃
          await supabase.auth.signOut();
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error("인증 확인 오류:", error);
        setIsCheckingAuth(false);
      }
    };
    
    checkAuthStatus();
  }, [supabase, router]);

  const handleAuthError = (error: AuthError) => {
    console.error('Auth error details:', error);
    switch (error.message) {
      case 'Invalid login credentials':
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      case 'Email not confirmed':
        return '이메일 인증이 필요합니다. 이메일을 확인해주세요.';
      case 'User not found':
        return '등록되지 않은 사용자입니다.';
      case 'Invalid JWT token':
      case 'InvalidJWTToken':
        return '세션이 만료되었습니다. 다시 로그인해주세요.';
      default:
        return `로그인 오류: ${error.message}`;
    }
  };

  const handleYouthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youthEmail || !youthPassword) {
      toast.error('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    const trimmedEmail = youthEmail.trim().toLowerCase();
    const trimmedPassword = youthPassword.trim();

    setIsLoading(true);
    try {
      console.log('Attempting youth login...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword
      });

      if (signInError) {
        console.error('로그인 에러:', signInError);
        toast.error(handleAuthError(signInError));
        return;
      }

      if (!signInData.user) {
        console.error('No user data received');
        toast.error('로그인에 실패했습니다.');
        return;
      }

      console.log('Fetching profile...');
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, name, role, username')
          .eq('id', signInData.user.id)
          .single();

        console.log('Profile query result:', { profile, profileError });

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // 프로필이 없는 경우 역할 선택 페이지로 리디렉션
            console.log('프로필이 없습니다. 역할 선택 페이지로 리디렉션합니다.');
            router.push('/role-selection');
            return;
          } else {
            throw profileError;
          }
        }

        // 역할이 없는 경우 역할 선택 페이지로 리디렉션
        if (!profile || !profile.role) {
          console.log('역할이 설정되지 않았습니다. 역할 선택 페이지로 리디렉션합니다.');
          router.push('/role-selection');
          return;
        }

        // 역할 검사 시 대소문자 구분 없이 처리
        const normalizedRole = profile.role?.toUpperCase();
        if (normalizedRole !== 'YOUTH') {
          console.error('Invalid role:', profile.role);
          toast.error('청년 계정이 아닙니다.');
          await supabase.auth.signOut();
          return;
        }

        setUserRole('YOUTH');
        setLoginSuccessOpen(true);
        router.refresh();

      } catch (error: any) {
        console.error('Profile operation error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });

        if (error.code === 'PGRST301') {
          toast.error('프로필 접근 권한이 없습니다.');
        } else if (error.code === '23505') {
          toast.error('이미 존재하는 프로필입니다.');
        } else if (error.code === '42501') {
          toast.error('프로필을 생성할 권한이 없습니다.');
        } else {
          toast.error('프로필 정보를 불러오는데 실패했습니다.');
        }
        await supabase.auth.signOut();
        return;
      }
    } catch (error) {
      console.error('예상치 못한 오류:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error('로그인 중 오류가 발생했습니다.');
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeniorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seniorEmail || !seniorPassword) {
      toast.error('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    const trimmedEmail = seniorEmail.trim().toLowerCase();
    const trimmedPassword = seniorPassword.trim();

    setIsLoading(true);
    try {
      // 로그인 시도
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword
      });

      if (signInError) {
        console.error('로그인 에러:', signInError);
        toast.error(handleAuthError(signInError));
        return;
      }

      if (!signInData.user) {
        toast.error('로그인에 실패했습니다.');
        return;
      }

      // 프로필 확인
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signInData.user.id)
          .single();

        // 프로필이 없는 경우 역할 선택 페이지로 리디렉션
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            console.log('프로필이 없습니다. 역할 선택 페이지로 리디렉션합니다.');
            router.push('/role-selection');
            return;
          } else {
            throw profileError;
          }
        }

        // 역할이 없는 경우 역할 선택 페이지로 리디렉션
        if (!profile || !profile.role) {
          console.log('역할이 설정되지 않았습니다. 역할 선택 페이지로 리디렉션합니다.');
          router.push('/role-selection');
          return;
        }

        // 역할 확인
        if (profile.role !== 'SENIOR') {
          toast.error('시니어 계정이 아닙니다.');
          await supabase.auth.signOut();
          return;
        }

        // 로그인 성공
        setUserRole('SENIOR');
        setLoginSuccessOpen(true);
        router.refresh();
      } catch (error: any) {
        console.error('프로필 조회 에러:', error);
        toast.error('프로필 정보를 불러오는데 실패했습니다.');
        await supabase.auth.signOut();
        return;
      }
    } catch (error) {
      console.error('예상치 못한 오류:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error('로그인 중 오류가 발생했습니다.');
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-green-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">로그인 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 섹션 */}
      <header className="w-full py-4 px-6 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            GenBridge
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              홈
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              소개
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              문의
            </Link>
          </nav>
        </div>
      </header>

      {/* 로그인 컨텐츠 */}
      <div className="flex-1 container flex flex-col items-center justify-center p-4 mx-auto">
        <Card className="w-full max-w-md border shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-center">로그인</h1>
              <p className="text-center text-gray-600">젠브릿지에 오신 것을 환영합니다</p>
            </div>
            
            {/* 간편 로그인 섹션 */}
            <div className="space-y-4">
              <SocialLoginButtons />
              
              <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-500">또는</span>
                <Separator className="flex-1" />
              </div>
            </div>
            
            <Tabs defaultValue="청년" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="청년">청년</TabsTrigger>
                <TabsTrigger value="시니어">시니어</TabsTrigger>
              </TabsList>
              
              <TabsContent value="청년" className="mt-4 space-y-4">
                <Card className="overflow-hidden border">
                  <CardContent className="p-0">
                    <Image 
                      src="https://picsum.photos/id/1/800/400" 
                      alt="로그인 이미지"
                      width={800}
                      height={400}
                      className="object-cover w-full h-56"
                    />
                  </CardContent>
                </Card>
                
                <form onSubmit={handleYouthLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">이메일</label>
                    <Input 
                      id="email" 
                      placeholder="이메일을 입력해주세요" 
                      type="email"
                      value={youthEmail}
                      onChange={(e) => setYouthEmail(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium">비밀번호</label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        placeholder="비밀번호를 입력해주세요" 
                        type={showPassword ? "text" : "password"}
                        value={youthPassword}
                        onChange={(e) => setYouthPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                      </button>
                    </div>
                    <div className="mt-2 text-right">
                      <Link href="/reset-password" className="text-sm text-green-600 hover:text-green-700">
                        비밀번호를 잊으셨나요?
                      </Link>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isLoading}>로그인</Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    계정이 없으신가요?{' '}
                    <Link href="/signup" className="text-green-600 hover:text-green-700">
                      회원가입
                    </Link>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="시니어" className="mt-4 space-y-4">
                <Card className="overflow-hidden border">
                  <CardContent className="p-0">
                    <Image 
                      src="https://picsum.photos/id/2/800/400" 
                      alt="로그인 이미지"
                      width={800}
                      height={400}
                      className="object-cover w-full h-56"
                    />
                  </CardContent>
                </Card>
                
                <form onSubmit={handleSeniorLogin} className="space-y-4">
                  <div>
                    <label htmlFor="senior-email" className="block mb-2 text-sm font-medium">이메일</label>
                    <Input 
                      id="senior-email" 
                      placeholder="이메일을 입력해주세요" 
                      type="email"
                      value={seniorEmail}
                      onChange={(e) => setSeniorEmail(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="senior-password" className="block mb-2 text-sm font-medium">비밀번호</label>
                    <div className="relative">
                      <Input 
                        id="senior-password" 
                        placeholder="비밀번호를 입력해주세요" 
                        type={showPassword ? "text" : "password"}
                        value={seniorPassword}
                        onChange={(e) => setSeniorPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                      </button>
                    </div>
                    <div className="mt-2 text-right">
                      <Link href="/reset-password" className="text-sm text-green-600 hover:text-green-700">
                        비밀번호를 잊으셨나요?
                      </Link>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isLoading}>로그인</Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    계정이 없으신가요?{' '}
                    <Link href="/signup" className="text-green-600 hover:text-green-700">
                      회원가입
                    </Link>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Dialog open={loginSuccessOpen} onOpenChange={setLoginSuccessOpen}>
        <DialogContent className="max-w-md p-0 bg-transparent shadow-none border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>로그인 성공</DialogTitle>
          </DialogHeader>
          <LoginSuccess 
            role={userRole}
            onContinue={() => {
              setLoginSuccessOpen(false);
              if (userRole === 'SENIOR') {
                router.push('/senior');
              } else {
                router.push('/youth');
              }
              router.refresh();
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 