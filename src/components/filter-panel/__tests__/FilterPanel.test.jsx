import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FilterPanel } from '../FilterPanel';

vi.mock('../../ui/search-input/SearchInput', () => ({
  SearchInput: ({ label, id, value, onChange, disabled, placeholder }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        data-testid={`search-${id}`}
      />
    </div>
  ),
}));

vi.mock('../../ui/select/Select', () => ({
  Select: ({ label, id, value, onChange, disabled, children }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        data-testid={`select-${id}`}
      >
        {children}
      </select>
    </div>
  ),
}));

vi.mock('../../ui/range/Range', () => ({
  Range: ({ label, id, value, onChange, disabled, min, max, step }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type='range'
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        data-testid={`range-${id}`}
      />
      <span>{value}</span>
    </div>
  ),
}));

vi.mock('../../../hooks/useDebounce', () => ({
  useDebounce: (value) => value,
}));

vi.mock('../../../hooks/useOutsideClick', () => ({
  useOutsideClick: () => {},
}));

vi.mock('../../../utils/getMaxPriceOfProducts', () => ({
  getMaxPriceOfProducts: () => 1000,
}));

vi.mock('../../../mock-data', () => ({
  mockData: [],
}));

describe('FilterPanel', () => {
  const mockSetFilters = vi.fn();
  const defaultFilters = {
    brand: '',
    category: '',
    rating: '',
    price: '',
    sortBy: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });

    globalThis.requestIdleCallback = vi.fn((callback) => callback());
  });

  it('should render all filter controls', () => {
    render(
      <FilterPanel
        isLoading={false}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    expect(screen.getAllByText('Filter by Brand')).toHaveLength(2);
    expect(screen.getAllByText('Filter by Category')).toHaveLength(2);
    expect(screen.getAllByText('Filter by max Rating')).toHaveLength(2);
    expect(screen.getAllByText('Filter by max Price')).toHaveLength(2);
    expect(screen.getAllByText('Sort by')).toHaveLength(2);
  });

  it('should render with initial filter values', () => {
    const filtersWithValues = {
      brand: 'Brand A',
      category: 'Electronics',
      rating: '4',
      price: '100',
      sortBy: 'price-asc',
    };

    render(
      <FilterPanel
        isLoading={false}
        filters={filtersWithValues}
        setFilters={mockSetFilters}
      />
    );

    expect(screen.getByTestId('search-brand')).toHaveValue('Brand A');
    expect(screen.getByTestId('select-category')).toHaveValue('Electronics');
    expect(screen.getByTestId('select-rating')).toHaveValue('4');
    expect(screen.getByTestId('range-priceRange')).toHaveValue('100');
    expect(screen.getByTestId('select-sortBy')).toHaveValue('price-asc');
  });

  it('should disable all controls when loading', () => {
    render(
      <FilterPanel
        isLoading={true}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    expect(screen.getByTestId('search-brand')).toBeDisabled();
    expect(screen.getByTestId('select-category')).toBeDisabled();
    expect(screen.getByTestId('select-rating')).toBeDisabled();
    expect(screen.getByTestId('range-priceRange')).toBeDisabled();
    expect(screen.getByTestId('select-sortBy')).toBeDisabled();
  });

  it('should update brand filter when input changes', async () => {
    render(
      <FilterPanel
        isLoading={false}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    const brandInput = screen.getByTestId('search-brand');
    fireEvent.change(brandInput, { target: { value: 'Brand A' } });

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('should update category filter when select changes', async () => {
    render(
      <FilterPanel
        isLoading={false}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    const categorySelect = screen.getByTestId('select-category');
    fireEvent.change(categorySelect, { target: { value: 'Electronics' } });

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('should update rating filter when select changes', async () => {
    render(
      <FilterPanel
        isLoading={false}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    const ratingSelect = screen.getByTestId('select-rating');
    fireEvent.change(ratingSelect, { target: { value: '4' } });

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('should update price filter when range changes', async () => {
    render(
      <FilterPanel
        isLoading={false}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    const priceRange = screen.getByTestId('range-priceRange');
    fireEvent.change(priceRange, { target: { value: '100' } });

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('should update sort filter when select changes', async () => {
    render(
      <FilterPanel
        isLoading={false}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    const sortSelect = screen.getByTestId('select-sortBy');
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('should render category options correctly', () => {
    render(
      <FilterPanel
        isLoading={false}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    const categorySelect = screen.getByTestId('select-category');
    expect(categorySelect).toBeInTheDocument();

    expect(screen.getAllByText('All Categories')).toHaveLength(2);
    expect(screen.getAllByText('Electronics')).toHaveLength(2);
    expect(screen.getAllByText('Footwear')).toHaveLength(2);
    expect(screen.getAllByText('Clothing')).toHaveLength(2);
  });

  it('should render rating options correctly', () => {
    render(
      <FilterPanel
        isLoading={false}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    expect(screen.getAllByText('All Ratings')).toHaveLength(2);
    expect(screen.getAllByText('1 Star')).toHaveLength(2);
    expect(screen.getAllByText('2 Stars')).toHaveLength(2);
    expect(screen.getAllByText('3 Stars')).toHaveLength(2);
    expect(screen.getAllByText('4 Stars')).toHaveLength(2);
    expect(screen.getAllByText('5 Stars')).toHaveLength(2);
  });

  it('should render sort options correctly', () => {
    render(
      <FilterPanel
        isLoading={false}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    expect(screen.getAllByText('Default')).toHaveLength(2);
    expect(screen.getAllByText('Price: Low to High')).toHaveLength(2);
    expect(screen.getAllByText('Price: High to Low')).toHaveLength(2);
    expect(screen.getAllByText('Rating: Low to High')).toHaveLength(2);
    expect(screen.getAllByText('Rating: High to Low')).toHaveLength(2);
  });

  it('should update filters when input changes', async () => {
    render(
      <FilterPanel
        isLoading={false}
        filters={defaultFilters}
        setFilters={mockSetFilters}
      />
    );

    const brandInput = screen.getByTestId('search-brand');
    fireEvent.change(brandInput, { target: { value: 'Brand A' } });

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalled();
    });
  });
});
