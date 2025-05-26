# 이메일 인증 기능 구현 및 설정 가이드

이 가이드는 GenBridge 애플리케이션에 이메일 인증 기능을 완전히 구현하고 설정하는 방법을 안내합니다.

## 1. Supabase 프로젝트 링크

먼저 로컬 개발 환경을 Supabase 프로젝트에 연결해야 합니다.

```bash
# Supabase 로그인
supabase login

# 프로젝트 목록 확인
supabase projects list

# 프로젝트 링크 (YOUR_PROJECT_REF를 실제 프로젝트 ID로 변경하세요)
supabase link --project-ref YOUR_PROJECT_REF
```

## 2. 이메일 인증 관련 마이그레이션 적용

```bash
# 마이그레이션 적용
supabase db push
```

이 명령은 `supabase/migrations/20240630000000_add_email_verification.sql` 파일의 마이그레이션을 Supabase 데이터베이스에 적용합니다.

## 3. Edge Function 배포

```bash
# Edge Function 배포
supabase functions deploy verify-email --project-ref YOUR_PROJECT_REF
```

이 명령은 `supabase/functions/verify-email` 디렉토리의 Edge Function을 Supabase에 배포합니다.

## 4. SMTP 환경 변수 설정

### 개발 환경

개발 환경에서는 `.env.local` 파일에 다음 내용을 추가합니다:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# 개발 환경 설정 (이 설정으로 실제 이메일 발송 없이 콘솔에 인증 코드 출력)
NODE_ENV=development
```

### 프로덕션 환경

Supabase 대시보드에서 Edge Function에 환경 변수를 설정합니다:

1. [Supabase 대시보드](https://app.supabase.com)에 로그인합니다.
2. 프로젝트 선택 > Functions > verify-email > Settings 메뉴로 이동합니다.
3. 다음 환경 변수를 추가합니다:

```
# Gmail을 사용하는 경우
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENDER_EMAIL=your-email@gmail.com

# 네이버 메일을 사용하는 경우
SMTP_HOST=smtp.naver.com
SMTP_PORT=587
SMTP_USER=your-id@naver.com
SMTP_PASS=your-password
SENDER_EMAIL=your-id@naver.com

# 다음 메일을 사용하는 경우
SMTP_HOST=smtp.daum.net
SMTP_PORT=465
SMTP_USER=your-id@daum.net
SMTP_PASS=your-password
SENDER_EMAIL=your-id@daum.net
```

메일 서비스에 따라 적절한 설정을 선택하세요.

## 5. 메일 서비스별 설정 안내

### Gmail

Gmail을 SMTP 서버로 사용하려면:

1. [Google 계정 관리](https://myaccount.google.com/) 페이지로 이동합니다.
2. 보안 > 2단계 인증 > 시작하기를 클릭하여 2단계 인증을 활성화합니다.
3. 다시 보안 페이지로 돌아가 "앱 비밀번호"를 클릭합니다.
4. "앱 선택" 드롭다운에서 "기타(맞춤 이름)"를 선택하고 "Supabase Email" 등의 이름을 입력합니다.
5. "생성" 버튼을 클릭하면 16자리 앱 비밀번호가 생성됩니다.
6. 이 비밀번호를 `SMTP_PASS` 환경 변수 값으로 사용합니다.

### 네이버 메일

네이버 메일을 SMTP 서버로 사용하려면:

1. [네이버 메일](https://mail.naver.com) 로그인 후 설정으로 이동합니다.
2. POP3/IMAP 설정 메뉴로 이동하여 IMAP 사용을 활성화합니다.
3. SMTP 서버 접근을 위한 앱 비밀번호가 필요한 경우, 네이버 계정의 보안 설정에서 생성합니다.
4. 네이버 아이디와 비밀번호(또는 앱 비밀번호)를 각각 `SMTP_USER`와 `SMTP_PASS` 환경 변수 값으로 사용합니다.

### 다음 메일

다음 메일을 SMTP 서버로 사용하려면:

1. [다음 메일](https://mail.daum.net) 로그인 후 환경설정으로 이동합니다.
2. POP3/IMAP 설정 메뉴로 이동하여 IMAP 사용을 활성화합니다.
3. 다음 아이디와 비밀번호를 각각 `SMTP_USER`와 `SMTP_PASS` 환경 변수 값으로 사용합니다.

## 6. 애플리케이션 실행 및 테스트

```bash
npm run dev
```

1. 개발 환경에서 애플리케이션을 실행합니다.
2. 회원가입 페이지(http://localhost:3000/signup)로 이동합니다.
3. 이메일 주소를 입력하고 인증번호 발송 버튼을 클릭합니다.
4. 개발 환경에서는 브라우저 콘솔에 인증 코드가 출력됩니다.
5. 프로덕션 환경에서는 입력한 이메일 주소로 인증 코드가 발송됩니다.

## 7. 문제 해결

만약 인증 코드 생성 오류가 발생한다면 다음을 확인하세요:

1. Supabase 마이그레이션이 성공적으로 적용되었는지 확인:
   ```bash
   supabase db dump --schema public
   ```
   결과에 `verification_codes` 테이블과 `generate_email_verification_code` 함수가 포함되어 있어야 합니다.

2. Edge Function이 성공적으로 배포되었는지 확인:
   ```bash
   supabase functions list
   ```
   결과에 `verify-email` 함수가 포함되어 있어야 합니다.

3. 환경 변수가 올바르게 설정되었는지 확인합니다.

4. 브라우저 콘솔에서 자세한 오류 메시지를 확인합니다.

## 8. 데이터베이스 관리

인증 코드 테이블은 시간이 지남에 따라 많은 레코드가 쌓일 수 있습니다. 주기적으로 만료된 코드를 정리하는 스케줄러를 설정하는 것이 좋습니다.

```sql
-- 수동으로 만료된 코드 정리
SELECT public.delete_expired_verification_codes();
```

Supabase 스케줄러를 사용하여 자동으로 정리할 수도 있습니다.

## 9. 결론

이제 이메일 인증 기능이 완전히 구현되었습니다. 사용자가 회원가입 시 이메일 주소를 인증할 수 있으며, 네이버, 구글, 다음 등 다양한 이메일 서비스를 사용할 수 있습니다.

인증 코드는 사용자가 입력한 이메일 주소로 직접 발송되므로, 해당 이메일 서비스의 받은 편지함에서 확인할 수 있습니다. 