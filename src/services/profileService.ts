import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export const createUserProfile = async (user: UserProfile) => {
  const { error } = await supabase
    .from('profiles')
    .insert([{
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: user.updated_at || new Date().toISOString(),
    }]);
  
  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
  
  return { username: user.username };
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profile:', error);
    throw error;
  }
  
  return data;
};