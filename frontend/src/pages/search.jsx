import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react';
import Product from '../../components/Product'; // adjust path if needed

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query; // ?query=Musivo
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data?.products || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Search Results for "{query}"</h2>
      
      {loading && <p>Loading...</p>}
      {!loading && results.length === 0 && <p>No products found.</p>}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map(product => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
