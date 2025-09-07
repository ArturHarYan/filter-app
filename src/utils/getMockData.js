import { mockData } from '../mock-data';

export const getMockData = async (filters) => {
  let products = [...mockData];
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (filters.brand) {
    products = products.filter((product) =>
      product.brand.toLowerCase().includes(filters.brand.toLowerCase())
    );
  }

  if (filters.category) {
    products = products.filter(
      (item) => item.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  if (filters.price) {
    products = products.filter((item) => item.price <= Number(filters.price));
  }

  if (filters.rating) {
    products = products.filter((item) => {
      return item.rating <= Number(filters.rating);
    });
  }

  if (filters.sort) {
    switch (filters.sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating-asc':
        products.sort((a, b) => a.rating - b.rating);
        break;
      case 'rating-desc':
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
  }

  return products;
};
