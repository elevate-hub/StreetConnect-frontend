import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

const CART_KEY = 'streetconnect_cart';

const getStoredCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : { vendorId: null, vendorName: '', items: [] };
  } catch {
    return { vendorId: null, vendorName: '', items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = (item, vendor) => {
    setCart(prev => {
      if (prev.vendorId && prev.vendorId !== vendor.id) {
        return prev; // handled by UI modal
      }
      const existing = prev.items.find(i => i.menuItemId === item.menuItemId);
      if (existing) {
        return {
          ...prev,
          vendorId: vendor.id,
          vendorName: vendor.name,
          items: prev.items.map(i =>
            i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      }
      return {
        ...prev,
        vendorId: vendor.id,
        vendorName: vendor.name,
        items: [...prev.items, { ...item, quantity: 1 }]
      };
    });
  };

  const removeItem = (menuItemId) => {
    setCart(prev => {
      const items = prev.items.filter(i => i.menuItemId !== menuItemId);
      if (items.length === 0) return { vendorId: null, vendorName: '', items: [] };
      return { ...prev, items };
    });
  };

  const updateQuantity = (menuItemId, qty) => {
    if (qty <= 0) return removeItem(menuItemId);
    setCart(prev => ({
      ...prev,
      items: prev.items.map(i => i.menuItemId === menuItemId ? { ...i, quantity: qty } : i)
    }));
  };

  const clearCart = () => setCart({ vendorId: null, vendorName: '', items: [] });

  const cartTotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  const isDifferentVendor = (vendorId) => cart.vendorId && cart.vendorId !== vendorId && cart.items.length > 0;

  const forceAddItem = (item, vendor) => {
    setCart({ vendorId: vendor.id, vendorName: vendor.name, items: [{ ...item, quantity: 1 }] });
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount, isDifferentVendor, forceAddItem }}>
      {children}
    </CartContext.Provider>
  );
};
