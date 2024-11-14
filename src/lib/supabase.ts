import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://deybwfrintyvmyeyabpd.supabase.co';
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;
const hCaptchaSiteKey = import.meta.env.hCAPTCHA_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables. You can find these values in your Supabase project settings.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { hCaptchaSiteKey };