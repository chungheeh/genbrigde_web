export interface PointHistory {
  id: string;
  user_id: string;
  amount: number;
  type: 'EARN' | 'USE';
  description: string;
  created_at: string;
  related_answer_id?: string;
}

export interface PointSummary {
  total_points: number;
  total_earned: number;
  total_used: number;
} 