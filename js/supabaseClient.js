import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://pmuwtqfokngsjkxxjmtz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdXd0cWZva25nc2preHhqbXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNTg1NDEsImV4cCI6MjA2NTYzNDU0MX0.5g8mEyMnQhfozVWj1Ouaq0ZNv3arUbQaV_jP7YLzBKc'

export const supabase = createClient(supabaseUrl, supabaseKey)