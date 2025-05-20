// app/api/saved-properties/[id]/route.js

import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';
import { auth } from '@clerk/nextjs';

export async function POST(request, { params }) {
  const { id } = params;
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if property exists
  const { data: property, error: propertyError } = await supabase
    .from(Tables.PROPERTIES)
    .select('id')
    .eq('id', id)
    .single();
  
  if (propertyError || !property) {
    return Response.json({ error: 'Property not found' }, { status: 404 });
  }
  
  // Add to saved properties
  const { error } = await supabase
    .from(Tables.SAVED_PROPERTIES)
    .insert({
      property_id: id,
      user_id: userId
    });
  
  if (error && error.code !== '23505') { // Ignore unique constraint violations
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json({ success: true });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Remove from saved properties
  const { error } = await supabase
    .from(Tables.SAVED_PROPERTIES)
    .delete()
    .eq('property_id', id)
    .eq('user_id', userId);
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json({ success: true });
}