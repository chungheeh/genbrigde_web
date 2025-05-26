# 이메일 인증 기능 설정 안내서

## 1. Supabase 마이그레이션 적용하기

먼저 이메일 인증 관련 테이블과 함수를 Supabase에 적용해야 합니다.

```bash
# 터미널에서 실행
supabase db push
```

## 2. Supabase Edge Function 배포하기

이메일 전송을 위한 Edge Function을 배포합니다.

```bash
# 터미널에서 실행
supabase functions deploy verify-email
```

## 3. 환경 변수 설정하기

### 개발 환경

개발 환경에서는 `.env.local` 파일에 다음과 같은 환경 변수를 설정합니다:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 개발 환경 설정
NODE_ENV=development
```

개발 환경에서는 실제 이메일을 발송하지 않고 콘솔에 인증 코드를 출력합니다.

### 프로덕션 환경

Supabase 대시보드에서 Edge Function에 다음 환경 변수를 설정합니다:

1. Supabase 대시보드에 로그인합니다.
2. 프로젝트 선택 > Functions > Settings 메뉴로 이동합니다.
3. 다음 환경 변수를 추가합니다:

```
SMTP_HOST=smtp.gmail.com (또는 사용하려는 메일 서버)
SMTP_PORT=587 (또는 메일 서버에 맞는 포트)
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SENDER_EMAIL=your-email@example.com
```

## 4. SMTP 설정 안내

### Gmail 사용 시
Gmail을 사용하는 경우 앱 비밀번호를 생성해야 합니다:

1. Google 계정의 보안 설정에서 2단계 인증을 활성화합니다.
2. '앱 비밀번호' 메뉴에서 새 앱 비밀번호를 생성합니다.
3. 생성된 비밀번호를 `SMTP_PASS` 환경 변수에 설정합니다.

### 네이버 메일 사용 시
```
SMTP_HOST=smtp.naver.com
SMTP_PORT=587
```

### 다음 메일 사용 시
```
SMTP_HOST=smtp.daum.net
SMTP_PORT=465
```

## 5. 테스트하기

개발 환경에서 애플리케이션을 실행하고 회원가입 페이지에서 이메일 인증 기능을 테스트합니다:

```bash
npm run dev
```

이메일 인증 코드를 요청하면 브라우저 콘솔에 인증 코드가 출력됩니다.

## 6. 문제 해결

문제가 발생한 경우 다음을 확인하세요:

1. Supabase 마이그레이션이 성공적으로 적용되었는지 확인합니다.
2. Edge Function이 성공적으로 배포되었는지 확인합니다.
3. 개발 환경에서는 콘솔에 인증 코드가 출력되는지 확인합니다.
4. 프로덕션 환경에서는 SMTP 설정이 올바른지 확인합니다. 