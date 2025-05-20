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
  
  try {
    // Check if property exists
    const { data: property, error: propertyError } = await supabase
      .from(Tables.PROPERTIES)
      .select('id')
      .eq('id', id)
      .single();
    
    if (propertyError || !property) {
      return Response.json({ error: 'Property not found' }, { status: 404 });
    }
    
    // Check if property is already saved by this user
    const { data: existingSave } = await supabase
      .from(Tables.SAVED_PROPERTIES)
      .select('id')
      .eq('property_id', id)
      .eq('user_id', userId)
      .single();
      
    if (existingSave) {
      // Property is already saved
      return Response.json({ success: true, message: 'Property already saved' });
    }
    
    // Add to saved properties
    const { error } = await supabase
      .from(Tables.SAVED_PROPERTIES)
      .insert({
        property_id: id,
        user_id: userId
      });
    
    if (error) {
      console.error('Error saving property:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({ success: true, message: 'Property saved successfully' });
  } catch (error) {
    console.error('Unexpected error saving property:', error);
    return Response.json({ error: 'Failed to save property' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Remove from saved properties
    const { error } = await supabase
      .from(Tables.SAVED_PROPERTIES)
      .delete()
      .eq('property_id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error removing saved property:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({ success: true, message: 'Property removed from saved list' });
  } catch (error) {
    console.error('Unexpected error removing saved property:', error);
    return Response.json({ error: 'Failed to remove saved property' }, { status: 500 });
  }
}