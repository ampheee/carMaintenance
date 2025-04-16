import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Sample cart data
const initialCartItems = [
  {
    id: 1,
    name: "Premium Car Wax",
    price: "$19.99",
    image: "https://via.placeholder.com/100",
    quantity: 2,
  },
  {
    id: 2,
    name: "All-Weather Floor Mats",
    price: "$49.99",
    image: "https://via.placeholder.com/100",
    quantity: 1,
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  // Handle item removal
  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setSelectedItems((prevSelected) => prevSelected.filter((id) => id !== itemId));
  };

  // Handle quantity update
  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle checkbox selection
  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems((prevSelected) => prevSelected.filter((id) => id !== itemId));
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, itemId]);
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length && cartItems.length > 0) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(cartItems.map((item) => item.id)); // Select all
    }
  };

  // Calculate subtotal for selected items
  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce(
        (total, item) => total + parseFloat(item.price.replace("$", "")) * item.quantity,
        0
      );
  };

  return (
    <div className="App-cart">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link to="/products" style={{ color: "#3498db" }}>
            Shop now
          </Link>
          .
        </p>
      ) : (
        <div className="cart-container">
          {/* Left/Main Section: Cart Items */}
          <div className="cart-items-section">
            <div className="select-all">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                onChange={handleSelectAll}
              />
              <label>Select All</label>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Price: {item.price}</p>
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Right Section: Order Details */}
          <div className="order-details-section">
            <h3>Order Details</h3>
            <div className="order-detail-row">
              <span>Items:</span>
              <span>{selectedItems.length} items</span>
            </div>
            <div className="order-detail-row">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="order-detail-row">
              <span>Storage:</span>
              <span>$0.00</span>
            </div>
            <div className="order-detail-row total">
              <span>To be Paid:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            {/* Checkout Button at the Bottom */}
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
              disabled={selectedItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;