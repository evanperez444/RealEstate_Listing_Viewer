// app/api/properties/[id]/user-rating/route.js

import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';
import { auth } from '@clerk/nextjs';

export async function GET(request, { params }) {
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
    
    // Get user's rating for this property
    const { data, error } = await supabase
      .from(Tables.RATINGS)
      .select('rating')
      .eq('property_id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If no rating found, return empty (not an error)
      if (error.code === 'PGRST116') {
        return Response.json({ rating: 0 });
      }
      
      console.error('Error fetching user rating:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json(data);
  } catch (error) {
    console.error('Unexpected error fetching user rating:', error);
    return Response.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}