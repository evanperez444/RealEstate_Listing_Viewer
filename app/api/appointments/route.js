// app/api/appointments/route.js

import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';
import { auth } from '@clerk/nextjs';

export async function GET(request) {
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data, error } = await supabase
    .from(Tables.APPOINTMENTS)
    .select(`
      *,
      property:${Tables.PROPERTIES}(*)
    `)
    .eq('user_id', userId);
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json(data);
}

export async function POST(request) {
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  
  const appointmentData = {
    property_id: body.propertyId,
    user_id: userId,
    date: new Date(body.date).toISOString(),
    message: body.message || '',
    status: 'pending'
  };
  
  const { data, error } = await supabase
    .from(Tables.APPOINTMENTS)
    .insert(appointmentData)
    .select()
    .single();
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json(data, { status: 201 });
}