import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { createUserProfile, getProfile } from './profileService';

export const handleUserSession = async (user: User) => {
  try {
    if (!user) return { showUsernameDialog: false };
    
    const profile = await getProfile(user.id);
    
    // If profile exists, no need to create one
    if (profile) {
      return { showUsernameDialog: false };
    }
    
    // Only create profile for new Google users
    if (user.app_metadata.provider === 'google') {
      await createUserProfile({
        id: user.id,
        email: user.email || '',
        username: user.email?.split('@')[0] || 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { showUsernameDialog: false };
    }
    
    // For non-Google users without a profile, show username dialog
    return { showUsernameDialog: true };
  } catch (error) {
    console.error('Error handling user session:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    }
  });
  
  if (error) throw error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};