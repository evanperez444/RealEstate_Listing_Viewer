// app/api/saved-properties/route.js

import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';
import { auth } from '@clerk/nextjs';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data, error } = await supabase
    .from(Tables.SAVED_PROPERTIES)
    .select(`
      *,
      property:${Tables.PROPERTIES}(*)
    `)
    .eq('user_id', userId);
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json(data.map(item => item.property));
}