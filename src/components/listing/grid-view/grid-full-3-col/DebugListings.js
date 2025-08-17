"use client";

import { useListings } from "@/lib/useApi";

const DebugListings = () => {
  const { data: listings = [], isLoading, error } = useListings();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="col-12">
      <h3>Debug: Raw API Response</h3>
      <pre>{JSON.stringify(listings, null, 2)}</pre>
      <p>Total listings: {listings.length}</p>
    </div>
  );
};

export default DebugListings; 