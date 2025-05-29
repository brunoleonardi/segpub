import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oeszfegjwaauflelgxse.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc3pmZWdqd2FhdWZsZWxneHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzcwNjIsImV4cCI6MjA2NDA1MzA2Mn0.8QCsKap4r7jQ6bWt1b8hhTyjt3qn4bdyO5rxli_iiXE';

export const supabase = createClient(supabaseUrl, supabaseKey);