import React, { useState } from 'react';
import { CreditCard, Landmark, DollarSign, ArrowRight, ShieldCheck, Truck, ShoppingBag, Eye } from 'lucide-react';
import { CartItem, Order, OrderStatus } from '../types';
import { motion } from 'motion/react';

interface CheckoutProps {
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  appliedCoupon: string;
  onPlaceOrder: (order: Order) => void;
  onCancel: () => void;
}

export default function Checkout({
  cartItems,
  subtotal,
  deliveryFee,
  discountAmount,
  appliedCoupon,
  onPlaceOrder,
  onCancel
}: CheckoutProps) {
  // Address & Identity Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [referenceNotes, setReferenceNotes] = useState('');

  // Payment Selection States
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'cash'>('card');
  const [cashChange, setCashChange] = useState('');
  const [needsChange, setNeedsChange] = useState<boolean>(false);

  // CC Mock Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Form input validations error list
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Form validations handler
  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
    if (!phone.replace(/\D/g, '')) {
      newErrors.phone = 'Telefone válido é obrigatório';
    } else if (phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Insira o número de telefone com DDD';
    }
    if (!street.trim()) newErrors.street = 'Rua/Avenida é obrigatória';
    if (!number.trim()) newErrors.number = 'Número é obrigatório ou S/N';
    if (!neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';

    if (paymentMethod === 'card') {
      if (!cardNumber.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Cartão de crédito é obrigatório';
      } else if (cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Cartão de crédito inválido (16 dígitos)';
      }
      if (!cardHolder.trim()) newErrors.cardHolder = 'Titular do cartão é obrigatório';
      if (!cardExpiry.includes('/')) newErrors.cardExpiry = 'MM/AA';
      if (cardCvv.length < 3) newErrors.cardCvv = 'CVV inválido';
    }

    if (paymentMethod === 'cash' && needsChange && !cashChange) {
      newErrors.cashChange = 'Informe o valor para troco';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top of form or focus
      const el = document.getElementById('checkout-form');
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setErrors({});

    // Populate order object
    const createdOrder: Order = {
      id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
      address: {
        fullName,
        phone,
        street,
        number,
        neighborhood,
        referenceNotes
      },
      paymentMethod,
      paymentDetails: paymentMethod === 'cash' && needsChange ? { cashChange } : undefined,
      status: 'received',
      createdAt: new Date().toISOString()
    };

    onPlaceOrder(createdOrder);
  };

  const formatPhone = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const formatCardNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiry = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  };

  return (
    <div id="checkout-view" className="p-4 flex flex-col gap-5 text-white">
      
      {/* Checkout lead navbar */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-neutral-100 tracking-tight">Finalizar Pedido</h1>
          <p className="text-xs text-neutral-400">Insira as informações de envio e pagamento.</p>
        </div>
        <button
          id="btn-back-checkout"
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-orange-500 hover:text-orange-600 cursor-pointer outline-none"
        >
          Voltar ao Carrinho
        </button>
      </div>

      {/* Main Delivery, Payment & Summary Layout */}
      <form id="checkout-form" onSubmit={validateAndSubmit} className="flex flex-col gap-5 select-none">
        
        {/* Module A: Address info details */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5 border-b border-neutral-800/60 pb-1.5">
            <Truck size={14} /> Endereço de Entrega
          </h3>

          <div className="flex flex-col gap-3.5">
            {/* Full Name input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="input-fullname" className="text-xs text-neutral-300 font-bold">Quem receberá o pedido? *</label>
              <input
                id="input-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Exemplo: Maria Souza de Oliveira"
                className="w-full h-10 rounded-xl px-3 bg-neutral-950 text-xs border border-neutral-850 focus:outline-none focus:border-orange-500 transition-all text-neutral-100 placeholder-neutral-550"
              />
              {errors.fullName && <span className="text-[10px] text-red-500 font-extrabold">{errors.fullName}</span>}
            </div>

            {/* Custom Phone with mask */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="input-phone" className="text-xs text-neutral-300 font-bold">Telefone com DDD *</label>
              <input
                id="input-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(11) 98765-4321"
                className="w-full h-10 rounded-xl px-3 bg-neutral-950 text-xs border border-neutral-850 focus:outline-none focus:border-orange-500 transition-all text-neutral-100 placeholder-neutral-550"
              />
              {errors.phone && <span className="text-[10px] text-red-500 font-extrabold">{errors.phone}</span>}
            </div>

            {/* Street Address & Number Row */}
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3 flex flex-col gap-1.5">
                <label htmlFor="input-street" className="text-xs text-neutral-300 font-bold">Rua / Avenida *</label>
                <input
                  id="input-street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Ex: Rua das Flores"
                  className="w-full h-10 rounded-xl px-3 bg-neutral-950 text-xs border border-neutral-850 focus:outline-none focus:border-orange-500 transition-all text-neutral-100 placeholder-neutral-550"
                />
                {errors.street && <span className="text-[10px] text-red-500 font-extrabold">{errors.street}</span>}
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label htmlFor="input-number" className="text-xs text-neutral-300 font-bold">Nº *</label>
                <input
                  id="input-number"
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="204"
                  className="w-full h-10 rounded-xl px-3 bg-neutral-950 text-xs border border-neutral-850 focus:outline-none focus:border-orange-500 transition-all text-neutral-100 placeholder-neutral-550"
                />
                {errors.number && <span className="text-[10px] text-red-500 font-extrabold">{errors.number}</span>}
              </div>
            </div>

            {/* Neighborhood input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="input-neighborhood" className="text-xs text-neutral-300 font-bold">Bairro *</label>
              <input
                id="input-neighborhood"
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Exemplo: Centro rústico"
                className="w-full h-10 rounded-xl px-3 bg-neutral-950 text-xs border border-neutral-850 focus:outline-none focus:border-orange-500 transition-all text-neutral-100 placeholder-neutral-550"
              />
              {errors.neighborhood && <span className="text-[10px] text-red-500 font-extrabold">{errors.neighborhood}</span>}
            </div>

            {/* Complement / Reference notes */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="input-referencenotes" className="text-xs text-neutral-300 font-bold">Complemento / Ponto de Referência</label>
              <input
                id="input-referencenotes"
                type="text"
                value={referenceNotes}
                onChange={(e) => setReferenceNotes(e.target.value)}
                placeholder="Ex: Apt 42 Bloco B, ao lado do mercado Central"
                className="w-full h-10 rounded-xl px-3 bg-neutral-950 text-xs border border-neutral-850 focus:outline-none focus:border-orange-500 transition-all text-neutral-100 placeholder-neutral-550"
              />
            </div>
          </div>
        </div>

        {/* Module B: Payment Selector interface */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5 border-b border-neutral-800/60 pb-1.5">
            <CreditCard size={14} /> Método de Pagamento
          </h3>

          {/* Interactive grid for payment selection */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <button
              id="payment-tab-card"
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs gap-1.5 font-bold transition-all cursor-pointer ${
                paymentMethod === 'card'
                  ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-black'
                  : 'bg-neutral-950 border-neutral-850 text-neutral-400'
              }`}
            >
              <CreditCard size={16} />
              <span>Cartão</span>
            </button>

            <button
              id="payment-tab-pix"
              type="button"
              onClick={() => setPaymentMethod('pix')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs gap-1.5 font-bold transition-all cursor-pointer ${
                paymentMethod === 'pix'
                  ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-black'
                  : 'bg-neutral-950 border-neutral-850 text-neutral-400'
              }`}
            >
              <Landmark size={16} />
              <span>PIX⚡</span>
            </button>

            <button
              id="payment-tab-cash"
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs gap-1.5 font-bold transition-all cursor-pointer ${
                paymentMethod === 'cash'
                  ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-black'
                  : 'bg-neutral-950 border-neutral-850 text-neutral-400'
              }`}
            >
              <DollarSign size={16} />
              <span>Dinheiro</span>
            </button>
          </div>

          {/* Expanded detail based on selection */}
          <div className="mt-2 text-xs">
            {/* payment: Credit Card */}
            {paymentMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-850"
              >
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-cardnumber" className="text-[10px] text-neutral-400 font-bold uppercase">Número do Cartão *</label>
                  <input
                    id="input-cardnumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full h-9 rounded-lg px-2.5 bg-neutral-900 border border-neutral-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-0 text-white"
                  />
                  {errors.cardNumber && <span className="text-[10px] text-red-500 font-extrabold">{errors.cardNumber}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="input-cardholder" className="text-[10px] text-neutral-400 font-bold uppercase">Nome no Cartão *</label>
                  <input
                    id="input-cardholder"
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="JOÃO O SILVA"
                    className="w-full h-9 rounded-lg px-2.5 bg-neutral-900 border border-neutral-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-0 text-white"
                  />
                  {errors.cardHolder && <span className="text-[10px] text-red-500 font-extrabold">{errors.cardHolder}</span>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-cardexpiry" className="text-[10px] text-neutral-400 font-bold uppercase">Validade *</label>
                    <input
                      id="input-cardexpiry"
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full h-9 rounded-lg px-2.5 bg-neutral-900 border border-neutral-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-0 text-white text-center"
                    />
                    {errors.cardExpiry && <span className="text-[10px] text-red-500 font-extrabold">{errors.cardExpiry}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-cardcvv" className="text-[10px] text-neutral-400 font-bold uppercase">CVV *</label>
                    <input
                      id="input-cardcvv"
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full h-9 rounded-lg px-2.5 bg-neutral-900 border border-neutral-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-0 text-white text-center"
                    />
                    {errors.cardCvv && <span className="text-[10px] text-red-500 font-extrabold">{errors.cardCvv}</span>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* payment: PIX */}
            {paymentMethod === 'pix' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850 flex flex-col items-center text-center gap-3"
              >
                {/* Fake QR code visualization */}
                <div className="w-24 h-24 bg-white rounded-lg p-1.5 flex items-center justify-center select-none shadow">
                  <svg className="w-full h-full text-neutral-950" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="100" height="100" fill="none" />
                    {/* Simplified mock QR lines */}
                    <rect x="10" y="10" width="20" height="20" fill="currentColor" />
                    <rect x="15" y="15" width="10" height="10" fill="white" />
                    <rect x="70" y="10" width="20" height="20" fill="currentColor" />
                    <rect x="75" y="15" width="10" height="10" fill="white" />
                    <rect x="10" y="70" width="20" height="20" fill="currentColor" />
                    <rect x="15" y="75" width="10" height="10" fill="white" />
                    {/* Random spots */}
                    <rect x="40" y="10" width="10" height="10" fill="currentColor" />
                    <rect x="40" y="30" width="20" height="10" fill="currentColor" />
                    <rect x="10" y="40" width="10" height="20" fill="currentColor" />
                    <rect x="50" y="45" width="15" height="15" fill="currentColor" />
                    <rect x="70" y="70" width="20" height="10" fill="currentColor" />
                    <rect x="80" y="40" width="10" height="20" fill="currentColor" />
                    <rect x="45" y="75" width="10" height="15" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-white">Chave Pix Copia-e-Cola Gerada⚡</span>
                  <p className="text-[10px] text-neutral-400 mt-1 max-w-[210px] leading-relaxed">
                    Pagamento Pix tem aprovação instantânea! Seu pedido começará a ser preparado logo após o pagamento.
                  </p>
                </div>
              </motion.div>
            )}

            {/* payment: Cash (Dinheiro) */}
            {paymentMethod === 'cash' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850 flex flex-col gap-3.5"
              >
                <div className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-neutral-300">Precisa de troco para o motorista?</span>
                  <input
                    type="checkbox"
                    checked={needsChange}
                    onChange={(e) => setNeedsChange(e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-orange-500 rounded"
                  />
                </div>

                {needsChange && (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-cash-change" className="text-[10px] text-neutral-400 font-bold uppercase">Troco para quanto? *</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[10px] font-bold text-neutral-500">R$</span>
                      <input
                        id="input-cash-change"
                        type="number"
                        step="0.01"
                        value={cashChange}
                        onChange={(e) => setCashChange(e.target.value)}
                        placeholder="Ex: 50,00 ou 100,00"
                        className="w-full h-9 rounded-lg pl-8 pr-3 bg-neutral-900 border border-neutral-800 text-xs focus:outline-none focus:border-orange-500 text-white"
                      />
                    </div>
                    {errors.cashChange && <span className="text-[10px] text-red-500 font-extrabold">{errors.cashChange}</span>}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Module C: Checkout Summary Breakdown */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5 border-b border-neutral-800/60 pb-1.5">
            <ShoppingBag size={14} /> Resumo do Pedido ({cartItems.length} itens)
          </h3>

          <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto no-scrollbar">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-xs text-neutral-400 py-0.5">
                <span className="line-clamp-1 flex-1 pr-4">
                  {item.quantity}x <strong className="text-neutral-200">{item.product.name}</strong>
                </span>
                <span className="font-bold text-neutral-300">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-neutral-400 pt-2 border-t border-neutral-800/40">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Taxa de Entrega</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-400">Grátis</strong> : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Desconto Cupom ({appliedCoupon})</span>
                <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-black text-white border-t border-neutral-800 pt-2 mt-1">
              <span>Total Geral</span>
              <span className="text-orange-500 text-base">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Secured transaction pledge */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 text-center py-1 bg-neutral-950/20 rounded-xl">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Transação fictícia criptografada para fins de extensão universitária</span>
        </div>

        {/* Submit and checkout confirmation footer CTA */}
        <div className="pt-2">
          <button
            id="btn-submit-final-order"
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-[0.99] transition rounded-2xl text-xs font-black tracking-wider uppercase text-white flex items-center justify-center gap-1.5 cursor-pointer outline-none shadow-md"
          >
            Confirmar e Enviar Pedido <ArrowRight size={14} />
          </button>
        </div>

      </form>
    </div>
  );
}
