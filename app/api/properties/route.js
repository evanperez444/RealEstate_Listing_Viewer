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
  
  if (searchParams.has('minBeds') && searchParams.get('minBeds') !== 'any') {
    query = query.gte('bedrooms', parseInt(searchParams.get('minBeds')));
  }
  
  if (searchParams.has('minBaths') && searchParams.get('minBaths') !== 'any') {
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
    
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'price', 'address', 'city', 'state', 
      'zipCode', 'bedrooms', 'bathrooms', 'squareFeet', 'propertyType', 
      'listingType', 'imageUrl'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json({ error: `${field} is required` }, { status: 400 });
      }
    }
    
    // Convert numeric strings to numbers
    const price = parseFloat(body.price);
    const bedrooms = parseInt(body.bedrooms);
    const bathrooms = parseInt(body.bathrooms);
    const squareFeet = parseInt(body.squareFeet);
    const yearBuilt = body.yearBuilt ? parseInt(body.yearBuilt) : null;
    const lat = parseFloat(body.lat);
    const lng = parseFloat(body.lng);
    
    // Validate numeric values
    if (isNaN(price) || price <= 0) {
      return Response.json({ error: 'Price must be a positive number' }, { status: 400 });
    }
    
    if (isNaN(bedrooms) || bedrooms <= 0) {
      return Response.json({ error: 'Bedrooms must be a positive number' }, { status: 400 });
    }
    
    if (isNaN(bathrooms) || bathrooms <= 0) {
      return Response.json({ error: 'Bathrooms must be a positive number' }, { status: 400 });
    }
    
    if (isNaN(squareFeet) || squareFeet <= 0) {
      return Response.json({ error: 'Square feet must be a positive number' }, { status: 400 });
    }
    
    if (body.yearBuilt && (isNaN(yearBuilt) || yearBuilt <= 0)) {
      return Response.json({ error: 'Year built must be a positive number' }, { status: 400 });
    }
    
    if (isNaN(lat) || isNaN(lng)) {
      return Response.json({ error: 'Invalid coordinates' }, { status: 400 });
    }
    
    const propertyData = {
      title: body.title,
      description: body.description,
      price: price,
      address: body.address,
      city: body.city,
      state: body.state,
      zip_code: body.zipCode,
      lat: lat,
      lng: lng,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      square_feet: squareFeet,
      year_built: yearBuilt,
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
    console.error('Error creating property:', error);
    return Response.json({ error: 'Failed to create property' }, { status: 500 });
  }
}