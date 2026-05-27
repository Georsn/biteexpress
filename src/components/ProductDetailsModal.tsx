import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { Product, CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  
  // Customization Options States
  const [noOnion, setNoOnion] = useState(false);
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraSauce, setExtraSauce] = useState(false);

  // Reset modifiers when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNotes('');
      setNoOnion(false);
      setExtraCheese(false);
      setExtraSauce(false);
    }
  }, [product]);

  if (!product) return null;

  // Pricing math
  const basePrice = product.price;
  const extraCheeseCost = extraCheese ? 3.00 : 0.00;
  const extraSauceCost = extraSauce ? 2.00 : 0.00;
  const singleItemTotal = basePrice + extraCheeseCost + extraSauceCost;
  const totalCost = singleItemTotal * quantity;

  const handleAdd = () => {
    // Generate a unique ID based on selections (id + extras)
    const customHash = `-${noOnion ? 'noOnion' : ''}-${extraCheese ? 'extraCheese' : ''}-${extraSauce ? 'extraSauce' : ''}-${notes.slice(0, 15).replace(/\s/g, '')}`;
    const cartItemId = `${product.id}${customHash}`;

    const cartItem: CartItem = {
      id: cartItemId,
      product: {
        ...product,
        // Override price to reflect active customizations
        price: singleItemTotal
      },
      quantity,
      notes,
      customizations: {
        noOnion,
        extraCheese,
        extraSauce
      }
    };

    onAddToCart(cartItem);
  };

  return (
    <AnimatePresence>
      <div id="details-modal-backdrop" className="fixed inset-0 bg-black/80 flex items-end justify-center z-50">
        
        {/* Click background to close */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        {/* Modal/Bottom Sheet Interface */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          id="details-sheet-container"
          className="w-full max-w-[412px] bg-neutral-900 rounded-t-[32px] border-t border-neutral-800 overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
        >
          {/* Top Notch Drag Indicator */}
          <div className="w-12 h-1 bg-neutral-850 rounded-full mx-auto my-3 shrink-0" />

          {/* Close Floating Button */}
          <button
            id="btn-close-details"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-950/60 hover:bg-neutral-950 text-white flex items-center justify-center transition border border-neutral-850 z-20"
          >
            <X size={16} />
          </button>

          {/* Scrollable Sheet Content */}
          <div id="details-sheet-scroll" className="overflow-y-auto overflow-x-hidden flex-1 pb-6 px-5 flex flex-col gap-5 no-scrollbar">
            
            {/* Main Appetizing Imagery */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden relative shadow bg-neutral-950 select-none">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-transparent to-transparent"></div>
              
              {/* Category tag */}
              <span className="absolute bottom-3 left-3 bg-neutral-950/80 border border-neutral-800 backdrop-blur-sm text-amber-500 font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                {product.category === 'burgers' ? '🍔 Hamburguer Premium' :
                 product.category === 'sides' ? '🍟 Acompanhamento' :
                 product.category === 'drinks' ? '🥤 Bebida Refrescante' :
                 '🍰 Sobremesas'}
              </span>
            </div>

            {/* Title & Description text */}
            <div className="flex flex-col gap-1.5 ">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-extrabold text-white tracking-tight">{product.name}</h2>
                <span className="text-base font-black text-orange-500 shrink-0">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center gap-3.5 mt-2.5 text-[10px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-amber-500" /> Preparo: {product.preparationTime} min
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-500" /> 100% fresco e artesanal
                </span>
              </div>
            </div>

            {/* Customizations Multipliers */}
            <div id="details-customizations-list" className="flex flex-col gap-3 pt-3 border-t border-neutral-800/40">
              <span className="text-xs font-black uppercase text-neutral-300 tracking-wider">
                Personalize seu pedido
              </span>

              <div className="flex flex-col gap-2">
                {/* Removals: Sem Cebola */}
                {product.ingredients.some(i => i.toLowerCase().includes('cebola')) && (
                  <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/50 hover:bg-neutral-950 border border-neutral-850 cursor-pointer select-none transition">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-neutral-200">Sem Cebola</span>
                      <span className="text-[10px] text-neutral-500">Retirar cebola fatiada do lanche</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={noOnion}
                      onChange={(e) => setNoOnion(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-orange-500 rounded"
                    />
                  </label>
                )}

                {/* Premium Add-on: Queijo Extra */}
                {product.category === 'burgers' && (
                  <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/50 hover:bg-neutral-950 border border-neutral-850 cursor-pointer select-none transition">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-neutral-200">Adicionar Cheddar Extra</span>
                      <span className="text-[10px] text-neutral-500">Mais camada cremosa derretida (+ R$ 3,00)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-orange-500">R$ +3,00</span>
                      <input
                        type="checkbox"
                        checked={extraCheese}
                        onChange={(e) => setExtraCheese(e.target.checked)}
                        className="w-4 h-4 cursor-pointer accent-orange-500 rounded"
                      />
                    </div>
                  </label>
                )}

                {/* Premium Add-on: Molho Extra */}
                {(product.category === 'burgers' || product.category === 'sides') && (
                  <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/50 hover:bg-neutral-950 border border-neutral-850 cursor-pointer select-none transition">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-neutral-200">Maionese Secreta Extra</span>
                      <span className="text-[10px] text-neutral-500">Adicione um pote extra do molho (+ R$ 2,00)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-orange-500">R$ +2,00</span>
                      <input
                        type="checkbox"
                        checked={extraSauce}
                        onChange={(e) => setExtraSauce(e.target.checked)}
                        className="w-4 h-4 cursor-pointer accent-orange-500 rounded"
                      />
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Observations text field */}
            <div id="details-observation-field" className="flex flex-col gap-2">
              <label htmlFor="input-special-observations" className="text-xs font-black uppercase text-neutral-300 tracking-wider flex items-center gap-1">
                <MessageSquare size={13} className="text-neutral-500" /> Alguma observação especial?
              </label>
              <textarea
                id="input-special-observations"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Exemplo: sem picles, ponto da carne ao ponto, bebida sem limão, etc..."
                maxLength={200}
                className="w-full h-18 p-3 rounded-xl bg-neutral-950 text-xs text-neutral-200 border border-neutral-850 focus:outline-none focus:border-orange-500 resize-none transition"
              />
              <span className="text-right text-[9px] text-neutral-550 font-medium">
                {notes.length}/200 caracteres
              </span>
            </div>

            {/* Quantity Selector & Live total computation Row */}
            <div id="details-quantity-row" className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-850/60 mt-2 select-none">
              <span className="text-xs font-bold text-neutral-400">Quantidade:</span>
              
              <div className="flex items-center gap-4">
                <button
                  id="btn-decrement-modal"
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-200 hover:text-white active:scale-90 transition outline-none"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-black text-white w-4 text-center">{quantity}</span>
                <button
                  id="btn-increment-modal"
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-200 hover:text-white active:scale-90 transition outline-none"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

          </div>

          {/* Action Footer Button Container */}
          <div id="details-sheet-footer" className="p-4 bg-neutral-900 border-t border-neutral-800/40 shrink-0">
            <button
              id="btn-confirm-add-cart"
              type="button"
              onClick={handleAdd}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-[0.99] transition rounded-2xl text-xs font-black tracking-wider uppercase text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer outline-none"
            >
              Adicionar ao Carrinho • R$ {totalCost.toFixed(2).replace('.', ',')}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
