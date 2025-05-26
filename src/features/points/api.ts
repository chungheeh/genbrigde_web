import { createBrowserClient } from "@/lib/supabase/client";
import { Database } from "@/lib/database.types";
import { PointHistory, PointSummary } from "./types";

const supabase = createBrowserClient();

export async function getPointHistory(userId: string): Promise<PointHistory[]> {
  try {
    if (!userId) {
      console.error('유효하지 않은 사용자 ID입니다.');
      return [];
    }

    const { data, error } = await supabase
      .from('point_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching point history:', JSON.stringify(error));
      throw new Error(`포인트 내역을 불러오는데 실패했습니다: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching point history:', error instanceof Error ? error.message : '알 수 없는 오류');
    return [];
  }
}

export async function getPointSummary(userId: string): Promise<PointSummary | null> {
  try {
    if (!userId) {
      console.error('유효하지 않은 사용자 ID입니다.');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching point summary:', JSON.stringify(error));
      throw new Error(`포인트 정보를 불러오는데 실패했습니다: ${error.message}`);
    }

    const earnedData = await supabase
      .from('point_history')
      .select('sum(amount)')
      .eq('user_id', userId)
      .eq('type', 'EARN')
      .single();

    const usedData = await supabase
      .from('point_history')
      .select('sum(amount)')
      .eq('user_id', userId)
      .eq('type', 'USE')
      .single();

    // sum()의 결과가 null이면 0으로 대체
    const totalEarned = earnedData.data?.sum ? Number(earnedData.data.sum) : 0;
    const totalUsed = usedData.data?.sum ? Number(usedData.data.sum) : 0;

    return {
      total_points: data?.points || 0,
      total_earned: totalEarned,
      total_used: totalUsed
    };
  } catch (error) {
    console.error('Error fetching point summary:', error instanceof Error ? error.message : '알 수 없는 오류');
    return null;
  }
}

export async function addPoints(
  userId: string, 
  amount: number, 
  description: string, 
  relatedAnswerId?: string
): Promise<{ success: boolean; message: string; }> {
  try {
    const { data, error } = await supabase.rpc('add_points', {
      p_user_id: userId,
      p_amount: amount,
      p_description: description,
      p_related_answer_id: relatedAnswerId
    });

    if (error) throw error;
    return { success: true, message: '포인트가 추가되었습니다.' };
  } catch (error) {
    console.error('Error adding points:', error);
    return { success: false, message: '포인트 추가에 실패했습니다.' };
  }
}

export async function usePoints(
  userId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; message: string; }> {
  try {
    const { data, error } = await supabase.rpc('use_points', {
      p_user_id: userId,
      p_amount: amount,
      p_description: description
    });

    if (error) throw error;
    return { success: true, message: '포인트가 사용되었습니다.' };
  } catch (error) {
    console.error('Error using points:', error);
    return { success: false, message: '포인트 사용에 실패했습니다.' };
  }
} 