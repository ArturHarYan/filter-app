import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductsList } from '../ProductsList';

vi.mock('../../ui/loader/Loader', () => ({
  Loader: () => <div data-testid='loader'>Loading...</div>,
}));

vi.mock('../../product-list-item/ProductListItem', () => ({
  ProductListItem: ({ name, price, category, brand, rating }) => (
    <div data-testid='product-item'>
      <div>{name}</div>
      <div>${price}</div>
      <div>Category: {category}</div>
      <div>Brand: {brand}</div>
      <div>Rating: {rating} ⭐</div>
    </div>
  ),
}));

describe('ProductsList', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      brand: 'Brand A',
      price: 99.99,
      rating: 3.4,
    },
    {
      id: 2,
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      brand: 'Brand B',
      price: 49.99,
      rating: 4.0,
    },
    {
      id: 3,
      name: 'Running Shoes',
      category: 'Footwear',
      brand: 'Brand C',
      price: 59.99,
      rating: 4.2,
    },
    {
      id: 4,
      name: 'Smartphone',
      category: 'Electronics',
      brand: 'Brand D',
      price: 499.99,
      rating: 4.8,
    },
    {
      id: 5,
      name: 'Leather Jacket',
      category: 'Clothing',
      brand: 'Brand E',
      price: 199.99,
      rating: 4.7,
    },
    {
      id: 6,
      name: 'Tablet',
      category: 'Electronics',
      brand: 'Brand F',
      price: 299.99,
      rating: 4.5,
    },
  ];

  it('should render loading state when isLoading is true', () => {
    render(
      <ProductsList
        products={[]}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render "No products found" when products array is empty and not loading', () => {
    render(
      <ProductsList
        products={[]}
        isLoading={false}
      />
    );

    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('should render first 5 products by default', () => {
    render(
      <ProductsList
        products={mockProducts}
        isLoading={false}
      />
    );

    const productItems = screen.getAllByTestId('product-item');
    expect(productItems).toHaveLength(5);

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Bluetooth Speaker')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
    expect(screen.getByText('Smartphone')).toBeInTheDocument();
    expect(screen.getByText('Leather Jacket')).toBeInTheDocument();
    expect(screen.queryByText('Tablet')).not.toBeInTheDocument();
  });

  it('should show pagination controls when there are more than 5 products', () => {
    render(
      <ProductsList
        products={mockProducts}
        isLoading={false}
      />
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should show pagination controls but disable Next button when there are 5 or fewer products', () => {
    const fewProducts = mockProducts.slice(0, 5);
    render(
      <ProductsList
        products={fewProducts}
        isLoading={false}
      />
    );

    const previousButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');

    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('should disable Previous button on first page', () => {
    render(
      <ProductsList
        products={mockProducts}
        isLoading={false}
      />
    );

    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('should enable Next button when there are more products', () => {
    render(
      <ProductsList
        products={mockProducts}
        isLoading={false}
      />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
  });

  it('should navigate to next page when Next button is clicked', () => {
    render(
      <ProductsList
        products={mockProducts}
        isLoading={false}
      />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(screen.getByText('Tablet')).toBeInTheDocument();
    expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument();
  });

  it('should navigate to previous page when Previous button is clicked', () => {
    render(
      <ProductsList
        products={mockProducts}
        isLoading={false}
      />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.queryByText('Tablet')).not.toBeInTheDocument();
  });

  it('should disable Next button on last page', () => {
    render(
      <ProductsList
        products={mockProducts}
        isLoading={false}
      />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();
  });

  it('should reset to first page when products change', () => {
    const { rerender } = render(
      <ProductsList
        products={mockProducts}
        isLoading={false}
      />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(screen.getByText('Tablet')).toBeInTheDocument();

    const newProducts = mockProducts.slice(0, 3);
    rerender(
      <ProductsList
        products={newProducts}
        isLoading={false}
      />
    );

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.queryByText('Tablet')).not.toBeInTheDocument();
  });
});
