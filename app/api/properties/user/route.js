// app/api/properties/user/route.js
import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';
import { auth } from '@clerk/nextjs';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data, error } = await supabase
    .from(Tables.PROPERTIES)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json(data);
}