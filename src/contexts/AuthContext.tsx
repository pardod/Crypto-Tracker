import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { UsernameDialog } from '@/components/auth/UsernameDialog';
import { handleUserSession, signInWithGoogle, signOut } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, captchaToken?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        handleUserSession(session.user)
          .then(({ showUsernameDialog }) => setShowUsernameDialog(showUsernameDialog))
          .catch(error => {
            console.error('Session handling error:', error);
            toast({
              title: "Error",
              description: "Failed to load user profile",
              variant: "destructive",
            });
          });
      }
    });

    // Auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        handleUserSession(session.user)
          .then(({ showUsernameDialog }) => setShowUsernameDialog(showUsernameDialog))
          .catch(error => {
            console.error('Auth state change error:', error);
            toast({
              title: "Error",
              description: "Failed to update user profile",
              variant: "destructive",
            });
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Successfully signed in!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, username: string, captchaToken?: string) => {
    if (!captchaToken) {
      toast({
        title: "Error",
        description: "CAPTCHA verification is required",
        variant: "destructive",
      });
      throw new Error('CAPTCHA verification is required');
    }

    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          captchaToken,
        }
      });

      if (signUpError) throw signUpError;

      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id, 
            username, 
            email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (profileError) throw profileError;
      }

      toast({
        title: "Success",
        description: "Check your email to confirm your account!",
      });
    } catch (error: any) {
      if (!error.message.includes('CAPTCHA')) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
      toast({
        title: "Success",
        description: "Successfully signed out!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Redirecting",
        description: "You will be redirected to Google sign in...",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      signInWithGoogle: handleGoogleSignIn
    }}>
      {children}
      {user && showUsernameDialog && (
        <UsernameDialog
          isOpen={showUsernameDialog}
          onClose={() => setShowUsernameDialog(false)}
          userId={user.id}
        />
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};