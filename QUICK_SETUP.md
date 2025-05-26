# 이메일 인증 기능 빠른 설정 가이드

## 구현된 기능

모든 이메일 서비스(네이버, 구글, 다음 등)에 대한 인증 코드 발송 및 확인 기능이 구현되었습니다.

## 빠른 설정 단계

### 1. 데이터베이스 마이그레이션

```bash
supabase db push
```

### 2. Edge Function 배포

```bash
supabase functions deploy verify-email
```

### 3. 이메일 서비스별 SMTP 설정

| 서비스 | SMTP 서버 | 포트 | 설정 방법 |
|--------|----------|-----|----------|
| Gmail | smtp.gmail.com | 587 | 앱 비밀번호 사용 |
| 네이버 | smtp.naver.com | 587 | IMAP 활성화 필요 |
| 다음 | smtp.daum.net | 465 | IMAP 활성화 필요 |

### 4. 개발 환경 테스트

개발 환경에서는 이메일 발송 없이 콘솔에 인증 코드가 출력됩니다.

### 5. 프로덕션 환경

Supabase 대시보드에서 Edge Function에 환경 변수를 설정하세요.

## 자세한 설정 방법

자세한 설정 방법은 `SETUP_GUIDE.md` 파일을 참조하세요. 