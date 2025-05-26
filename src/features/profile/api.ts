import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Profile, Activity } from './types';
import { Database } from '@/types/supabase';
import { redirect } from 'next/navigation';

export async function fetchProfile(): Promise<Profile> {
  const supabase = createClientComponentClient<Database>();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) throw authError;
  if (!user) throw new Error('인증되지 않은 사용자입니다.');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // 프로필이 없는 경우 역할 선택 페이지로 리디렉션
      console.log('프로필이 없습니다. 역할 선택 페이지로 리디렉션합니다.');
      redirect('/role-selection');
    }
    throw error;
  }

  // 역할이 없는 경우 역할 선택 페이지로 리디렉션
  if (!data.role) {
    console.log('역할이 설정되지 않았습니다. 역할 선택 페이지로 리디렉션합니다.');
    redirect('/role-selection');
  }

  return data;
}

export async function fetchActivities(): Promise<Activity[]> {
  const supabase = createClientComponentClient<Database>();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) throw authError;
  if (!user) throw new Error('인증되지 않은 사용자입니다.');

  // 답변 활동 조회
  const { data: answers, error: answersError } = await supabase
    .from('answers')
    .select(`
      id,
      content,
      created_at,
      questions:question_id (
        id,
        title
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (answersError) throw answersError;

  return (answers || []).map(answer => ({
    id: answer.id,
    type: '답변',
    title: answer.questions?.title || answer.content,
    created_at: answer.created_at,
    points: 100
  }));
}

export async function updateProfile(profile: Partial<Profile>): Promise<Profile> {
  const supabase = createClientComponentClient<Database>();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) throw authError;
  if (!user) throw new Error('인증되지 않은 사용자입니다.');

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profile,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
} 