// app/api/properties/[id]/route.js

import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';
import { auth } from '@clerk/nextjs';

export async function GET(request, { params }) {
  const { id } = params;
  
  const { data, error } = await supabase
    .from(Tables.PROPERTIES)
    .select(`
      *,
      ratings:${Tables.RATINGS}(rating)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    return Response.json({ error: 'Property not found' }, { status: 404 });
  }
  
  // Calculate average rating
  let avgRating = 0;
  if (data.ratings && data.ratings.length > 0) {
    avgRating = data.ratings.reduce((sum, item) => sum + item.rating, 0) / data.ratings.length;
  }
  
  const property = {
    ...data,
    avgRating,
    ratingCount: data.ratings?.length || 0
  };
  
  return Response.json(property);
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  
  // Check if user owns the property
  const { data: property, error: propertyError } = await supabase
    .from(Tables.PROPERTIES)
    .select('user_id')
    .eq('id', id)
    .single();
  
  if (propertyError || !property) {
    return Response.json({ error: 'Property not found' }, { status: 404 });
  }
  
  if (property.user_id !== userId) {
    return Response.json({ error: 'Not authorized to update this property' }, { status: 403 });
  }
  
  // Update property
  const { data, error } = await supabase
    .from(Tables.PROPERTIES)
    .update(body)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json(data);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user owns the property
  const { data: property, error: propertyError } = await supabase
    .from(Tables.PROPERTIES)
    .select('user_id')
    .eq('id', id)
    .single();
  
  if (propertyError || !property) {
    return Response.json({ error: 'Property not found' }, { status: 404 });
  }
  
  if (property.user_id !== userId) {
    return Response.json({ error: 'Not authorized to delete this property' }, { status: 403 });
  }
  
  // Delete property
  const { error } = await supabase
    .from(Tables.PROPERTIES)
    .delete()
    .eq('id', id);
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json({ message: 'Property deleted successfully' });
}