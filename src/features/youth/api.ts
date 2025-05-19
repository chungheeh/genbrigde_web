import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Question {
  id: string
  content: string
  createdAt: string
  status: 'pending' | 'answered' | 'completed'
  title?: string
  user_id: string
}

export interface Answer {
  id: string
  questionId: string
  content: string
  createdAt: string
}

export async function fetchPendingQuestions(): Promise<Question[]> {
  try {
    console.log('Fetching pending questions...');
    
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('status', 'pending')
      .eq('is_ai_question', false) // AI 질문 제외
      .order('created_at', { ascending: false })
      .limit(50); // 최대 50개의 질문만 가져오도록 제한

    if (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }

    console.log('Fetched questions:', data);

    const mappedQuestions = (data || []).map(question => ({
      id: question.id,
      content: question.content,
      createdAt: question.created_at,
      status: question.status,
      title: question.title,
      user_id: question.user_id
    }));

    console.log('Mapped questions:', mappedQuestions);
    return mappedQuestions;
  } catch (error) {
    console.error('Unexpected error in fetchPendingQuestions:', error);
    throw new Error('질문 목록을 불러오는데 실패했습니다.');
  }
}

export async function submitAnswer(questionId: string, content: string): Promise<void> {
  const supabase = createClientComponentClient();

  try {
    // 사용자 인증 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw new Error('사용자 인증에 실패했습니다.');
    }

    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 디버그: 사용자 정보 로깅
    console.log('=== 디버그 정보 ===');
    console.log('User ID:', user.id);
    console.log('Question ID:', questionId);

    // 사용자 프로필 확인 (디버그용)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, user_type')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile check error:', profileError);
    } else {
      console.log('User Profile:', profile);
    }

    // 트랜잭션 실행
    const { data, error: transactionError } = await supabase.rpc('submit_answer', {
      p_question_id: questionId,
      p_user_id: user.id,
      p_content: content.trim()
    });

    if (transactionError) {
      console.error('Transaction error:', transactionError);
      console.error('Error details:', transactionError.details);
      
      // 특정 오류 코드에 따른 처리
      switch (transactionError.code) {
        case 'AUTH001':
          throw new Error('사용자 프로필을 찾을 수 없습니다.');
        case 'AUTH002':
          throw new Error(transactionError.message || '청년 사용자만 답변할 수 있습니다.');
        case 'QUEST001':
          throw new Error('질문이 존재하지 않거나 이미 답변이 완료되었습니다.');
        case '23503':
          throw new Error('질문 또는 사용자 정보가 올바르지 않습니다.');
        case '42501':
          throw new Error('답변을 등록할 권한이 없습니다.');
        default:
          throw new Error(`답변 등록에 실패했습니다: ${transactionError.message}`);
      }
    }

    if (!data?.success) {
      console.error('Transaction failed without error:', data);
      throw new Error('답변 등록에 실패했습니다.');
    }

    console.log('답변이 성공적으로 등록되었습니다:', data);
    console.log('=== 디버그 정보 끝 ===');
  } catch (error) {
    console.error('Error in submitAnswer:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error instanceof Error ? error : new Error('답변 등록 중 오류가 발생했습니다.');
  }
} 