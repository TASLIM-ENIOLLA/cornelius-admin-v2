import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY_SECRET_ROLE = process.env.SUPABASE_API_KEY_SECRET_ROLE;

export default createClient(SUPABASE_URL as string, SUPABASE_API_KEY_SECRET_ROLE as string);