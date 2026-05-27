import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Product, CategoryType } from '../types';
import { PRODUCTS } from '../data/products';
import { motion, AnimatePresence } from 'motion/react';

interface MenuProps {
  onSelectProduct: (product: Product) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  shouldFocusSearch: boolean;
  setShouldFocusSearch: (focus: boolean) => void;
}

export default function Menu({
  onSelectProduct,
  selectedCategory,
  setSelectedCategory,
  shouldFocusSearch,
  setShouldFocusSearch
}: MenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Categories list
  const categoriesList = [
    { id: 'burgers', name: 'Burgers', emoji: '🍔' },
    { id: 'sides', name: 'Acompanhamentos', emoji: '🍟' },
    { id: 'drinks', name: 'Bebidas', emoji: '🥤' },
    { id: 'desserts', name: 'Sobremesas', emoji: '🍰' },
  ] as const;

  // Handle focusing search automatically
  useEffect(() => {
    if (shouldFocusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
      setShouldFocusSearch(false);
    }
  }, [shouldFocusSearch, setShouldFocusSearch]);

  // Filter products based on selected category and query
  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="menu-view" className="flex flex-col gap-4 text-white p-4">
      
      {/* Visual Menu Header Title */}
      <div id="menu-header-lead" className="flex flex-col">
        <h1 className="text-xl font-black text-neutral-100 tracking-tight">Nosso Cardápio</h1>
        <p className="text-xs text-neutral-400">Artesanais preparados sob demanda com ingredientes frescos.</p>
      </div>

      {/* Styled Functional Search Bar */}
      <div id="menu-search-wrapper" className="relative flex items-center">
        <input
          ref={searchInputRef}
          id="menu-input-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Busque por burgão, batata ou ingrediente..."
          className="w-full h-11 pl-11 pr-10 rounded-2xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-all shadow-sm"
        />
        <Search size={16} className="absolute left-4 text-neutral-500" />
        
        {searchQuery && (
          <button
            id="btn-clear-search"
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 p-1 rounded-full hover:bg-neutral-800 text-neutral-400 transition"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Interactive Category Swiper Headers */}
      <div id="category-scroller-wrap" className="no-scrollbar overflow-x-auto py-1 flex gap-2 select-none snap-x">
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              id={`tab-select-${cat.id}`}
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 snap-start select-none outline-none ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10 border border-orange-500'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-850 hover:bg-neutral-850'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Title Status */}
      <div id="category-items-count-indicator" className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
        <span>Categoria: <strong className="text-neutral-200">{categoriesList.find((c)=>c.id === selectedCategory)?.name}</strong></span>
        <span>{filteredProducts.length} itens encontrados</span>
      </div>

      {/* Products Render Grid */}
      <div id="menu-items-grid" className="flex flex-col gap-3 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                id={`product-row-${product.id}`}
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="flex gap-3 p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700/80 transition-all cursor-pointer group shadow-sm select-none"
              >
                {/* Appetizing thumbnail */}
                <div className="w-24 h-24 rounded-xl overflow-hidden relative flex-shrink-0 bg-neutral-950">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {product.isPopular && (
                    <span className="absolute top-1 left-1 bg-yellow-500 text-neutral-950 font-black text-[7px] uppercase px-1 py-0.5 rounded shadow-sm">
                      Best-Seller
                    </span>
                  )}
                </div>

                {/* Info Text */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-neutral-100 group-hover:text-amber-500 transition line-clamp-1 leading-tight">
                      {product.name}
                    </h3>
                    
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Compact list of core ingredients */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {product.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                          {ing}
                        </span>
                      ))}
                      {product.ingredients.length > 3 && (
                        <span className="text-[9px] text-neutral-500 font-bold px-0.5">
                          +{product.ingredients.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action trigger */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-800/20">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-neutral-400 tracking-wider font-bold">PREÇO ÚNICO</span>
                      <span className="text-sm font-black text-white">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <span className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold group-hover:bg-orange-600 transition flex items-center gap-1 shadow-md">
                      Adicionar
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div id="menu-search-empty-state" className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <span className="text-4xl">🔍</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-neutral-300">Nenhum lanche encontrado</span>
                <span className="text-xs text-neutral-500 mt-1 max-w-[240px]">
                  Tente alterar a busca ou filtro para obter melhores resultados saborosos.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('burgers');
                }}
                className="mt-2 text-xs bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl hover:bg-neutral-850 text-orange-500 font-bold transition"
              >
                Limpar Busca
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
