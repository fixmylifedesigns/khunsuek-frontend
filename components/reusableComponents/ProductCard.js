import React from "react";
import Image from "next/image";
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
      <div
        className={`${styles.cardContainer} ${styles.card} ${styles.skeleton}`}
      >
        <div className={`${styles.cardImage} ${styles.skeletonImage}`}></div>
        <div className={styles.cardContent}>
          <div className={styles.cardInfo}>
            <div
              className={`${styles.skeletonText} ${styles.skeletonTitle}`}
            ></div>
            <div
              className={`${styles.skeletonText} ${styles.skeletonDescription}`}
            ></div>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.priceSection}>
              <div
                className={`${styles.skeletonText} ${styles.skeletonPrice}`}
              ></div>
            </div>
            <div className={`${styles.button} ${styles.skeletonButton}`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <Image
          src={image}
          alt={title}
          className={styles.cardImage}
          loading="lazy"
          width={300}
          height={300}
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
    </div>
  );
};

export default ProductCard;
