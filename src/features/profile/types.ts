export type Role = 'YOUTH' | 'SENIOR';

export interface Profile {
  id: string;
  email: string;
  name: string;
  username: string;
  role: Role;
  points: number;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  created_at: string;
  points: number;
} 