# 소셜 로그인 설정 가이드

GenBridge 애플리케이션에 구글과 카카오 소셜 로그인을 설정하는 방법을 안내합니다.

## 1. Supabase 설정

### 구글 로그인 설정

1. [Supabase 대시보드](https://app.supabase.com/)에 로그인합니다.
2. 프로젝트를 선택합니다.
3. 왼쪽 메뉴에서 `Authentication` > `Providers`로 이동합니다.
4. "Google" 제공자를 찾아 활성화합니다.

#### 구글 OAuth 사용자 인증 정보 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 로그인합니다.
2. 프로젝트를 선택하거나 새 프로젝트를 생성합니다.
3. 왼쪽 메뉴에서 "API 및 서비스" > "사용자 인증 정보"로 이동합니다.
4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"를 클릭합니다.
5. 애플리케이션 유형으로 "웹 애플리케이션"을 선택합니다.
6. 적절한 이름을 입력합니다.
7. "승인된 리디렉션 URI"에 다음 URL을 추가합니다:
   ```
   https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
   ```
8. "만들기"를 클릭합니다.
9. 생성된 클라이언트 ID와 클라이언트 시크릿을 Supabase 대시보드의 Google 제공자 설정에 입력합니다.
10. Supabase 대시보드에서 "저장" 버튼을 클릭합니다.

### 카카오 로그인 설정

1. Supabase 대시보드에서 `Authentication` > `Providers`로 이동합니다.
2. "Kakao" 제공자를 찾아 활성화합니다.

#### 카카오 애플리케이션 설정

1. [Kakao Developers](https://developers.kakao.com/)에 로그인합니다.
2. "내 애플리케이션" > "애플리케이션 추가하기"를 클릭합니다.
3. 앱 이름을 입력하고 "저장"을 클릭합니다.
4. 생성된 애플리케이션의 "앱 설정" > "플랫폼" 메뉴로 이동합니다.
5. "Web" 플랫폼을 추가하고 앱의 도메인을 입력합니다.
6. "앱 설정" > "카카오 로그인" 메뉴로 이동합니다.
7. "활성화 설정"에서 카카오 로그인을 활성화합니다.
8. "Redirect URI"에 다음 URL을 추가합니다:
   ```
   https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
   ```
9. "동의항목" 메뉴에서 필요한 동의항목을 설정합니다. 최소한 "닉네임"과 "이메일" 정보를 요청해야 합니다.
10. "앱 키" 메뉴에서 생성된 "REST API 키"를 Supabase 대시보드의 Kakao 제공자 설정의 "Client ID" 필드에 입력합니다.
11. "앱 설정" > "보안" 메뉴에서 "Client Secret"을 발급받아 Supabase 대시보드의 "Client Secret" 필드에 입력합니다.
12. Supabase 대시보드에서 "저장" 버튼을 클릭합니다.

## 2. 애플리케이션 설정

프로젝트의 환경 변수가 올바르게 설정되어 있는지 확인하세요:

`.env.local` 파일에 다음 변수들이 설정되어 있어야 합니다:

```
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

## 3. 추가 설정 (선택사항)

### 사용자 메타데이터 커스터마이징

소셜 로그인으로 가입한 사용자의 프로필 정보를 더 세밀하게 제어하려면 Supabase Edge Function 또는 트리거를 사용할 수 있습니다.

### 역할 선택 기능 추가

소셜 로그인 후 사용자가 "청년" 또는 "시니어" 역할을 선택할 수 있는 추가 단계를 구현하려면 로그인 콜백 처리를 수정하세요.

## 4. 테스트

1. 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```

2. 브라우저에서 로그인 페이지(http://localhost:3000/login)로 이동합니다.

3. "Google로 로그인" 또는 "Kakao로 로그인" 버튼을 클릭하여 소셜 로그인을 테스트합니다.

## 5. 문제 해결

### 일반적인 문제

1. **리디렉션 URI 오류**: 구글이나 카카오에 설정한 리디렉션 URI가 Supabase의 콜백 URL과 정확히 일치하는지 확인하세요.

2. **권한 범위 문제**: 충분한 권한 범위를 요청했는지 확인하세요. 특히 카카오의 경우 필요한 동의항목을 설정했는지 확인하세요.

3. **CORS 오류**: Supabase 프로젝트의 CORS 설정에 애플리케이션의 도메인이 포함되어 있는지 확인하세요.

### 디버깅 팁

브라우저 콘솔에서 오류 메시지를 확인하세요. 대부분의 인증 관련 문제는 상세한 오류 메시지를 제공합니다. 