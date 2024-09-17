import React from "react";
import styles from "../../styles/ProductCard.module.css";

const ProductCard = ({
  image,
  title,
  description,
  price,
  currency,
  priceSubtext,
  buttonText,
  onButtonClick,
  loading = false,
  addedToCart = false,
}) => {
  if (loading) {
    return (
      <div className={`${styles.card} ${styles.skeleton}`}>
        {/* ... (keep existing skeleton loader content) */}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <img
        src={image}
        alt={title}
        className={styles.cardImage}
        loading="lazy"
      />
      <div className={styles.cardContent}>
        <div className={styles.cardInfo}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {description && (
            <p className={styles.cardDescription}>{description}</p>
          )}
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.priceSection}>
            <span className={styles.price}>
              {price.toLocaleString(undefined, {
                style: "currency",
                currency: currency || "USD",
              })}
            </span>
            {priceSubtext && (
              <span className={styles.priceSubtext}>{priceSubtext}</span>
            )}
          </div>
          <button
            className={`${styles.button} ${
              addedToCart ? styles.addedToCart : ""
            }`}
            onClick={onButtonClick}
          >
            {addedToCart ? "Added to Cart!" : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
