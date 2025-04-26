'use client';

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [address, setAddress] = useState("");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProperty(null);

    const res = await fetch("/api/zillow", {
      method: "POST",
      body: JSON.stringify({ address }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setProperty(data.data || null);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to RealEstate Listing Viewer
        </h1>
        <Button className="px-4 py-2 rounded">Get Started</Button>
      </div>

      <form onSubmit={fetchData} className="w-full max-w-md space-y-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter property address"
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <Button type="submit" className="w-full">
          Search Property
        </Button>
      </form>

      {loading && <p>Loading...</p>}

      {property && (
        <div className="bg-white shadow-md rounded p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2">Property Details</h2>
          <p><strong>Address:</strong> {property.address?.streetAddress}</p>
          <p><strong>City:</strong> {property.address?.city}</p>
          <p><strong>State:</strong> {property.address?.state}</p>
          <p><strong>Price:</strong> ${property.price}</p>
          <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
          <p><strong>Year Built:</strong> {property.yearBuilt}</p>
        </div>
      )}
    </div>
  );
}


