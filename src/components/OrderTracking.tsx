import React, { useState, useEffect } from 'react';
import { CheckCircle2, Flame, Truck, CheckSquare, Clock, MapPin, CreditCard, ChevronRight, Activity, Database } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { isSupabaseConfigured } from '../lib/supabase';

function SupabaseIntegrationGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlCode = `-- 1. Criar a tabela de Pedidos (orders)
create table public.orders (
  id text not null primary key,
  items jsonb not null,
  subtotal numeric not null,
  "deliveryFee" numeric not null,
  total numeric not null,
  address jsonb not null,
  "paymentMethod" text not null,
  "paymentDetails" jsonb,
  status text not null,
  "createdAt" timestamp with time zone not null default now()
);

-- 2. Habilitar segurança Row Level Security (RLS)
alter table public.orders enable row level security;

-- 3. Criar políticas para permitir acessos públicos rápidos
create policy "Acesso livre insert" on public.orders for insert with check (true);
create policy "Acesso livre select" on public.orders for select using (true);
create policy "Acesso livre update" on public.orders for update using (true);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div id="supabase-integration-panel" className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col gap-3 text-left w-full">
      <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
        <div className="flex items-center gap-1.5">
          <Database size={15} className={isSupabaseConfigured ? "text-emerald-400" : "text-amber-500 animate-pulse"} />
          <div className="flex flex-col">
            <span className="text-[10px] text-white font-extrabold uppercase tracking-wide">Banco Supabase</span>
            <span className="text-[9px] text-neutral-400">
              {isSupabaseConfigured ? "🟢 Conectado ao Banco Real" : "🟡 Modo Simulação Local (Offline)"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[10px] font-bold text-orange-500 hover:text-orange-450 px-2 py-0.5 rounded-lg bg-neutral-950/70 cursor-pointer outline-none"
        >
          {isOpen ? "Ocultar Guia" : "Configurar Banco"}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-neutral-300 flex flex-col gap-3 pt-1 select-text overflow-hidden"
        >
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Passo 1: Criar Tabela no Supabase</h4>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              No seu painel do Supabase, vá em <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, cole o código abaixo e clique em <strong>Run</strong>:
            </p>
            <div className="relative mt-1">
              <pre className="p-2 bg-neutral-950 rounded-xl font-mono text-[9px] text-zinc-300 overflow-x-auto max-h-36 leading-normal border border-neutral-850">
                {sqlCode}
              </pre>
              <button
                type="button"
                onClick={copyToClipboard}
                className="absolute top-1.5 right-1.5 bg-neutral-900 text-neutral-400 hover:text-white px-2 py-1 rounded text-[8px] font-black transition-all cursor-pointer"
              >
                {copiedSql ? "Copiado!" : "Copiar SQL"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-neutral-850 pt-2.5">
            <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Passo 2: Configurar no Vercel</h4>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              Na página do seu projeto no <strong>Vercel &gt; Settings &gt; Environment Variables</strong>, adicione estas variáveis:
            </p>
            <div className="flex flex-col gap-1.5 font-mono text-[9px] bg-neutral-950 p-2 rounded-xl border border-neutral-850 leading-relaxed text-zinc-400">
              <div>
                <span className="text-orange-500 font-bold">VITE_SUPABASE_URL</span>: URL do Supabase Project (ex: https://xxx.supabase.co)
              </div>
              <div>
                <span className="text-orange-500 font-bold">VITE_SUPABASE_ANON_KEY</span>: Chave anônima public/anon do projeto
              </div>
            </div>
            <p className="text-[9px] text-zinc-500 leading-normal font-semibold">
              💡 Importante: Após salvar as variáveis no Vercel, realize um novo deploy para carregar as chaves!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface OrderTrackingProps {
  order: Order | null;
  onUpdateStatus: (status: OrderStatus) => void;
  onResetOrder: () => void;
}

export default function OrderTracking({
  order,
  onUpdateStatus,
  onResetOrder
}: OrderTrackingProps) {
  const [autoSimulate, setAutoSimulate] = useState(true);
  const [etaMinutes, setEtaMinutes] = useState(25);

  const stepsList: { id: OrderStatus; label: string; desc: string; icon: string; bg: string; color: string; eta: number }[] = [
    {
      id: 'received',
      label: 'Pedido Recebido',
      desc: 'O restaurante registrou sua comanda com sucesso.',
      icon: '📝',
      bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      color: 'indigo-500',
      eta: 25
    },
    {
      id: 'preparing',
      label: 'Em Preparação',
      desc: 'O chef já acendeu a chapa e está montando o seu lanche.',
      icon: '🔥',
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
      color: 'amber-500',
      eta: 18
    },
    {
      id: 'delivery',
      label: 'Saiu para Entrega',
      desc: 'O motoboy coletou a encomenda e voou em sua direção.',
      icon: '🏍️',
      bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      color: 'blue-500',
      eta: 8
    },
    {
      id: 'delivered',
      label: 'Entregue com Sucesso',
      desc: 'Chegou bem quentinho! Já pode saborear.',
      icon: '🎉',
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      color: 'emerald-500',
      eta: 0
    }
  ];

  const currentStepIndex = order ? stepsList.findIndex((s) => s.id === order.status) : 0;

  // Timed Simulator Effect (advances status every 8 seconds for display/demo if allowed)
  useEffect(() => {
    if (!order || !autoSimulate) return;

    const timer = setInterval(() => {
      if (order.status === 'received') {
        onUpdateStatus('preparing');
        setEtaMinutes(18);
      } else if (order.status === 'preparing') {
        onUpdateStatus('delivery');
        setEtaMinutes(8);
      } else if (order.status === 'delivery') {
        onUpdateStatus('delivered');
        setEtaMinutes(0);
        setAutoSimulate(false); // Stop when fully delivered
      }
    }, 15000); // 15 seconds per stage change

    return () => clearInterval(timer);
  }, [order, autoSimulate, onUpdateStatus]);

  if (!order) {
    return (
      <div id="no-order-active" className="p-4 text-white flex flex-col items-center justify-start text-center gap-5 py-6">
        <SupabaseIntegrationGuide />

        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <span className="text-5xl">🛵</span>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-neutral-300">Nenhum pedido ativo no momento</span>
            <span className="text-xs text-neutral-550 max-w-[220px]">
              Navegue pelo nosso cardápio e faça sua primeira compra para acompanhar o status por aqui!
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Active status step summary
  const activeStep = stepsList[currentStepIndex];

  return (
    <div id="tracking-view" className="p-4 flex flex-col gap-5 text-white select-none pb-10">
      
      {/* Tracking header metadata */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-900 shrink-0">
        <div className="flex flex-col">
          <span className="text-neutral-500 text-[10px] tracking-widest font-black uppercase">CÓDIGO DE RASTREIO</span>
          <h1 className="text-base font-black text-white">{order.id}</h1>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-xl text-neutral-400 text-[10px] font-bold">
          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Supabase status display in active order page */}
      <SupabaseIntegrationGuide />

      {/* ETA countdown box card */}
      <div id="eta-countdown-card" className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col gap-3 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />

        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest leading-none">PREVISÃO DE ENTREGA</span>
            {etaMinutes > 0 ? (
              <span className="text-2xl font-black text-amber-500 mt-1">
                {etaMinutes} - {etaMinutes + 8} <strong className="text-xs font-bold text-neutral-200">minutos</strong>
              </span>
            ) : (
              <span className="text-2xl font-black text-emerald-400 mt-1">Entregue! 🎉</span>
            )}
          </div>
          <span className="text-3xl">{activeStep.icon}</span>
        </div>

        {/* Unified progress gauge builder */}
        <div className="flex flex-col gap-1 z-10 pt-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Progresso da Entrega</span>
            <span className="text-neutral-200 font-bold">{Math.round(((currentStepIndex + 1) / stepsList.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / stepsList.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Toggle dynamic tracking simulated checkbox */}
        <div className="flex items-center justify-between bg-neutral-950/40 p-2.5 rounded-xl text-[10px] text-neutral-500 border border-neutral-850/50 mt-1.5">
          <span className="flex items-center gap-1">
            <Activity size={12} className="text-orange-500 shrink-0" />
            Avanço automático (Demo: 15s)
          </span>
          <input
            type="checkbox"
            checked={autoSimulate}
            onChange={(e) => setAutoSimulate(e.target.checked)}
            className="w-3.5 h-3.5 cursor-pointer accent-orange-500 rounded"
          />
        </div>
      </div>

      {/* Rastreamento Timeline vertical checklist */}
      <div id="tracking-timeline-box" className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col gap-5 relative">
        <h3 className="text-xs font-black uppercase text-neutral-300 tracking-wider">
          Acompanhamento em Tempo Real
        </h3>

        <div className="flex flex-col relative pl-3">
          
          {/* Vertical axis line */}
          <div className="absolute left-6 top-3 bottom-8 w-0.5 bg-neutral-800" />

          {stepsList.map((step, idx) => {
            const isDone = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={idx} className="flex gap-4 pb-6 last:pb-1 relative items-start group">
                
                {/* Timeline status point */}
                <div className="z-10 flex-shrink-0">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-orange-500/10">
                      ✓
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-neutral-950 border-2 border-neutral-800 flex items-center justify-center text-neutral-600 text-[10px] font-bold">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Checklist text instructions */}
                <div className={`flex flex-col gap-0.5 flex-1 transition-all ${isDone ? 'opacity-100' : 'opacity-40'}`}>
                  <span className={`text-xs font-black tracking-tight ${isCurrent ? 'text-amber-500' : isDone ? 'text-neutral-200' : 'text-neutral-500'}`}>
                    {step.label} {isCurrent && '●'}
                  </span>
                  <p className="text-[10px] text-neutral-400 leading-normal font-medium pr-1">
                    {step.desc}
                  </p>
                </div>

                {/* Icon Emoji indicator tag */}
                <span className="text-base select-none shrink-0 pr-1">{step.icon}</span>

              </div>
            );
          })}

        </div>
      </div>

      {/* Demonstration Control Panel Dashboard */}
      <div id="simulation-panel-card" className="p-4 rounded-3xl bg-neutral-900/65 border border-dashed border-neutral-800 flex flex-col gap-3">
        <div className="flex flex-col gap-1 border-b border-neutral-850 pb-2">
          <span className="text-[10px] text-orange-500 font-extrabold uppercase tracking-wide">Simulação de status do pedido</span>
          <p className="text-[10px] text-neutral-400">Instruções: clique para testar as transições e simular a alteração dos status.</p>
        </div>

        <div className="grid grid-cols-4 gap-1.5 select-none">
          {stepsList.map((step) => {
            const isActive = order.status === step.id;
            return (
              <button
                type="button"
                id={`simulate-btn-${step.id}`}
                key={step.id}
                onClick={() => {
                  onUpdateStatus(step.id);
                  setEtaMinutes(step.eta);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-[9px] font-extrabold gap-1 transition active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                    : 'bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white'
                }`}
              >
                <span className="text-sm">{step.icon}</span>
                <span>{step.id === 'received' ? 'Recebido' : step.id === 'preparing' ? 'Preparo' : step.id === 'delivery' ? 'Enviado' : 'Entregue'}</span>
              </button>
            );
          })}
        </div>

        {/* Clear simulate to start another order */}
        {order.status === 'delivered' && (
          <button
            id="btn-restart-simulation"
            type="button"
            onClick={onResetOrder}
            className="w-full h-9 mt-1 bg-emerald-500 text-neutral-950 font-extrabold text-[10px] tracking-widest uppercase rounded-xl hover:bg-emerald-600 transition flex items-center justify-center gap-1.5 cursor-pointer outline-none shadow"
          >
            Fazer Novo Pedido <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Info details map card */}
      <div id="tracking-address-card" className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase text-neutral-300 tracking-wider">
          Resumo de Entrega
        </h3>

        <div className="flex flex-col gap-3">
          {/* Destination location metadata */}
          <div className="flex items-start gap-2.5">
            <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
            <div className="flex flex-col text-[11px] text-neutral-400 leading-normal">
              <span className="text-neutral-200 font-bold">Destino de entrega:</span>
              <span>{order.address.fullName} - {order.address.phone}</span>
              <span>{order.address.street}, {order.address.number}</span>
              <span>{order.address.neighborhood}</span>
              {order.address.referenceNotes && <span className="italic text-[10px] text-neutral-500 mt-0.5">Obs: "{order.address.referenceNotes}"</span>}
            </div>
          </div>

          {/* Payment receipt confirmation metadata */}
          <div className="flex items-start gap-2.5 pt-2 border-t border-neutral-850">
            <CreditCard size={14} className="text-orange-500 shrink-0 mt-0.5" />
            <div className="flex flex-col text-[11px] text-neutral-400">
              <span className="text-neutral-200 font-bold">Método / Financiamento:</span>
              <span className="uppercase font-semibold text-neutral-300">
                {order.paymentMethod === 'card' ? '💳 Cartão de Crédito (Virtual)' :
                 order.paymentMethod === 'pix' ? '⚡ PIX Instantâneo' :
                 '💵 Dinheiro na Entrega'}
              </span>
              {order.paymentDetails?.cashChange && (
                <span className="text-[10px] text-amber-500">Troco solicitado para R$ {parseFloat(order.paymentDetails.cashChange).toFixed(2).replace('.', ',')}</span>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
