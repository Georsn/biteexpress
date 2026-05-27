import React from 'react';
import { Search, Flame, ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, PROMOTIONS } from '../data/products';
import { motion } from 'motion/react';

interface HomeProps {
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: 'burgers' | 'sides' | 'drinks' | 'desserts') => void;
  onSearchFocus: () => void;
}

export default function Home({ onSelectProduct, onSelectCategory, onSearchFocus }: HomeProps) {
  // Filter popular products for display
  const popularProducts = PRODUCTS.filter((p) => p.isPopular);

  const categories = [
    { id: 'burgers', name: 'Burger', emoji: '🍔' },
    { id: 'sides', name: 'Porções', emoji: '🍟' },
    { id: 'drinks', name: 'Bebidas', emoji: '🥤' },
    { id: 'desserts', name: 'Sobremesas', emoji: '🍰' },
  ] as const;

  return (
    <div id="home-view-container" className="px-4 py-5 flex flex-col gap-6 text-white pb-6">
      
      {/* Visual Greeting Header */}
      <div id="home-user-welcome-section" className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-neutral-400 text-xs">Seja bem-vindo(a) 👋</span>
          <span className="text-lg font-bold text-neutral-100">Pronto para o sabor de hoje?</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center font-bold text-white shadow-md text-sm border-2 border-neutral-900">
          U
        </div>
      </div>

      {/* Styled Interactive Search Button */}
      <div id="home-search-container" className="relative">
        <button
          id="btn-search-trigger"
          type="button"
          onClick={onSearchFocus}
          className="w-full h-12 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition px-5 flex items-center justify-between text-neutral-400 cursor-pointer outline-none"
        >
          <div className="flex items-center gap-3">
            <Search size={18} className="text-orange-500 shrink-0" />
            <span className="text-sm">Encontre seu lanche preferido...</span>
          </div>
          <span className="text-[10px] bg-neutral-800 px-2 py-1 rounded-md text-neutral-500">BUSCAR</span>
        </button>
      </div>

      {/* Promotion Slider Carousel */}
      <div id="promotions-section-wrap" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame size={18} className="text-amber-500 animate-pulse" />
            <h2 className="text-base font-extrabold text-neutral-100 tracking-tight">Promoções Incríveis</h2>
          </div>
          <span className="text-xs text-orange-500 flex items-center gap-0.5 font-semibold cursor-pointer" onClick={() => onSelectCategory('burgers')}>
            Ver tudo <ArrowRight size={12} />
          </span>
        </div>

        <div id="promo-horizontal-scroll" className="flex gap-4 overflow-x-auto no-scrollbar pb-1 snap-x scroll-smooth">
          {PROMOTIONS.map((promo, idx) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={promo.id}
              id={`promo-card-${promo.id}`}
              className="flex-shrink-0 w-[290px] h-[140px] rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-neutral-800 border border-neutral-800/80 overflow-hidden relative shadow-lg snap-start flex p-3 select-none"
            >
              {/* Promo Info */}
              <div className="flex-1 flex flex-col justify-between z-10">
                <div className="flex flex-col">
                  {/* Badge */}
                  <span className="w-fit text-[9px] font-black uppercase text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full mb-1 border border-orange-500/10">
                    {promo.badge}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{promo.title}</h3>
                  <p className="text-[10px] text-neutral-400 line-clamp-2 mt-0.5">{promo.subtitle}</p>
                </div>

                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-lg font-black text-white">
                    R$ {promo.promoPrice.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-neutral-500 line-through">
                    R$ {promo.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Promo Food Image Background overlay */}
              <div className="w-[100px] h-full relative rounded-xl overflow-hidden self-center select-none shadow">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover transition duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Horizontal Fast Choice Categories Grid */}
      <div id="categories-section-wrap" className="flex flex-col gap-3">
        <h2 className="text-base font-extrabold text-neutral-100 tracking-tight">Navegue por Categoria</h2>
        
        <div id="categories-carousel" className="flex gap-3 overflow-x-auto no-scrollbar pb-1 snap-x select-none">
          {categories.map((cat, index) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id={`cat-button-${cat.id}`}
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/30 hover:bg-neutral-900/80 transition-all cursor-pointer snap-start outline-none shadow-sm"
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-xs font-bold text-neutral-200 tracking-tight">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Populares da Semana - Grid List */}
      <div id="popular-section-wrap" className="flex flex-col gap-3">
        <h2 className="text-base font-extrabold text-neutral-100 tracking-tight flex items-center gap-1.5">
          <Star size={16} className="text-orange-500 fill-orange-500" />
          Mais Vendidos da Semana
        </h2>

        <div id="popular-grid-list" className="grid grid-cols-2 gap-3.5">
          {popularProducts.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              id={`popular-item-${product.id}`}
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all p-3 cursor-pointer flex flex-col gap-2 justify-between group h-full shadow-md"
            >
              <div className="flex flex-col gap-2">
                {/* Product Appetizing Image */}
                <div className="aspect-square w-full rounded-xl overflow-hidden relative bg-neutral-950">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Dynamic Badge */}
                  <span className="absolute top-1.5 left-1.5 bg-yellow-500 text-neutral-950 font-black text-[8px] uppercase px-1.5 py-0.5 rounded-full px-2">
                    POPULAR
                  </span>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-xs font-bold text-neutral-200 group-hover:text-amber-500 transition line-clamp-1 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-[9px] text-neutral-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Price and Add btn row */}
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-neutral-800/50">
                <span className="text-xs font-black text-orange-500">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-extrabold text-sm group-hover:bg-orange-600 transition shadow">
                  +
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
