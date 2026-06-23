"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  size: string;
  color: string;
  quantity: number;
  image: string;
  chapter: string;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }, buttonRect?: DOMRect) => void;
  flyFrom: { x: number; y: number } | null;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  justAdded: boolean;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType>({
  items: [], addItem: () => {}, removeItem: () => {}, updateQuantity: () => {},
  clearCart: () => {}, isOpen: false, setIsOpen: () => {}, justAdded: false,
  totalItems: 0, subtotal: 0, flyFrom: null,
});

export function useCart() { return useContext(CartContext); }

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("mg-cart") || "[]"); } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    localStorage.setItem("mg-cart", JSON.stringify(items));
  }, [items]);

  const [flyFrom, setFlyFrom] = useState<{ x: number; y: number } | null>(null);

  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }, buttonRect?: DOMRect) => {
    if (buttonRect) {
      setFlyFrom({ x: buttonRect.left + buttonRect.width / 2, y: buttonRect.top + buttonRect.height / 2 });
      setTimeout(() => setFlyFrom(null), 800);
    }
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: Math.min(i.quantity + (item.quantity || 1), i.maxStock) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    setJustAdded(true);
    setIsOpen(true);
    setTimeout(() => setJustAdded(false), 2000);
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size)));
  }, []);

  const updateQuantity = useCallback((id: string, size: string, qty: number) => {
    if (qty <= 0) { removeItem(id, size); return; }
    setItems(prev => prev.map(i =>
      i.id === id && i.size === size ? { ...i, quantity: Math.min(qty, i.maxStock) } : i
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, isOpen, setIsOpen, justAdded, totalItems, subtotal, flyFrom }}>
      {children}
    </CartContext.Provider>
  );
}
