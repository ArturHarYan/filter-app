import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductListItem } from '../ProductListItem';

describe('ProductListItem', () => {
  const mockProduct = {
    name: 'Wireless Headphones',
    category: 'Electronics',
    brand: 'Brand A',
    price: 99.99,
    rating: 3.4,
  };

  it('should render product information correctly', () => {
    render(<ProductListItem {...mockProduct} />);

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Category: Electronics')).toBeInTheDocument();
    expect(screen.getByText('Brand: Brand A')).toBeInTheDocument();
    expect(screen.getByText('Rating: 3.4 ⭐')).toBeInTheDocument();
  });

  it('should render with different product data', () => {
    const differentProduct = {
      name: 'Running Shoes',
      category: 'Footwear',
      brand: 'Brand C',
      price: 59.99,
      rating: 4.2,
    };

    render(<ProductListItem {...differentProduct} />);

    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
    expect(screen.getByText('$59.99')).toBeInTheDocument();
    expect(screen.getByText('Category: Footwear')).toBeInTheDocument();
    expect(screen.getByText('Brand: Brand C')).toBeInTheDocument();
    expect(screen.getByText('Rating: 4.2 ⭐')).toBeInTheDocument();
  });

  it('should handle products with high ratings', () => {
    const highRatingProduct = {
      name: 'Smartphone',
      category: 'Electronics',
      brand: 'Brand D',
      price: 499.99,
      rating: 4.8,
    };

    render(<ProductListItem {...highRatingProduct} />);

    expect(screen.getByText('Rating: 4.8 ⭐')).toBeInTheDocument();
  });

  it('should handle products with low ratings', () => {
    const lowRatingProduct = {
      name: 'Basic Item',
      category: 'Clothing',
      brand: 'Brand E',
      price: 19.99,
      rating: 1.2,
    };

    render(<ProductListItem {...lowRatingProduct} />);

    expect(screen.getByText('Rating: 1.2 ⭐')).toBeInTheDocument();
  });
});
