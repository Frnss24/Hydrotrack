import { GlassWater, ChevronRight, Sparkles } from 'lucide-react';
import FavoriteButton from '../common/FavoriteButton';
import { truncate } from '../../utils/helpers';

export default function BeverageCard({ beverage, onSelect }) {
  return (
    <div
      onClick={() => onSelect(beverage)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(beverage);
        }
      }}
      className="bg-white hover:bg-sky-50/40 border border-sky-100 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-sky-200 transition-all cursor-pointer flex flex-col justify-between gap-3 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-600 flex items-center justify-center shrink-0 border border-sky-200/70">
            <GlassWater className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="inline-block text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full mb-1">
              {beverage.category}
            </span>
            <h3 className="font-bold text-slate-800 text-base truncate">
              {beverage.name}
            </h3>
          </div>
        </div>
        <FavoriteButton beverageId={beverage.id} size="sm" />
      </div>

      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
        {truncate(beverage.description || beverage.benefits, 90)}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-sky-50 text-xs">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-semibold text-sky-600">
            <Sparkles className="w-3.5 h-3.5" />
            Indeks {beverage.hydration_index ?? 100}%
          </span>
          <span className="text-slate-400">
            Saran: {beverage.recommended_ml ?? 250} ml
          </span>
        </div>
        <span className="inline-flex items-center gap-0.5 font-semibold text-sky-600 group-hover:translate-x-0.5 transition-transform">
          Detail
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
