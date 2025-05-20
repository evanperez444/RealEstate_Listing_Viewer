// app/api/properties/route.js

import { supabase } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/schema';
import { auth } from '@clerk/nextjs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  let query = supabase.from(Tables.PROPERTIES).select('*');
  
  // Apply filters
  if (searchParams.has('city')) {
    query = query.ilike('city', `%${searchParams.get('city')}%`);
  }
  
  if (searchParams.has('minPrice')) {
    query = query.gte('price', parseFloat(searchParams.get('minPrice')));
  }
  
  if (searchParams.has('maxPrice')) {
    query = query.lte('price', parseFloat(searchParams.get('maxPrice')));
  }
  
  if (searchParams.has('minBeds')) {
    query = query.gte('bedrooms', parseInt(searchParams.get('minBeds')));
  }
  
  if (searchParams.has('minBaths')) {
    query = query.gte('bathrooms', parseInt(searchParams.get('minBaths')));
  }
  
  if (searchParams.has('propertyType') && searchParams.get('propertyType') !== 'any') {
    query = query.eq('property_type', searchParams.get('propertyType'));
  }
  
  if (searchParams.has('listingType')) {
    query = query.eq('listing_type', searchParams.get('listingType'));
  }
  
  if (searchParams.has('minSqft')) {
    query = query.gte('square_feet', parseInt(searchParams.get('minSqft')));
  }
  
  if (searchParams.has('maxSqft')) {
    query = query.lte('square_feet', parseInt(searchParams.get('maxSqft')));
  }
  
  if (searchParams.has('minYear')) {
    query = query.gte('year_built', parseInt(searchParams.get('minYear')));
  }
  
  if (searchParams.has('maxYear')) {
    query = query.lte('year_built', parseInt(searchParams.get('maxYear')));
  }
  
  const { data, error } = await query;
  
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
  
  try {
    const body = await request.json();
    
    const propertyData = {
      title: body.title,
      description: body.description,
      price: parseFloat(body.price),
      address: body.address,
      city: body.city,
      state: body.state,
      zip_code: body.zipCode,
      lat: parseFloat(body.lat),
      lng: parseFloat(body.lng),
      bedrooms: parseInt(body.bedrooms),
      bathrooms: parseInt(body.bathrooms),
      square_feet: parseInt(body.squareFeet),
      year_built: body.yearBuilt ? parseInt(body.yearBuilt) : null,
      property_type: body.propertyType,
      listing_type: body.listingType,
      image_url: body.imageUrl,
      user_id: userId,
      featured: false,
      status: 'available'
    };
    
    const { data, error } = await supabase
      .from(Tables.PROPERTIES)
      .insert(propertyData)
      .select()
      .single();
    
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json(data, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create property' }, { status: 500 });
  }
}