import { useEffect, useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';

import './App.css';
import { FilterPanel, ProductsList } from './components';
import { getMockData } from './utils';

function App() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(
    () =>
      JSON.parse(localStorage.getItem('filters')) || {
        brand: '',
        price: '',
        rating: '',
        category: '',
        sortBy: '',
      }
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const result = await getMockData({
          brand: filters.brand,
          category: filters.category,
          price: filters.price,
          rating: filters.rating,
          sort: filters.sortBy,
        });
        setProducts(result);
      } catch (error) {
        toast.error(`Error fetching data ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    filters.brand,
    filters.category,
    filters.price,
    filters.rating,
    filters.sortBy,
  ]);

  return (
    <div className='appWrapper'>
      <h1>Filter App</h1>
      <FilterPanel
        isLoading={isLoading}
        filters={filters}
        setFilters={setFilters}
      />
      <ProductsList
        products={products}
        isLoading={isLoading}
      />
      <Toaster />
    </div>
  );
}

export default App;
