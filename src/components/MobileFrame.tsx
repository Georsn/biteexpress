import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, ShoppingBag } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  title?: string;
  cartCount: number;
  onOpenCart: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function MobileFrame({
  children,
  cartCount,
  onOpenCart,
  showBackButton = false,
  onBack,
  currentTab,
  setCurrentTab
}: MobileFrameProps) {
  const [time, setTime] = useState('18:49');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="app-viewport-container" className="min-h-screen bg-neutral-950 flex items-center justify-center p-0 md:p-6 font-sans text-neutral-100 selection:bg-orange-500 selection:text-white">
      {/* External Phone Body for Tablet/Desktop */}
      <div id="phone-container" className="w-full h-screen md:h-[840px] md:w-[412px] md:rounded-[48px] md:border-[10px] md:border-neutral-800 bg-neutral-900 overflow-hidden relative shadow-2xl flex flex-col transition-all duration-300">
        
        {/* Dynamic Island / Camera Notch (Desktop simulated) */}
        <div id="camera-notch" className="hidden md:block absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50"></div>

        {/* Unified Mobile Status Bar */}
        <div id="system-status-bar" className="h-10 bg-neutral-950 text-neutral-300 flex items-center justify-between px-6 text-xs font-semibold select-none z-40 relative shrink-0">
          <span id="virtual-status-time">{time}</span>
          <div id="virtual-status-indicators" className="flex items-center gap-1.5">
            <Signal size={13} className="text-neutral-400" />
            <Wifi size={13} className="text-neutral-300" />
            <Battery size={14} className="text-neutral-300 fill-neutral-300/20" />
          </div>
        </div>

        {/* Shell App Bar */}
        <div id="shell-app-header" className="h-14 bg-neutral-950 border-b border-neutral-900/40 flex items-center justify-between px-5 z-30 relative shrink-0">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <button
                id="btn-nav-back"
                type="button"
                onClick={onBack}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-900 text-neutral-100 hover:bg-neutral-800 active:scale-95 transition-all outline-none"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍔</span>
                <span className="font-extrabold tracking-tight text-white bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  BiteExpress
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Elegant Cart Header Button */}
            <button
              id="btn-header-cart"
              type="button"
              onClick={onOpenCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-900 text-neutral-100 hover:bg-neutral-800 active:scale-95 transition-all outline-none"
              aria-label="Carrinho de Compras"
            >
              <ShoppingBag size={18} className="text-orange-500" />
              {cartCount > 0 && (
                <span
                  id="header-cart-badge"
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-extrabold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-neutral-950 animate-bounce"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Primary Screen Area */}
        <div id="phone-screen-content" className="flex-1 overflow-y-auto bg-neutral-950 flex flex-col relative pb-20">
          {children}
        </div>

        {/* Native Floating Bottom Tab Navigator */}
        <div id="floating-tab-nav" className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-neutral-950 border-t border-neutral-900/50 flex justify-around items-center px-4 z-40 select-none pb-1.5">
          <button
            id="tab-home"
            type="button"
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center justify-center w-14 h-full relative group transition-colors duration-200 outline-none ${
              currentTab === 'home' ? 'text-orange-500' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-bold mt-0.5 tracking-wider uppercase">Início</span>
            {currentTab === 'home' && (
              <span className="absolute bottom-[2px] w-1.5 h-1.5 bg-orange-500 rounded-full" />
            )}
          </button>

          <button
            id="tab-menu"
            type="button"
            onClick={() => setCurrentTab('menu')}
            className={`flex flex-col items-center justify-center w-14 h-full relative group transition-colors duration-200 outline-none ${
              currentTab === 'menu' ? 'text-orange-500' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <span className="text-xl">📋</span>
            <span className="text-[10px] font-bold mt-0.5 tracking-wider uppercase">Cardápio</span>
            {currentTab === 'menu' && (
              <span className="absolute bottom-[2px] w-1.5 h-1.5 bg-orange-500 rounded-full" />
            )}
          </button>

          <button
            id="tab-tracking"
            type="button"
            onClick={() => setCurrentTab('tracking')}
            className={`flex flex-col items-center justify-center w-14 h-full relative group transition-colors duration-200 outline-none ${
              currentTab === 'tracking' ? 'text-orange-500' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <span className="text-xl">🛵</span>
            <span className="text-[10px] font-bold mt-0.5 tracking-wider uppercase">Pedidos</span>
            {currentTab === 'tracking' && (
              <span className="absolute bottom-[2px] w-1.5 h-1.5 bg-orange-500 rounded-full" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
