import { createClient } from '@supabase/supabase-client'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseServiceKey)