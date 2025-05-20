// app/api/properties/[id]/route.js

import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';
import { auth } from '@clerk/nextjs';

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    // Fetch property with its ratings
    const { data, error } = await supabase
      .from(Tables.PROPERTIES)
      .select(`
        *,
        ratings:${Tables.RATINGS}(rating)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching property:', error);
      return Response.json({ error: 'Property not found' }, { status: 404 });
    }
    
    // Calculate average rating
    let avgRating = 0;
    if (data.ratings && data.ratings.length > 0) {
      avgRating = data.ratings.reduce((sum, item) => sum + item.rating, 0) / data.ratings.length;
    }
    
    // Check if the property is saved by the current user
    let isSaved = false;
    const { userId } = auth();
    
    if (userId) {
      const { data: savedData, error: savedError } = await supabase
        .from(Tables.SAVED_PROPERTIES)
        .select('id')
        .eq('property_id', id)
        .eq('user_id', userId)
        .single();
        
      isSaved = !savedError && savedData;
    }
    
    const property = {
      ...data,
      avgRating,
      ratingCount: data.ratings?.length || 0,
      isSaved
    };
    
    return Response.json(property);
  } catch (error) {
    console.error('Unexpected error fetching property:', error);
    return Response.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
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
    
    // Process property updates - convert string values to proper types
    const updates = { ...body };
    
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.bedrooms) updates.bedrooms = parseInt(updates.bedrooms);
    if (updates.bathrooms) updates.bathrooms = parseInt(updates.bathrooms);
    if (updates.square_feet) updates.square_feet = parseInt(updates.square_feet);
    if (updates.year_built) updates.year_built = parseInt(updates.year_built) || null;
    if (updates.lat) updates.lat = parseFloat(updates.lat);
    if (updates.lng) updates.lng = parseFloat(updates.lng);
    
    // Update property
    const { data, error } = await supabase
      .from(Tables.PROPERTIES)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating property:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json(data);
  } catch (error) {
    console.error('Unexpected error updating property:', error);
    return Response.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const { userId } = auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
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
    
    // First delete all related records (appointments, ratings, saved_properties)
    // This prevents foreign key constraint errors
    const deleteRelatedPromises = [
      supabase.from(Tables.APPOINTMENTS).delete().eq('property_id', id),
      supabase.from(Tables.RATINGS).delete().eq('property_id', id),
      supabase.from(Tables.SAVED_PROPERTIES).delete().eq('property_id', id)
    ];
    
    await Promise.all(deleteRelatedPromises);
    
    // Delete property
    const { error } = await supabase
      .from(Tables.PROPERTIES)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting property:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Unexpected error deleting property:', error);
    return Response.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}