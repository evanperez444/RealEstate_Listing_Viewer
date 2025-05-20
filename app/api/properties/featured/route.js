// app/api/properties/featured/route.js

import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';

export async function GET() {
  const { data, error } = await supabase
    .from(Tables.PROPERTIES)
    .select('*')
    .eq('featured', true)
    .limit(6);
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json(data);
}