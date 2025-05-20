// app/api/properties/[id]/rate/route.js

import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';
import { auth } from '@clerk/nextjs';

export async function POST(request, { params }) {
  const { id } = params;
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const rating = parseInt(body.rating);
  
  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return Response.json({ error: 'Invalid rating. Must be between 1 and 5.' }, { status: 400 });
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
  
  // Upsert rating (create or update)
  const { error } = await supabase
    .from(Tables.RATINGS)
    .upsert({
      property_id: id,
      user_id: userId,
      rating
    });
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  // Recalculate average rating
  const { data: ratings, error: ratingsError } = await supabase
    .from(Tables.RATINGS)
    .select('rating')
    .eq('property_id', id);
  
  if (ratingsError) {
    return Response.json({ error: ratingsError.message }, { status: 500 });
  }
  
  const avgRating = ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;
  
  return Response.json({ 
    success: true,
    avgRating,
    ratingCount: ratings.length
  });
}