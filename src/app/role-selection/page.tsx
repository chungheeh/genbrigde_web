"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ErrorLogger from "@/components/ErrorLogger";
import SqlRunner from "@/components/SqlRunner";

export default function RoleSelectionPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  // 개인정보 필드 추가
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "role">("profile");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // 약관 동의 상태
  const [allChecked, setAllChecked] = useState(false);
  const [checks, setChecks] = useState({
    terms: false,
    service: false,
    marketing: false
  });

  // 유효성 검사 상태
  const [errors, setErrors] = useState({
    name: "",
    phone: ""
  });

  // 프로필 유효성 검사
  const validateProfile = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      phone: ""
    };

    if (!name.trim()) {
      newErrors.name = "이름을 입력해주세요";
      isValid = false;
    }

    // 전화번호 유효성 검사 (옵션)
    if (phone.trim() && !/^01[0-9]{8,9}$/.test(phone.replace(/-/g, ''))) {
      newErrors.phone = "유효한 전화번호를 입력해주세요 ('-' 제외 11자리)";
      isValid = false;
    }

    // 필수 약관 동의 확인
    if (!checks.terms || !checks.service) {
      toast.error("필수 약관에 동의해주세요");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 전체 동의 핸들러
  const handleAllCheck = (checked: boolean) => {
    setAllChecked(checked);
    setChecks({
      terms: checked,
      service: checked,
      marketing: checked
    });
  };

  // 개별 체크박스 핸들러
  const handleSingleCheck = (name: keyof typeof checks, checked: boolean) => {
    const newChecks = { ...checks, [name]: checked };
    setChecks(newChecks);
    
    // 모든 체크박스가 체크되었는지 확인
    const allChecked = Object.values(newChecks).every(value => value === true);
    setAllChecked(allChecked);
  };

  // 프로필 정보 입력 후 다음 단계로 이동
  const handleNextStep = () => {
    if (validateProfile()) {
      setActiveTab("role");
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("역할 선택 페이지: 인증 상태 확인 중...");
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("세션 확인 오류:", error);
          toast.error("인증 정보를 확인하는 중 오류가 발생했습니다.");
          await supabase.auth.signOut(); // 오류 발생 시 로그아웃
          router.push("/login");
          return;
        }
        
        if (!session) {
          // 로그인되지 않은 경우
          console.error("세션이 없습니다. 로그인 페이지로 이동합니다.");
          toast.error("로그인이 필요합니다.");
          router.push("/login");
          return;
        }
        
        console.log("역할 선택 페이지: 세션 확인 성공, 사용자 ID:", session.user.id);
        setUserEmail(session.user.email);
        
        // 이미 역할이 설정되어 있는지 확인
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        
        if (profileError) {
          if (profileError.code === "PGRST116") {
            // 프로필이 없는 경우
            console.log("역할 선택 페이지: 프로필이 없습니다. 역할 선택을 계속합니다.");
            // 사용자 ID 설정하고 계속 진행
            setUserId(session.user.id);
            setIsCheckingAuth(false);
            return;
          }
          
          console.error("프로필 확인 오류:", profileError);
          toast.error("프로필 정보를 불러오는 중 오류가 발생했습니다.");
          await supabase.auth.signOut(); // 오류 발생 시 로그아웃
          router.push("/login");
          return;
        }
        
        // 이미 역할이 설정되어 있으면 해당 역할 페이지로 리디렉션
        if (profile && profile.role) {
          console.log("역할 선택 페이지: 이미 역할이 설정되어 있습니다:", profile.role);
          if (profile.role === "YOUTH") {
            router.push("/youth");
          } else if (profile.role === "SENIOR") {
            router.push("/senior");
          } else {
            // 지원되지 않는 역할인 경우 로그아웃하고 로그인 페이지로 이동
            console.error("지원되지 않는 역할입니다:", profile.role);
            await supabase.auth.signOut();
            toast.error("지원되지 않는 역할입니다. 다시 로그인해주세요.");
            router.push("/login");
          }
          return;
        }
        
        // 프로필은 있지만 역할이 없는 경우
        console.log("역할 선택 페이지: 프로필은 있지만 역할이 설정되어 있지 않습니다.");
        // 사용자 ID 설정
        setUserId(session.user.id);
      } catch (error) {
        console.error("인증 확인 오류:", error);
        toast.error("인증 상태를 확인하는 중 오류가 발생했습니다.");
        await supabase.auth.signOut(); // 오류 발생 시 로그아웃
        router.push("/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuthStatus();
  }, [supabase, router]);

  // 데이터베이스 필드가 존재하는지 확인하는 함수
  const checkFieldExists = async (tableName: string, columnName: string) => {
    try {
      const { data, error } = await supabase.rpc('check_column_exists', {
        p_table_name: tableName,
        p_column_name: columnName
      });
      
      if (error) {
        console.error('필드 확인 오류:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('RPC 호출 오류:', error);
      return false;
    }
  };

  const handleRoleSelection = async (role: "YOUTH" | "SENIOR") => {
    if (!userId) {
      console.error("사용자 ID가 없습니다.");
      toast.error("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      await supabase.auth.signOut();
      router.push("/login");
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    console.log(`역할 선택: ${role} 역할 설정 시작...`);
    
    try {
      // 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("사용자 정보 가져오기 오류:", userError);
        throw userError;
      }
      
      if (!user) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
      }
      
      // 사용자 프로필 업데이트 또는 생성
      console.log("프로필 업데이트 시도 중...");
      
      // 최소 필드만 사용하여 업데이트 또는 생성
      const upsertResult = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          email: user.email,
          name: name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "사용자",
          username: user.user_metadata?.preferred_username || user.user_metadata?.name || user.email?.split("@")[0] || "사용자",
          role: role,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      // 결과 저장 (디버그 모드)
      setResult(upsertResult);
      
      // 오류 처리
      if (upsertResult.error) {
        console.error("프로필 업데이트 오류:", {
          code: upsertResult.error.code,
          message: upsertResult.error.message,
          details: upsertResult.error.details,
          hint: upsertResult.error.hint
        });
        throw upsertResult.error;
      }
      
      // 역할 저장에 성공했음을 알리는 토스트 메시지 표시
      console.log(`역할 설정 성공: ${role}`);
      toast.success(`${role === "YOUTH" ? "청년" : "시니어"}으로 등록되었습니다.`);
      
      // 디버그 모드가 아닌 경우 즉시 리디렉션
      if (!debugMode) {
        console.log(`리디렉션: ${role === "YOUTH" ? "/youth" : "/senior"} 페이지로 이동합니다.`);
        router.push(role === "YOUTH" ? "/youth" : "/senior");
      }
      
    } catch (error: any) {
      const errorMessage = error?.message || "알 수 없는 오류";
      console.error("역할 설정 오류:", {
        error,
        message: errorMessage,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        status: error?.status
      });
      toast.error(`역할을 설정하는 중 오류가 발생했습니다: ${errorMessage}`);
      setResult({ error });
    } finally {
      setIsLoading(false);
    }
  };

  // 응급 역할 설정 함수
  const emergencySetRole = async (role: "YOUTH" | "SENIOR") => {
    if (!userId) {
      toast.error("사용자 ID가 없습니다.");
      return;
    }
    
    try {
      setIsLoading(true);
      toast.info("응급 역할 설정 시도 중...");
      
      // 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!user) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
      }
      
      // 사용자 메타데이터에서 정보 추출
      const displayName = name || user.user_metadata?.full_name || user.user_metadata?.name || "사용자";
      const displayUsername = user.user_metadata?.preferred_username || user.user_metadata?.name || user.email?.split("@")[0] || "사용자";
      
      // SQL 쿼리를 직접 호출
      const { data, error } = await supabase.rpc('run_sql_query', { 
        query: `
          INSERT INTO profiles (id, email, name, username, role, updated_at)
          VALUES ('${userId}', 
                  '${userEmail || "unknown@example.com"}', 
                  '${displayName}', 
                  '${displayUsername}', 
                  '${role}', 
                  NOW())
          ON CONFLICT (id) 
          DO UPDATE SET 
            role = '${role}',
            name = COALESCE(profiles.name, '${displayName}'),
            username = COALESCE(profiles.username, '${displayUsername}'),
            updated_at = NOW()
          RETURNING *
        `
      });
      
      if (error) {
        console.error("응급 역할 설정 오류:", error);
        toast.error(`응급 역할 설정 실패: ${error.message}`);
        setResult({ error });
        return;
      }
      
      console.log("응급 역할 설정 성공:", data);
      toast.success(`${role === "YOUTH" ? "청년" : "시니어"} 역할이 성공적으로 설정되었습니다!`);
      setResult(data);
      
      // 즉시 적절한 페이지로 리디렉션
      console.log(`리디렉션: ${role === "YOUTH" ? "/youth" : "/senior"} 페이지로 이동합니다.`);
      router.push(role === "YOUTH" ? "/youth" : "/senior");
      
    } catch (error: any) {
      console.error("응급 역할 설정 오류:", error);
      toast.error(`응급 역할 설정 중 오류 발생: ${error.message || "알 수 없는 오류"}`);
      setResult({ error });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-500" />
          <h1 className="text-2xl font-bold mb-2">인증 확인 중...</h1>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  // 사용자 ID가 없으면 (로그인되지 않은 상태) 에러 표시
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">로그인 후 역할을 선택할 수 있습니다.</p>
          <Button 
            onClick={() => router.push('/login')}
            className="bg-green-500 hover:bg-green-600"
          >
            로그인 페이지로 이동
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-4 px-6 border-b">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">GenBridge</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">회원 정보 설정</h1>
            <p className="text-gray-600">
              GenBridge 서비스 이용을 위해 필요한 정보를 입력해주세요.
            </p>
          </div>
          
          {/* 디버그 모드 토글 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 flex justify-end">
              <label className="flex items-center space-x-2 text-sm">
                <Checkbox 
                  checked={debugMode} 
                  onCheckedChange={(checked) => setDebugMode(!!checked)} 
                  id="debug-mode" 
                />
                <span>디버그 모드 (리디렉션 하지 않음)</span>
              </label>
            </div>
          )}
          
          {/* 디버그 결과 표시 */}
          {debugMode && result && (
            <div className="mb-6 p-4 bg-black text-white rounded-lg overflow-x-auto">
              <h3 className="font-bold mb-2">디버그 결과:</h3>
              <pre className="text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
              {!result.error && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const role = result.data?.[0]?.role || "YOUTH";
                      if (role === "YOUTH") {
                        router.push("/youth");
                      } else {
                        router.push("/senior");
                      }
                    }}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    {result.data?.[0]?.role === "SENIOR" ? "시니어" : "청년"} 페이지로 이동
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* 응급 처치 버튼 */}
          {process.env.NODE_ENV === 'development' && debugMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <h3 className="font-bold text-yellow-800 mb-2">응급 역할 설정</h3>
              <p className="text-sm text-yellow-700 mb-4">
                일반적인 방법으로 역할 설정이 실패할 경우 아래 버튼을 사용하여 직접 SQL로 역할을 설정할 수 있습니다.
                이 방법은 개발 환경에서만 사용하세요.
              </p>
              <div className="flex space-x-4">
                <Button 
                  onClick={() => emergencySetRole("YOUTH")}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={isLoading || !userId}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  청년으로 직접 설정
                </Button>
                <Button 
                  onClick={() => emergencySetRole("SENIOR")}
                  className="bg-purple-500 hover:bg-purple-600"
                  disabled={isLoading || !userId}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  시니어로 직접 설정
                </Button>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="profile" value={activeTab} onValueChange={(v) => setActiveTab(v as "profile" | "role")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">개인정보 입력</TabsTrigger>
              <TabsTrigger value="role" disabled={activeTab === "profile"}>역할 선택</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>개인정보 입력</CardTitle>
                  <CardDescription>
                    서비스 이용을 위한 필수 정보를 입력해주세요.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userEmail && (
                    <div>
                      <Label htmlFor="email">이메일</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={userEmail}
                        className="mt-1"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">소셜 로그인으로 인증된 이메일입니다.</p>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="name">이름 <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name" 
                      placeholder="이름을 입력해주세요" 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">전화번호</Label>
                    <Input 
                      id="phone" 
                      placeholder="휴대폰 번호 입력('-' 제외 11자리 입력)" 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1"
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                    <p className="text-xs text-gray-500 mt-1">연락 가능한 전화번호를 입력해주세요.</p>
                  </div>
                  
                  {/* 약관 동의 섹션 */}
                  <div className="p-4 bg-gray-50 rounded-lg mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="all-agree" 
                          checked={allChecked} 
                          onCheckedChange={(checked) => handleAllCheck(checked as boolean)}
                        />
                        <label 
                          htmlFor="all-agree" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          약관에 모두 동의합니다.
                        </label>
                      </div>

                      <div className="pl-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="terms" 
                              checked={checks.terms}
                              onCheckedChange={(checked) => handleSingleCheck('terms', checked as boolean)}
                            />
                            <label 
                              htmlFor="terms" 
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              이용약관에 동의합니다. <span className="text-red-500">(필수)</span>
                            </label>
                          </div>
                          <Button variant="link" className="text-xs h-auto p-0">내용보기</Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="service" 
                              checked={checks.service}
                              onCheckedChange={(checked) => handleSingleCheck('service', checked as boolean)}
                            />
                            <label 
                              htmlFor="service" 
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              서비스 약관에 동의합니다. <span className="text-red-500">(필수)</span>
                            </label>
                          </div>
                          <Button variant="link" className="text-xs h-auto p-0">내용보기</Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="marketing" 
                              checked={checks.marketing}
                              onCheckedChange={(checked) => handleSingleCheck('marketing', checked as boolean)}
                            />
                            <label 
                              htmlFor="marketing" 
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              마케팅 서비스 이용에 동의합니다. (선택)
                            </label>
                          </div>
                          <Button variant="link" className="text-xs h-auto p-0">내용보기</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleNextStep} 
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    다음 단계
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="role" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">역할을 선택해주세요</h2>
                <p className="text-gray-600">
                  GenBridge에서 어떤 역할로 활동하고 싶으신가요? 선택하신 역할에 맞는 서비스를 제공해 드립니다.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 청년 카드 */}
                <Card className="overflow-hidden border hover:shadow-lg transition-shadow transform hover:scale-105 hover:border-blue-500">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src="https://picsum.photos/id/1/800/400"
                        alt="청년 이미지"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="mb-2 text-2xl text-blue-600">청년</CardTitle>
                    <CardDescription className="min-h-[100px]">
                      디지털 세상에 익숙한 젊은 세대로서 시니어분들의 디지털 활동을 돕고 
                      세대 간 소통의 다리 역할을 하며 새로운 경험을 쌓을 수 있습니다.
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      onClick={() => handleRoleSelection("YOUTH")} 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      청년으로 시작하기
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* 시니어 카드 */}
                <Card className="overflow-hidden border hover:shadow-lg transition-shadow transform hover:scale-105 hover:border-purple-500">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src="https://picsum.photos/id/2/800/400"
                        alt="시니어 이미지"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="mb-2 text-2xl text-purple-600">시니어</CardTitle>
                    <CardDescription className="min-h-[100px]">
                      풍부한 경험과 지혜를 가진 시니어로서 젊은 세대와 소통하며
                      디지털 세상을 더 쉽게 이용하고 새로운 활동에 참여할 수 있습니다.
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      onClick={() => handleRoleSelection("SENIOR")} 
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      시니어로 시작하기
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="md:col-span-2 text-center mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("profile")}
                    className="mx-auto"
                  >
                    이전 단계로 돌아가기
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* 디버깅을 위한 에러 로거 컴포넌트 */}
      <ErrorLogger />
      
      {/* 개발용 SQL 쿼리 실행 컴포넌트 */}
      {process.env.NODE_ENV === 'development' && <SqlRunner />}
    </div>
  );
} 