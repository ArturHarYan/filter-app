import { useEffect, useRef, useState } from 'react';

import { ListFilter } from 'lucide-react';

import { Range, SearchInput, Select } from '..';
import { useDebounce, useOutsideClick } from '../../hooks';
import { mockData } from '../../mock-data';
import { getMaxPriceOfProducts } from '../../utils';
import styles from './FilterPanel.module.css';

// Calc max price here instead of using useMemo in order to avoid recalculating on every render
const maxPrice = getMaxPriceOfProducts(mockData).toString();

export const FilterPanel = ({ isLoading, filters, setFilters }) => {
  const [brandFilter, setBrandFilter] = useState(filters.brand || '');
  const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
  const [ratingFilter, setRatingFilter] = useState(filters.rating || '');
  const [priceRange, setPriceRange] = useState(filters.price || '');
  const [sortBy, setSortBy] = useState(filters.sortBy || '');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const mobileWrapperRef = useRef(null);

  const debouncedBrand = useDebounce(brandFilter);
  const debouncedPrice = useDebounce(priceRange);

  const toggleVisibility = (e) => {
    e.stopPropagation();
    setIsMobileFiltersOpen((prev) => !prev);
  };

  const closeMobileFilters = () => {
    setIsMobileFiltersOpen(false);
  };

  const handleFilters = (event, filterType) => {
    switch (filterType) {
      case 'brand':
        setBrandFilter(event.target.value);
        break;
      case 'category':
        setCategoryFilter(event.target.value);
        break;
      case 'rating':
        setRatingFilter(event.target.value);
        break;
      case 'priceRange':
        setPriceRange(event.target.value);
        break;
      case 'sortBy':
        setSortBy(event.target.value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        brand: debouncedBrand,
        category: categoryFilter,
        rating: ratingFilter,
        price: debouncedPrice,
        sortBy,
      };
      // iOS does not support requestIdleCallback
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          localStorage.setItem('filters', JSON.stringify(updatedFilters));
        });
      } else {
        // Fallback to setTimeout with minimal delay
        setTimeout(() => {
          localStorage.setItem('filters', JSON.stringify(updatedFilters));
        }, 1);
      }
      return updatedFilters;
    });
  }, [
    debouncedBrand,
    debouncedPrice,
    categoryFilter,
    ratingFilter,
    sortBy,
    setFilters,
  ]);

  useOutsideClick(mobileWrapperRef, closeMobileFilters, isMobileFiltersOpen);

  return (
    <>
      <div className={styles.panel}>
        <SearchInput
          placeholder={'Search by brand'}
          label='Filter by Brand'
          id='brand'
          className={styles.brandFilter}
          value={brandFilter}
          onChange={(event) => handleFilters(event, 'brand')}
          disabled={isLoading}
        />
        <Select
          className={styles.categoryFilter}
          label='Filter by Category'
          id='category'
          value={categoryFilter}
          onChange={(event) => handleFilters(event, 'category')}
          disabled={isLoading}
        >
          <option value=''>All Categories</option>
          <option value='Electronics'>Electronics</option>
          <option value='Footwear'>Footwear</option>
          <option value='Clothing'>Clothing</option>
        </Select>
        <Select
          className={styles.ratingFilter}
          label='Filter by max Rating'
          id='rating'
          value={ratingFilter}
          onChange={(event) => handleFilters(event, 'rating')}
          disabled={isLoading}
        >
          <option value=''>All Ratings</option>
          <option value='1'>1 Star</option>
          <option value='2'>2 Stars</option>
          <option value='3'>3 Stars</option>
          <option value='4'>4 Stars</option>
          <option value='5'>5 Stars</option>
        </Select>
        <Range
          className={styles.priceRangeFilter}
          label='Filter by max Price'
          id='priceRange'
          min='0'
          max={maxPrice}
          step='0.01'
          value={priceRange}
          onChange={(event) => handleFilters(event, 'priceRange')}
          disabled={isLoading}
        />
        <Select
          className={styles.sortFilter}
          label='Sort by'
          id='sortBy'
          value={sortBy}
          onChange={(event) => handleFilters(event, 'sortBy')}
          disabled={isLoading}
        >
          <option value=''>Default</option>
          <option value='price-asc'>Price: Low to High</option>
          <option value='price-desc'>Price: High to Low</option>
          <option value='rating-asc'>Rating: Low to High</option>
          <option value='rating-desc'>Rating: High to Low</option>
        </Select>
      </div>
      {/* mobile/tablet filter UI */}
      <div className={styles.mobilePanel}>
        <ListFilter
          className={styles.filterIcon}
          onClick={toggleVisibility}
        />
        <div
          ref={mobileWrapperRef}
          className={`${styles.mobileControlsWrapper} ${
            isMobileFiltersOpen ? styles.open : ''
          }`}
        >
          <Select
            className={styles.sortFilter}
            label='Sort by'
            id='mbSortBy'
            value={sortBy}
            onChange={(event) => handleFilters(event, 'sortBy')}
            disabled={isLoading}
          >
            <option value=''>Default</option>
            <option value='price-asc'>Price: Low to High</option>
            <option value='price-desc'>Price: High to Low</option>
            <option value='rating-asc'>Rating: Low to High</option>
            <option value='rating-desc'>Rating: High to Low</option>
          </Select>
          <SearchInput
            className={styles.brandFilter}
            placeholder={'Search by brand'}
            label='Filter by Brand'
            id='mbBrand'
            value={brandFilter}
            onChange={(event) => handleFilters(event, 'brand')}
            disabled={isLoading}
          />
          <Select
            className={styles.categoryFilter}
            label='Filter by Category'
            id='mbCategory'
            value={categoryFilter}
            onChange={(event) => handleFilters(event, 'category')}
            disabled={isLoading}
          >
            <option value=''>All Categories</option>
            <option value='Electronics'>Electronics</option>
            <option value='Footwear'>Footwear</option>
            <option value='Clothing'>Clothing</option>
          </Select>
          <Select
            className={styles.ratingFilter}
            label='Filter by max Rating'
            id='mbRating'
            value={ratingFilter}
            onChange={(event) => handleFilters(event, 'rating')}
            disabled={isLoading}
          >
            <option value=''>All Ratings</option>
            <option value='1'>1 Star</option>
            <option value='2'>2 Stars</option>
            <option value='3'>3 Stars</option>
            <option value='4'>4 Stars</option>
            <option value='5'>5 Stars</option>
          </Select>

          <Range
            className={styles.priceRangeFilter}
            label='Filter by max Price'
            id='mbPriceRange'
            min='0'
            max={maxPrice}
            step='0.01'
            value={priceRange}
            onChange={(event) => handleFilters(event, 'priceRange')}
            disabled={isLoading}
          />
        </div>
      </div>
    </>
  );
};
