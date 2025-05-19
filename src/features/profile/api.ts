import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Profile, Activity } from './types';
import { Database } from '@/types/supabase';

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
      // 프로필이 없는 경우 새로 생성
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          name: user.email?.split('@')[0] || '사용자',
          username: user.email?.split('@')[0] || '사용자',
          role: 'YOUTH',
          points: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;
      return newProfile;
    }
    throw error;
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