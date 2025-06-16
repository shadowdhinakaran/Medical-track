
import { createClient } from '@supabase/supabase-js'

const supabaseUrl ='https://svjsbbojvwbozgtnikvl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2anNiYm9qdndib3pndG5pa3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NzM3MjcsImV4cCI6MjA2NTQ0OTcyN30.XFxS2aXsxiwg-CZ6UsxZ6fMSApYg82CTfwZVWWT9TC4'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;
