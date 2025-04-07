
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase environment variables are not defined");
  toast.error("API configuration error. Please check console for details.");
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default supabase;
