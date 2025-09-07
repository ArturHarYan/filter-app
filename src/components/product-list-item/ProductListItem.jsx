import styles from './ProductListItem.module.css';

export const ProductListItem = ({ name, category, brand, price, rating }) => {
  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
        <span className={styles.price}>${price}</span>
      </div>
      <div className={styles.details}>
        <span>Category: {category}</span>
        <span>Brand: {brand}</span>
        <span>Rating: {rating} ⭐</span>
      </div>
    </div>
  );
};
