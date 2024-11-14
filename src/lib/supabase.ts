import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://deybwfrintyvmyeyabpd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRleWJ3ZnJpbnR5dm15ZXlhYnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMzI0ODcsImV4cCI6MjA0NjkwODQ4N30.4C39fiqp729UUn72seN5uNYD3tLpdlXiFimkcrmd644';
const hCaptchaSiteKey = 'c3dc4726-3cee-4d4c-a820-6ca4047845d8';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables. You can find these values in your Supabase project settings.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { hCaptchaSiteKey };