// utils/supabase/schema.js

export const Tables = {
  PROPERTIES: 'properties',
  APPOINTMENTS: 'appointments',
  SAVED_PROPERTIES: 'user_saved_properties',
  AGENTS: 'agents',
  RATINGS: 'property_ratings'
};

/*
Create these tables in Supabase:

-- Properties Table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  square_feet INTEGER NOT NULL,
  year_built INTEGER,
  property_type TEXT NOT NULL,
  listing_type TEXT NOT NULL,
  image_url TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property Ratings Table
CREATE TABLE property_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(property_id, user_id)
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Saved Properties Table
CREATE TABLE user_saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(property_id, user_id)
);

-- Agents Table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  rating NUMERIC NOT NULL,
  properties_sold INTEGER NOT NULL,
  image_url TEXT NOT NULL
);
*/