import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getProfile } from '../utils/getProfile';

const Context = createContext();

export const StateContext = ({ children }) => {
  // 🛒 CART STATES
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  // 👤 AUTH STATES
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Auto-fetch profile if cookie exists
    getProfile()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  // ➕ Add to Cart
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(item => item._id === product._id);

    setTotalPrice(prev => prev + product.price * quantity);
    setTotalQuantities(prev => prev + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map(cartProduct =>
        cartProduct._id === product._id
          ? { ...cartProduct, quantity: cartProduct.quantity + quantity }
          : cartProduct
      );
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${quantity} ${product.name} added to the cart.`);
  };

  // ❌ Remove from Cart
  const onRemove = (product) => {
    const foundProduct = cartItems.find(item => item._id === product._id);
    const newCartItems = cartItems.filter(item => item._id !== product._id);

    setTotalPrice(prev => prev - foundProduct.price * foundProduct.quantity);
    setTotalQuantities(prev => prev - foundProduct.quantity);
    setCartItems(newCartItems);
  };

  // 🔁 Increment/Decrement Quantity in Cart
  const toggleCartItemQuanitity = (id, value) => {
    const foundProduct = cartItems.find(item => item._id === id);
    const newCartItems = cartItems.filter(item => item._id !== id);

    if (value === 'inc') {
      setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
      setTotalPrice(prev => prev + foundProduct.price);
      setTotalQuantities(prev => prev + 1);
    } else if (value === 'dec' && foundProduct.quantity > 1) {
      setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
      setTotalPrice(prev => prev - foundProduct.price);
      setTotalQuantities(prev => prev - 1);
    }
  };

  // Quantity Input (on Product Page)
  const incQty = () => setQty(prev => prev + 1);
  const decQty = () => setQty(prev => (prev - 1 < 1 ? 1 : prev - 1));

  return (
    <Context.Provider
      value={{
        // Cart
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuanitity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,

        // Auth
        user,
        setUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
