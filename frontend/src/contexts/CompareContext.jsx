import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const STORAGE_KEY = "compareProducts";
  const [compare, setCompare] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setCompare(raw ? JSON.parse(raw) : []);
    } catch (err) {
      console.error("Failed to load compare from localStorage", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compare));
    } catch (err) {
      console.error("Failed to save compare to localStorage", err);
    }
  }, [compare]);

  const add = (product) => {
    if (!product || !product.id) return;
    const exists = compare.some((p) => p.id === product.id);
    if (exists) return;
    if (compare.length >= 3) {
      toast.error("You can compare up to 3 products only");
      return;
    }
    setCompare((prev) => [...prev, product]);
    toast.success("Product added to compare");
  };

  const remove = (productId) => {
    setCompare((prev) => prev.filter((p) => p.id !== productId));
    toast.info("Product removed from compare");
  };

  const toggle = (product) => {
    if (!product || !product.id) return;
    const exists = compare.some((p) => p.id === product.id);
    if (exists) {
      remove(product.id);
    } else {
      add(product);
    }
  };

  const clear = () => {
    setCompare([]);
    toast.info("Compare list cleared");
  };

  const isInCompare = (productId) => compare.some((p) => p.id === productId);

  return (
    <CompareContext.Provider
      value={{ compare, add, remove, toggle, clear, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};
