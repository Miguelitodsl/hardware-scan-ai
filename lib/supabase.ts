import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Essa é a função que a Vercel disse que estava faltando!
export async function salvarScan(dados: any) {
  const { data, error } = await supabase
    .from('scans')
    .insert([dados])
    .select()

  if (error) throw error
  return data[0]
}