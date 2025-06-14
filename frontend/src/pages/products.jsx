import React, { useState } from 'react';
import "../styles/products.css";

const products = [
  {
    id: 1,
    name: "Автошампунь премиум-класса",
    description: "Высококачественный автошампунь для идеального блеска",
    price: "599₽",
    originalPrice: "799₽",
    image: "https://pubimg.nodacdn.net/images/full/1025b8981703981682f0f139fa882d679495180001.jpeg",
    category: "Уход за внешним видом",
    isOnSale: true,
  },
  {
    id: 2,
    name: "Жидкость для омывателя ЛС",
    description: "Незамерзающая жидкость для круглогодичного использования",
    price: "199₽",
    image: "https://liquimoly.ru/upload/iblock/a08/a080841a7410179bd86b0f053a3698e9.jpg",
    category: "Жидкости",
    isOnSale: false,
  },
  {
    id: 3,
    name: "Спрей для блеска шин",
    description: "Восстанавливает черный цвет и придает блеск",
    price: "349₽",
    image: "https://www.waxmarket.ru/public/i/p/xl/235300.jpg",
    category: "Уход за шинами",
    isOnSale: false,
  },
  {
    id: 4,
    name: "Полотенце из микрофибры (3 шт)",
    description: "Набор полотенец для мойки и полировки автомобиля",
    price: "449₽",
    originalPrice: "599₽",
    image: "http://cdn.vseinstrumenti.ru/images/goods/oborudovanie-dlya-avtoservisa-i-garazha/avtohimiya/1198762/560x504/51718977.jpg",
    category: "Аксессуары",
    isOnSale: true,
  },
  {
    id: 5,
    name: "Полироль для автомобиля",
    description: "Защитная полироль с долговременным эффектом",
    price: "799₽",
    image: "https://static.planetavto.ru/full_size/970635.webp",
    category: "Полироли",
    isOnSale: false,
  },
  {
    id: 6,
    name: "Антифриз",
    description: "Высококачественный антифриз для системы охлаждения",
    price: "899₽",
    image: "https://www.rmasla.ru/assets/images/products/5595/x/coolstream-optima-green-(zelenyij)-5l-1.jpg",
    category: "Жидкости",
    isOnSale: false,
  },
  {
    id: 7,
    name: "Очиститель стекол",
    description: "Эффективное средство для мытья автомобильных стекол",
    price: "299₽",
    image: "https://cdn.lemanapro.ru/lmru/image/upload/v1654774053/lmcode/D-Vqsc6Ylk24GIIkKet5uw/82878515.png",
    category: "Очистители",
    isOnSale: false,
  },
  {
    id: 8,
    name: "Очиститель кузова",
    description: "Специальное средство для восстановления блеска кузова",
    price: "549₽",
    originalPrice: "699₽",
    image: "https://cdn1.ozone.ru/s3/multimedia-p/6703908073.jpg",
    category: "Очистители",
    isOnSale: true,
  },
];

const ProductsPage = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    setCart(prev => [...prev, product]);
    console.log('Добавлено в корзину:', product.name);
  };

  return (
    <div className="products-page">
      <div className="products-container">
        <h1 className="products-title">Автомобильные товары</h1>
        <p className="products-subtitle">Уход за внешним видом</p>
        
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                {product.isOnSale && <span className="sale-badge">СКИДКА</span>}
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-pricing">
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
                  <span className="current-price">{product.price}</span>
                </div>
                
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product.id)}
                >
                  В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;