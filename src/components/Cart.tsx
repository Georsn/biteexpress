import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, Tag, Percent, Info } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClose: () => void;
  onProceedToCheckout: (appliedCoupon: string, discountAmount: number) => void;
}

export default function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClose,
  onProceedToCheckout
}: CartProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Computations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Delivery rule: R$ 7,90 or FREE if subtotal > R$ 60.00
  const isDeliveryFree = subtotal >= 60.00;
  const deliveryFee = subtotal > 0 ? (isDeliveryFree ? 0.00 : 7.90) : 0.00;

  // Coupon apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    if (code === 'BITE10') {
      if (subtotal < 30) {
        setCouponError('Cupom BITE10 exige pedido mínimo de R$ 30,00');
        return;
      }
      setAppliedCoupon('BITE10');
      setCouponDiscount(10.00);
      setCouponCode('');
    } else if (code === 'QUEROSABOR') {
      const discount = subtotal * 0.15; // 15% discount
      setAppliedCoupon('QUEROSABOR');
      setCouponDiscount(discount);
      setCouponCode('');
    } else {
      setCouponError('Cupom inválido. Tente BITE10 ou QUEROSABOR');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscount(0);
  };

  const finalTotal = Math.max(0, subtotal + deliveryFee - couponDiscount);

  return (
    <AnimatePresence>
      <div id="cart-backdrop" className="fixed inset-0 bg-black/85 flex items-end justify-center z-50">
        
        {/* Click background to close */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        {/* Sliding card panel */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          id="cart-panel-container"
          className="w-full max-w-[412px] bg-neutral-900 rounded-t-[32px] border-t border-neutral-800 overflow-hidden relative z-10 flex flex-col h-[90vh]"
        >
          {/* Visual notch */}
          <div className="w-12 h-1 bg-neutral-850 rounded-full mx-auto my-3 shrink-0" />

          {/* Header row */}
          <div id="cart-panel-header" className="flex items-center justify-between px-5 pb-3 border-b border-neutral-800/60 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <h2 className="text-base font-black text-white">Seu Carrinho</h2>
              <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2.5 py-0.5 rounded-full font-extrabold">
                {cartItems.length} Itens
              </span>
            </div>
            
            <button
              id="btn-close-cart"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-950/60 hover:bg-neutral-950 text-neutral-400 flex items-center justify-center transition border border-neutral-850 outline-none"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body content */}
          <div id="cart-panel-body" className="flex-1 overflow-y-auto p-5 pb-8 flex flex-col gap-5 no-scrollbar">
            {cartItems.length > 0 ? (
              <>
                {/* Free shipping progress alert */}
                <div id="free-delivery-milestone" className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs">
                    🚚
                  </div>
                  <div className="flex-1 flex flex-col">
                    {isDeliveryFree ? (
                      <span className="text-[11px] font-black text-emerald-400">Você ganhou Frete Grátis! 🎉</span>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold text-neutral-200">
                          Falta apenas <strong className="text-orange-500">R$ {(60 - subtotal).toFixed(2).replace('.', ',')}</strong> para frete grátis!
                        </span>
                        {/* Tiny progress bar */}
                        <div className="w-full bg-neutral-900 h-1 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-orange-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${(subtotal / 60) * 100}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Items collection list */}
                <div id="cart-items-collection" className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0, padding: 0, margin: 0, border: 0 }}
                        transition={{ duration: 0.18 }}
                        key={item.id}
                        id={`cart-item-${item.id}`}
                        className="flex gap-3 p-3 bg-neutral-950/40 border border-neutral-850/80 rounded-2xl relative group"
                      >
                        {/* Food small img */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden self-center bg-neutral-950 flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Detailed text details */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div className="flex flex-col">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-xs font-black text-white leading-tight line-clamp-1">{item.product.name}</h3>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.id)}
                                className="text-neutral-500 hover:text-red-500 transition outline-none p-0.5"
                                aria-label="Remover item"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            {/* Active Customizations list */}
                            {(item.customizations.noOnion || item.customizations.extraCheese || item.customizations.extraSauce || item.notes) && (
                              <div className="flex flex-col gap-1 mt-1">
                                <div className="flex flex-wrap gap-1">
                                  {item.customizations.noOnion && (
                                    <span className="text-[8px] bg-red-900/20 text-red-400 font-bold px-1.5 py-0.5 rounded">
                                      Sem Cebola
                                    </span>
                                  )}
                                  {item.customizations.extraCheese && (
                                    <span className="text-[8px] bg-amber-900/20 text-amber-400 font-bold px-1.5 py-0.5 rounded">
                                      +Cheddar Extra
                                    </span>
                                  )}
                                  {item.customizations.extraSauce && (
                                    <span className="text-[8px] bg-amber-900/20 text-blue-400 font-bold px-1.5 py-0.5 rounded">
                                      +Maionese Extra
                                    </span>
                                  )}
                                </div>
                                {item.notes && (
                                  <span className="text-[9px] text-neutral-400 italic line-clamp-1">
                                    Obs: "{item.notes}"
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Row for live adjustment */}
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-xs font-bold text-orange-500">
                              R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                            </span>

                            <div className="flex items-center gap-2 px-1.5 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-white transition active:scale-90"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-xs font-black text-white w-4 text-center">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-white transition active:scale-90"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Coupon Coupon Submission box */}
                <div id="cart-promo-coupon-box" className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-850/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-300 flex items-center gap-1">
                      <Tag size={13} className="text-orange-500" /> Cupom de Desconto
                    </span>
                    <span className="text-[9px] text-neutral-500 font-semibold uppercase">Cupons de teste: BITE10, QUEROSABOR</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-xs">
                      <div className="flex items-center gap-1.5">
                        <Percent size={13} />
                        <span>Cupom {appliedCoupon} Ativado (- R$ {couponDiscount.toFixed(2).replace('.', ',')})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-red-400 hover:text-red-500 text-xs font-black px-1"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Insira o cupom aqui"
                        className="flex-1 h-9 rounded-xl px-3 bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 uppercase focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="h-9 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 transition text-white font-extrabold text-xs tracking-wider"
                      >
                        Aplicar
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <span className="text-[10px] text-red-500 font-bold pl-1">{couponError}</span>
                  )}
                </div>

                {/* Simulated Math breakdown Summary */}
                <div id="cart-price-ledger" className="flex flex-col gap-2 text-xs text-neutral-300 border-t border-neutral-850/60 pt-4">
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>

                  <div className="flex justify-between items-center text-neutral-400">
                    <span className="flex items-center gap-1">
                      Taxa de Entrega
                      {!isDeliveryFree && (
                        <span className="group relative cursor-pointer text-xs text-neutral-500">
                          <Info size={11} />
                        </span>
                      )}
                    </span>
                    <span className={isDeliveryFree ? 'text-emerald-400 font-extrabold' : 'font-bold'}>
                      {isDeliveryFree ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-400 font-semibold">
                      <span>Desconto do Cupom ({appliedCoupon})</span>
                      <span>- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm font-black text-white border-t border-neutral-850 pt-2.5 mt-1">
                    <span>Total do Pedido</span>
                    <span className="text-base text-orange-500">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </>
            ) : (
              <div id="cart-panel-empty-box" className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <span className="text-5xl animate-bounce">🛒</span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-neutral-300">Seu carrinho está vazio</span>
                  <span className="text-xs text-neutral-550 max-w-[210px] mx-auto leading-relaxed">
                    Você ainda não adicionou nenhum lanche apetitoso do nosso cardápio.
                  </span>
                </div>
                <button
                  id="btn-empty-cart-back-menu"
                  type="button"
                  onClick={onClose}
                  className="mt-2 text-xs bg-orange-500 hover:bg-orange-600 transition text-white px-5 py-2.5 rounded-xl font-bold tracking-wide"
                >
                  Ver Cardápio Oficial
                </button>
              </div>
            )}
          </div>

          {/* Action Footer Call-to-action */}
          {cartItems.length > 0 && (
            <div id="cart-panel-footer" className="p-4 bg-neutral-900 border-t border-neutral-850 shrink-0">
              <button
                id="btn-proceed-checkout"
                type="button"
                onClick={() => onProceedToCheckout(appliedCoupon, couponDiscount)}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-[0.99] transition rounded-2xl text-xs font-black tracking-wider uppercase text-white flex items-center justify-center gap-1.5 cursor-pointer outline-none shadow-md"
              >
                Prosseguir para Entrega <ArrowRight size={13} />
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
