// app/api/appointments/[id]/route.js
import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';
import { auth } from '@clerk/nextjs';

export async function PATCH(request, { params }) {
  const { id } = params;
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if appointment belongs to the user
  const { data: appointment, error: appointmentError } = await supabase
    .from(Tables.APPOINTMENTS)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  
  if (appointmentError || !appointment) {
    return Response.json({ error: 'Appointment not found' }, { status: 404 });
  }
  
  // Update appointment
  const body = await request.json();
  
  const { data, error } = await supabase
    .from(Tables.APPOINTMENTS)
    .update({ status: body.status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json(data);
}