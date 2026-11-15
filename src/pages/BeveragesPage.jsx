import { useState, useMemo } from 'react';
import { Search, GlassWater, Heart } from 'lucide-react';
import { useBeverages } from '../hooks/useBeverages';
import { useFavorites } from '../hooks/useFavorites';
import BeverageCard from '../components/beverages/BeverageCard';

const CATEGORIES = ['Semua', 'Favorit', 'Air Putih', 'Air Mineral', 'Infused', 'Elektrolit', 'Teh'];

export default function BeveragesPage({ onSelectBeverage }) {
  const { beverages, loading } = useBeverages();
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredBeverages = useMemo(() => {
    return beverages.filter((bev) => {
      const matchCategory =
        selectedCategory === 'Semua'
          ? true
          : selectedCategory === 'Favorit'
            ? favorites.includes(bev.id)
            : bev.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        (bev.name || '').toLowerCase().includes(q) ||
        (bev.description || '').toLowerCase().includes(q) ||
        (bev.benefits || '').toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [beverages, favorites, selectedCategory, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28 space-y-6">
      <section className="bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-100 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
          <GlassWater className="w-4 h-4" />
          Panduan Hidrasi Sehat
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Katalog Minuman & Indeks Hidrasi
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Pilih minuman untuk melihat manfaat, tips konsumsi, atau catat langsung ke target harianmu.
        </p>
      </section>

      <section className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari minuman (contoh: Infused Water, Air Kelapa)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sky-100 rounded-2xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-600 border-sky-100 hover:border-sky-300'
              }`}
            >
              {category === 'Favorit' && <Heart className="w-3 h-3" />}
              {category}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="bg-white border border-sky-100 rounded-2xl p-8 text-center text-sm text-slate-400">
          Memuat daftar minuman...
        </div>
      ) : filteredBeverages.length === 0 ? (
        <div className="bg-white border border-sky-100 rounded-2xl p-8 text-center text-sm text-slate-500">
          Minuman tidak ditemukan. Coba kata kunci atau kategori lain.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBeverages.map((bev) => (
            <BeverageCard
              key={bev.id}
              beverage={bev}
              onSelect={onSelectBeverage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
