import React, { useState } from 'react';
import "../styles/products.css";

const products = [
  {
    id: 1,
    name: "Premium Car Wax",
    description: "High-gloss car wax for a showroom shine.",
    price: "$19.99",
    image: "https://via.placeholder.com/300x200",
    category: "Exterior Care",
  },
  {
    id: 2,
    name: "All-Weather Floor Mats",
    description: "Durable rubber mats for all seasons.",
    price: "$49.99",
    image: "https://via.placeholder.com/300x200",
    category: "Interior Accessories",
  },
  {
    id: 3,
    name: "LED Headlights",
    description: "Bright and energy-efficient LED headlights.",
    price: "$79.99",
    image: "https://via.placeholder.com/300x200",
    category: "Lighting",
  },
  {
    id: 4,
    name: "Car Air Freshener",
    description: "Long-lasting fragrance for your vehicle.",
    price: "$9.99",
    image: "https://via.placeholder.com/300x200",
    category: "Interior Accessories",
  },
  {
    id: 5,
    name: "Windshield Washer Fluid",
    description: "Anti-freeze washer fluid for winter use.",
    price: "$12.99",
    image: "https://via.placeholder.com/300x200",
    category: "Exterior Care",
  },
];

const groupProductsByCategory = (products) => {
  const grouped = {};
  products.forEach((product) => {
    if (!grouped[product.category]) {
      grouped[product.category] = [];
    }
    grouped[product.category].push(product);
  });
  return grouped;
};

const ProductsPage = () => {
  const [activeIndexes, setActiveIndexes] = useState({});

  const handlePrev = (category) => {
    setActiveIndexes((prev) => ({
      ...prev,
      [category]: prev[category] > 0 ? prev[category] - 1 : 0,
    }));
  };

  const handleNext = (category) => {
    setActiveIndexes((prev) => ({
      ...prev,
      [category]: prev[category] < products.filter(p => p.category === category).length - 4 ? prev[category] + 1 : prev[category],
    }));
  };

  const groupedProducts = groupProductsByCategory(products);

  return (
    <div className="App-products">
      <h2>Automotive Products</h2>
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <section key={category} className="horizontal-carousel">
          <h3>{category}</h3>
          <div className="carousel-container">
            <button
              className="carousel-btn prev"
              onClick={() => handlePrev(category)}
            >
              &#10094;
            </button>
            <div className="carousel-items">
              {categoryProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`carousel-item ${index >= (activeIndexes[category] || 0) && index < (activeIndexes[category] || 0) + 4 ? 'active' : ''}`}
                >
                  <img src={product.image} alt={product.name} />
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <span className="price">{product.price}</span>
                </div>
              ))}
            </div>
            <button
              className="carousel-btn next"
              onClick={() => handleNext(category)}
            >
              &#10095;
            </button>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductsPage;