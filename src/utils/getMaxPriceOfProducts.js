export const getMaxPriceOfProducts = (products) => {
  if (!products || products.length === 0) return 0;
  return Math.max(...products.map((product) => product.price));
};
