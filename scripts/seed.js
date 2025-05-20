// scripts/seed.js
/**
 * Supabase Database Seed Script
 * 
 * This script populates your Supabase database with sample properties, users,
 * and related data for testing your real estate application.
 * 
 * Usage:
 * 1. Make sure you have set up environment variables in .env.local
 * 2. Run: node scripts/seed.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Table names from schema
const TABLES = {
  PROPERTIES: 'properties',
  APPOINTMENTS: 'appointments',
  SAVED_PROPERTIES: 'user_saved_properties',
  AGENTS: 'agents',
  RATINGS: 'property_ratings'
};

// Sample property types
const PROPERTY_TYPES = ['House', 'Apartment', 'Condo', 'Townhouse'];

// Sample listing types
const LISTING_TYPES = ['buy', 'rent'];

// Sample statuses
const STATUSES = ['available', 'pending', 'sold', 'rented'];

// Sample cities with coordinates roughly in their areas
const CITIES = [
  { name: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740 },
  { name: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652 },
  { name: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936 },
  { name: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611 },
  { name: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970 },
  { name: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194 }
];

// Sample property images from Unsplash (free to use)
const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop'
];

// Sample property descriptions
const PROPERTY_DESCRIPTIONS = [
  'This beautiful home features modern amenities, an open floor plan, and plenty of natural light. The spacious kitchen includes stainless steel appliances and granite countertops. The backyard is perfect for entertaining with a covered patio and mature landscaping.',
  'Charming property in a highly sought-after neighborhood. This home offers a blend of character and modern updates throughout. The large living room features a fireplace and hardwood floors. The updated kitchen includes new appliances and quartz countertops.',
  'Stunning contemporary home with high-end finishes and attention to detail. The gourmet kitchen features custom cabinetry, premium appliances, and a large island. The primary suite includes a spa-like bathroom and walk-in closet.',
  'Spacious family home in an excellent school district. This property offers plenty of room for everyone with large bedrooms and multiple living spaces. The backyard includes a deck, play area, and mature trees for privacy.',
  'Elegant and sophisticated property with timeless design. The formal dining room is perfect for entertaining, while the cozy family room offers a more casual space. The primary bedroom is a true retreat with a sitting area and luxury bathroom.'
];

// Sample property titles
const generatePropertyTitle = (propertyType, bedrooms, city) => {
  const adjectives = ['Beautiful', 'Charming', 'Stunning', 'Luxurious', 'Modern', 'Spacious', 'Elegant', 'Cozy'];
  const features = ['Renovated', 'Updated', 'Designer', 'Custom', 'Open-Concept'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const feature = features[Math.floor(Math.random() * features.length)];
  
  return `${adjective} ${bedrooms}-Bedroom ${feature} ${propertyType} in ${city}`;
};

// Generate a random number between min and max (inclusive)
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random price based on property type and listing type
const generatePrice = (propertyType, listingType, squareFeet) => {
  let basePrice;
  
  // Base price per square foot depending on property type
  if (propertyType === 'House') {
    basePrice = randomInt(200, 400);
  } else if (propertyType === 'Condo') {
    basePrice = randomInt(250, 450);
  } else if (propertyType === 'Townhouse') {
    basePrice = randomInt(180, 350);
  } else {
    basePrice = randomInt(150, 300);
  }
  
  // Calculate price based on square footage
  let price = basePrice * squareFeet;
  
  // Adjust for listing type (rent prices are monthly)
  if (listingType === 'rent') {
    // Convert to a monthly rent (roughly 0.5-0.8% of purchase price)
    price = Math.round(price * (randomInt(5, 8) / 1000));
    // Ensure reasonable rent range
    price = Math.max(1000, Math.min(price, 10000));
  } else {
    // Ensure reasonable purchase price range
    price = Math.max(100000, Math.min(price, 2500000));
  }
  
  // Round to nearest thousand for buy, nearest hundred for rent
  return listingType === 'buy' 
    ? Math.round(price / 1000) * 1000 
    : Math.round(price / 100) * 100;
};

// Generate a random property
const generateProperty = (userId, index) => {
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const propertyType = PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)];
  const listingType = LISTING_TYPES[Math.floor(Math.random() * LISTING_TYPES.length)];
  const bedrooms = randomInt(1, 5);
  const bathrooms = randomInt(1, bedrooms + 1);
  const squareFeet = randomInt(800, 3500);
  const yearBuilt = randomInt(1950, 2022);
  const imageUrl = PROPERTY_IMAGES[Math.floor(Math.random() * PROPERTY_IMAGES.length)];
  const description = PROPERTY_DESCRIPTIONS[Math.floor(Math.random() * PROPERTY_DESCRIPTIONS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  
  // Add slight randomization to coordinates to spread properties around the city
  const latOffset = (Math.random() - 0.5) * 0.05;
  const lngOffset = (Math.random() - 0.5) * 0.05;
  
  return {
    title: generatePropertyTitle(propertyType, bedrooms, city.name),
    description,
    price: generatePrice(propertyType, listingType, squareFeet),
    address: `${randomInt(100, 9999)} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm'][Math.floor(Math.random() * 6)]} ${['St', 'Ave', 'Blvd', 'Dr', 'Ln'][Math.floor(Math.random() * 5)]}`,
    city: city.name,
    state: city.state,
    zip_code: `${randomInt(10000, 99999)}`,
    lat: city.lat + latOffset,
    lng: city.lng + lngOffset,
    bedrooms,
    bathrooms,
    square_feet: squareFeet,
    year_built: yearBuilt,
    property_type: propertyType,
    listing_type: listingType,
    image_url: imageUrl,
    user_id: userId,
    featured: index % 10 === 0, // Make every 10th property featured
    status,
    created_at: new Date(Date.now() - randomInt(0, 90) * 24 * 60 * 60 * 1000).toISOString() // Random date in last 90 days
  };
};

// Generate sample agents
const generateAgents = () => {
  return [
    {
      name: 'John Smith',
      specialization: 'Luxury Homes',
      rating: 4.8,
      properties_sold: 142,
      image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop'
    },
    {
      name: 'Sarah Johnson',
      specialization: 'First-Time Buyers',
      rating: 4.9,
      properties_sold: 98,
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop'
    },
    {
      name: 'Michael Chen',
      specialization: 'Commercial Properties',
      rating: 4.7,
      properties_sold: 203,
      image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop'
    },
    {
      name: 'Aisha Patel',
      specialization: 'Urban Apartments',
      rating: 4.6,
      properties_sold: 87,
      image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop'
    },
    {
      name: 'Robert Williams',
      specialization: 'Suburban Homes',
      rating: 4.5,
      properties_sold: 176,
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop'
    }
  ];
};

// Main seed function
async function seedDatabase() {
  console.log('Starting database seed process...');
  
  try {
    // First get auth user (needed for user_id in properties)
    // For testing, we need real user IDs from Clerk that we'll use
    // Ask the user to provide test user IDs
    const testUserIds = [
      process.env.TEST_USER_ID_1 || 'user_123456789',
      process.env.TEST_USER_ID_2 || 'user_987654321'
    ];
    
    console.log(`Using test user IDs: ${testUserIds.join(', ')}`);
    
    // Clear existing data to avoid duplicates
    console.log('Clearing existing data...');
    
    // Delete in proper order to respect foreign key constraints
    await supabase.from(TABLES.APPOINTMENTS).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from(TABLES.SAVED_PROPERTIES).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from(TABLES.RATINGS).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from(TABLES.PROPERTIES).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from(TABLES.AGENTS).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Insert agents
    console.log('Inserting agents...');
    const agents = generateAgents();
    const { error: agentsError } = await supabase.from(TABLES.AGENTS).insert(agents);
    
    if (agentsError) {
      console.error('Error inserting agents:', agentsError);
      return;
    }
    
    // Insert properties for each test user
    console.log('Inserting properties...');
    const allProperties = [];
    
    // Generate 15 properties for each test user
    for (let i = 0; i < testUserIds.length; i++) {
      const userId = testUserIds[i];
      
      for (let j = 0; j < 15; j++) {
        allProperties.push(generateProperty(userId, j));
      }
    }
    
    const { data: properties, error: propertiesError } = await supabase.from(TABLES.PROPERTIES).insert(allProperties).select();
    
    if (propertiesError) {
      console.error('Error inserting properties:', propertiesError);
      return;
    }
    
    console.log(`Successfully inserted ${properties.length} properties.`);
    
    // Insert some ratings for properties
    console.log('Inserting property ratings...');
    const ratings = [];
    
    for (const property of properties) {
      // Determine if this property gets ratings (70% chance)
      if (Math.random() < 0.7) {
        // Number of ratings for this property (1-5)
        const numRatings = randomInt(1, 5);
        
        for (let i = 0; i < numRatings; i++) {
          // Alternate between test users for ratings
          const ratingUserId = testUserIds[i % testUserIds.length];
          
          // Only add rating if user didn't create this property (avoid self-rating)
          if (ratingUserId !== property.user_id) {
            ratings.push({
              property_id: property.id,
              user_id: ratingUserId,
              rating: randomInt(3, 5), // Ratings between 3-5 stars
              created_at: new Date(Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000).toISOString() // Random date in last 60 days
            });
          }
        }
      }
    }
    
    if (ratings.length > 0) {
      const { error: ratingsError } = await supabase.from(TABLES.RATINGS).insert(ratings);
      
      if (ratingsError) {
        console.error('Error inserting ratings:', ratingsError);
      } else {
        console.log(`Successfully inserted ${ratings.length} property ratings.`);
      }
    }
    
    // Insert some saved properties
    console.log('Inserting saved properties...');
    const savedProperties = [];
    
    for (const property of properties) {
      // 30% chance a property is saved
      if (Math.random() < 0.3) {
        // Find a user who didn't create this property
        const savedByUserId = testUserIds.find(id => id !== property.user_id);
        
        if (savedByUserId) {
          savedProperties.push({
            property_id: property.id,
            user_id: savedByUserId,
            created_at: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000).toISOString() // Random date in last 30 days
          });
        }
      }
    }
    
    if (savedProperties.length > 0) {
      const { error: savedError } = await supabase.from(TABLES.SAVED_PROPERTIES).insert(savedProperties);
      
      if (savedError) {
        console.error('Error inserting saved properties:', savedError);
      } else {
        console.log(`Successfully inserted ${savedProperties.length} saved properties.`);
      }
    }
    
    // Insert some appointments
    console.log('Inserting appointments...');
    const appointments = [];
    const appointmentStatuses = ['pending', 'confirmed', 'cancelled'];
    
    for (const property of properties) {
      // 20% chance a property has an appointment
      if (Math.random() < 0.2) {
        // Find a user who didn't create this property
        const appointmentUserId = testUserIds.find(id => id !== property.user_id);
        
        if (appointmentUserId) {
          // Generate a future date for the appointment (1-14 days in the future)
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + randomInt(1, 14));
          
          // Set a random time between 9am and 5pm
          futureDate.setHours(randomInt(9, 17), [0, 30][Math.floor(Math.random() * 2)], 0, 0);
          
          appointments.push({
            property_id: property.id,
            user_id: appointmentUserId,
            date: futureDate.toISOString(),
            message: "I'm interested in viewing this property. Please let me know if this time works for you.",
            status: appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)],
            created_at: new Date(Date.now() - randomInt(0, 7) * 24 * 60 * 60 * 1000).toISOString() // Random date in last 7 days
          });
        }
      }
    }
    
    if (appointments.length > 0) {
      const { error: appointmentsError } = await supabase.from(TABLES.APPOINTMENTS).insert(appointments);
      
      if (appointmentsError) {
        console.error('Error inserting appointments:', appointmentsError);
      } else {
        console.log(`Successfully inserted ${appointments.length} appointments.`);
      }
    }
    
    console.log('Database seed completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase();