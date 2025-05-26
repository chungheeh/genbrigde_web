// Supabase Edge Function for sending email verification codes
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { corsHeaders } from '../_shared/cors.ts';

interface EmailData {
  email: string;
  code: string;
}

serve(async (req) => {
  // CORS preflight 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 요청 바디 파싱
    const { email, code } = await req.json() as EmailData;

    if (!email || !code) {
      return new Response(
        JSON.stringify({
          error: '이메일 주소와 인증 코드가 필요합니다.'
        }),
        {
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 환경 변수 확인
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPass = Deno.env.get('SMTP_PASS');
    const senderEmail = Deno.env.get('SENDER_EMAIL');

    if (!smtpHost || !smtpUser || !smtpPass || !senderEmail) {
      console.error('SMTP 설정이 완료되지 않았습니다.');
      return new Response(
        JSON.stringify({
          error: '서버 설정 오류. 관리자에게 문의하세요.'
        }),
        {
          status: 500,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 이메일 클라이언트 설정
    const client = new SmtpClient();
    
    await client.connectTLS({
      hostname: smtpHost,
      port: smtpPort,
      username: smtpUser,
      password: smtpPass,
    });

    // 이메일 형식 만들기
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #34C759; text-align: center;">GenBridge 이메일 인증</h2>
        <p style="font-size: 16px; line-height: 1.5;">안녕하세요!</p>
        <p style="font-size: 16px; line-height: 1.5;">GenBridge에 가입해 주셔서 감사합니다. 아래 인증 코드를 입력하여 이메일 주소를 확인해주세요.</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${code}
          </div>
        </div>
        <p style="font-size: 16px; line-height: 1.5;">인증 코드는 2분 동안 유효합니다.</p>
        <p style="font-size: 16px; line-height: 1.5;">이 메일을 요청하지 않으셨다면, 이 메일을 무시하셔도 됩니다.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 14px;">
          &copy; ${new Date().getFullYear()} GenBridge. All rights reserved.
        </div>
      </div>
    `;

    // 이메일 전송
    await client.send({
      from: senderEmail,
      to: email,
      subject: "[GenBridge] 이메일 인증 코드",
      content: "인증 코드: " + code,
      html: emailHtml
    });

    await client.close();

    // 성공 응답
    return new Response(
      JSON.stringify({
        success: true,
        message: '인증 코드가 성공적으로 발송되었습니다.'
      }),
      {
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('이메일 발송 오류:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || '이메일 발송 중 오류가 발생했습니다.'
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}); 