import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oeszfegjwaauflelgxse.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);