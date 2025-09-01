'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  courseId: string;
  title: string;
  instructor: string;
  price: number;
  originalPrice: number;
  currency: string;
  image: string;
  duration: number;
  level: string;
  category: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('lms-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lms-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    console.log('Adding item to cart:', item); // Debug log
    setCartItems(prev => {
      // Check if item already exists in cart
      const existingItem = prev.find(cartItem => cartItem.courseId === item.courseId);
      if (existingItem) {
        console.log('Item already exists in cart:', existingItem); // Debug log
        // Item already exists, don't add duplicate
        return prev;
      }
      console.log('Adding new item to cart'); // Debug log
      // Add new item
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const cartCount = cartItems.length;

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    cartTotal,
    cartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
