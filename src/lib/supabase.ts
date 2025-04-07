
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

// Use the new Supabase credentials
const supabaseUrl = "https://jqjmgikxiznnpjqnjfat.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxam1naWt4aXpubnBqcW5qZmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTUzMjcsImV4cCI6MjA1OTU5MTMyN30.JMsEyBH9g_38nPfcmUuR6TeeiDDaQuXd_eeYGAmeyR0";

// Check if the credentials are defined
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials are not defined");
  toast.error("API configuration error. Please check console for details.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
