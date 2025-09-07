import { useEffect, useState } from 'react';

import { Loader, ProductListItem } from '..';
import styles from './ProductsList.module.css';

export const ProductsList = ({ products, isLoading }) => {
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * 5;
  const endIndex = startIndex + 5;
  const hasNextPage = products.length > endIndex;
  const currentProducts = products.slice(startIndex, endIndex);

  useEffect(() => {
    setPage(1);
  }, [products]);

  return (
    <div className={styles.productsList}>
      {isLoading ? (
        <Loader />
      ) : currentProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        !!currentProducts.length && (
          <>
            <div className={styles.products}>
              {currentProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  {...product}
                />
              ))}
            </div>
            <div className={styles.pagination}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!hasNextPage}
              >
                Next
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
};
