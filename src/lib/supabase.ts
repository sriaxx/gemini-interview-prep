
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

// Use environment variables if available, otherwise fallback to hardcoded values
// In production, these should always come from environment variables
const supabaseUrl = "https://aldmwcycjcnxhivgweap.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZG13Y3ljamNueGhpdmd3ZWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTMzOTcsImV4cCI6MjA1OTU4OTM5N30.55a2-SFKUyGTWCi9KSgGqEbrEPWOteTO9nQ6dc65Wc0";

// Check if the credentials are defined
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials are not defined");
  toast.error("API configuration error. Please check console for details.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
