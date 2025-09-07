import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

vi.mock('../utils/getMockData', () => ({
  getMockData: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
  },
  Toaster: () => <div data-testid='toaster'>Toaster</div>,
}));

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

describe('App Integration Tests', () => {
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockLocalStorage.getItem.mockReturnValue(null);
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    globalThis.requestIdleCallback = vi.fn((callback) => callback());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the app with title and components', async () => {
    const { getMockData } = await import('../utils/getMockData');
    getMockData.mockResolvedValue(mockProducts);

    render(<App />);

    expect(screen.getByText('Filter App')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Bluetooth Speaker')).toBeInTheDocument();
  });

  it('should show "No products found" when no products match filters', async () => {
    const { getMockData } = await import('../utils/getMockData');
    getMockData.mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('should handle loading state correctly', async () => {
    const { getMockData } = await import('../utils/getMockData');

    getMockData.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<App />);

    const loaderElement = document.querySelector(
      'span[style*="animation: react-spinners-ClipLoader-clip"]'
    );
    expect(loaderElement).toBeInTheDocument();
  });

  it('should handle error state correctly', async () => {
    const { getMockData } = await import('../utils/getMockData');
    const toast = await import('react-hot-toast');

    getMockData.mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(toast.default.error).toHaveBeenCalledWith(
        'Error fetching data Network error'
      );
    });
  });

  it('should load filters from localStorage on mount', () => {
    const savedFilters = {
      brand: 'Brand A',
      category: 'Electronics',
      price: '100',
      rating: '4',
      sortBy: 'price-asc',
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedFilters));

    render(<App />);

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('filters');
  });
});
