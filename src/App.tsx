/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import MobileFrame from './components/MobileFrame';
import Home from './components/Home';
import Menu from './components/Menu';
import ProductDetailsModal from './components/ProductDetailsModal';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';
import { Product, CartItem, Order, OrderStatus, CategoryType } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation & Screen tab state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isCheckoutActive, setIsCheckoutActive] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Focus and Filter hooks linking Home -> Menu search
  const [menuSelectedCategory, setMenuSelectedCategory] = useState<CategoryType>('burgers');
  const [menuShouldFocusSearch, setMenuShouldFocusSearch] = useState<boolean>(false);

  // Selected product state for configuring customized items
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart & Orders Storage Hooks (using localStorage for robust simulation)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('biteexpress_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const stored = localStorage.getItem('biteexpress_order');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Temporarily cash active coupons between Cart -> Checkout
  const [pendingCoupon, setPendingCoupon] = useState<string>('');
  const [pendingDiscount, setPendingDiscount] = useState<number>(0);

  // Notification Toast system
  const [toastMessage, setToastMessage] = useState<string>('');

  // Persist storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('biteexpress_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist storage whenever order changes
  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('biteexpress_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('biteexpress_order');
    }
  }, [activeOrder]);

  // Toast notification triggerr
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Add customized item block into cart list
  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex((item) => item.id === newItem.id);
      
      if (existingIdx > -1) {
        // Merge quantity if same custom configurations
        const updated = [...prevItems];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prevItems, newItem];
    });

    setSelectedProduct(null); // Close customization bottom sheet
    showToast(`🛒 ${newItem.quantity}x ${newItem.product.name} no carrinho!`);
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    const itemToRemove = cartItems.find((i) => i.id === id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    if (itemToRemove) {
      showToast(`❌ ${itemToRemove.product.name} removido.`);
    }
  };

  // Switch menu catalog directly to chosen classification
  const handleQuickCategorySelect = (category: CategoryType) => {
    setMenuSelectedCategory(category);
    setCurrentTab('menu');
    setIsCheckoutActive(false);
  };

  // Shift tabs and open searching area directly
  const handleSearchShortcut = () => {
    setMenuShouldFocusSearch(true);
    setCurrentTab('menu');
    setIsCheckoutActive(false);
  };

  // Transfer Cart state summary into Checkout screen inputs
  const handleProceedToCheckout = (coupon: string, discount: number) => {
    setPendingCoupon(coupon);
    setPendingDiscount(discount);
    setIsCartOpen(false);
    setIsCheckoutActive(true);
  };

  // Handle final mock place order success
  const handlePlaceOrder = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setCartItems([]); // Flush Cart
    localStorage.removeItem('biteexpress_cart'); // Flush localstorage cart only, persist order
    setPendingCoupon('');
    setPendingDiscount(0);
    setIsCheckoutActive(false);
    setCurrentTab('tracking'); // Switch immediately to status timeline tracking
    showToast('🚀 Pedido enviado à cozinha com sucesso!');
  };

  // Update chronological status in real-time tracking
  const handleUpdateOrderStatus = (status: OrderStatus) => {
    if (!activeOrder) return;
    setActiveOrder((prev) => (prev ? { ...prev, status } : null));

    // Display localized notify toasts
    if (status === 'preparing') {
      showToast('🍔 O chef começou a preparar seu burgão!');
    } else if (status === 'delivery') {
      showToast('🏍️ O entregador acabou de sair com seu pedido!');
    } else if (status === 'delivered') {
      showToast('🎉 Pedido entregue! Bom apetite!');
    }
  };

  // Reset order session helper to clear screen and unlock buying menu
  const handleResetOrder = () => {
    setActiveOrder(null);
    setCurrentTab('menu');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = cartSubtotal > 0 && cartSubtotal < 60 ? 7.90 : 0.00;

  return (
    <MobileFrame
      cartCount={cartCount}
      onOpenCart={() => setIsCartOpen(true)}
      showBackButton={isCheckoutActive}
      onBack={() => setIsCheckoutActive(false)}
      currentTab={currentTab}
      setCurrentTab={(tab) => {
        setIsCheckoutActive(false);
        setCurrentTab(tab);
      }}
    >
      <div id="application-router-outlet" className="w-full flex-1">
        {/* Toast Alerts Notification system */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 10, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              id="app-notification-toast"
              className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-neutral-900 border border-orange-500/30 text-white font-bold text-xs px-5 py-3 rounded-2xl z-50 shadow-xl flex items-center justify-center gap-2 max-w-[320px] backdrop-blur-sm pointer-events-none"
            >
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic conditional router views */}
        {isCheckoutActive ? (
          <Checkout
            cartItems={cartItems}
            subtotal={cartSubtotal}
            deliveryFee={deliveryFee}
            discountAmount={pendingDiscount}
            appliedCoupon={pendingCoupon}
            onPlaceOrder={handlePlaceOrder}
            onCancel={() => setIsCheckoutActive(false)}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <Home
                onSelectProduct={setSelectedProduct}
                onSelectCategory={handleQuickCategorySelect}
                onSearchFocus={handleSearchShortcut}
              />
            )}

            {currentTab === 'menu' && (
              <Menu
                onSelectProduct={setSelectedProduct}
                selectedCategory={menuSelectedCategory}
                setSelectedCategory={setMenuSelectedCategory}
                shouldFocusSearch={menuShouldFocusSearch}
                setShouldFocusSearch={setMenuShouldFocusSearch}
              />
            )}

            {currentTab === 'tracking' && (
              <OrderTracking
                order={activeOrder}
                onUpdateStatus={handleUpdateOrderStatus}
                onResetOrder={handleResetOrder}
              />
            )}
          </>
        )}
      </div>

      {/* Slide customize parameters bottom drawer modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart side panel sliding tray overlay */}
      {isCartOpen && (
        <Cart
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClose={() => setIsCartOpen(false)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}
    </MobileFrame>
  );
}
