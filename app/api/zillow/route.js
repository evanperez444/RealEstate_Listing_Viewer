// app/api/zillow/route.js

export async function POST(req) {
  const { address } = await req.json();

  const url = `https://real-time-zillow-data.p.rapidapi.com/property-details-address?address=${encodeURIComponent(address)}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c043faf755msh9e1c4a8934fc363p1bebb0jsn4f779d5c7504',
      'x-rapidapi-host': 'real-time-zillow-data.p.rapidapi.com'
    }
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch property data' }), { status: 500 });
  }
}
