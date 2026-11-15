import { Droplets, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { formatTime, formatDate, truncate } from '../../utils/helpers';

export default function LogCard({ log, onSelect, showDate = false }) {
  const categoryColors = {
    'Air Putih': 'bg-sky-50 text-sky-700 border-sky-200',
    'Air Mineral': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Infused: 'bg-teal-50 text-teal-700 border-teal-200',
    Elektrolit: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Teh: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const badgeStyle =
    categoryColors[log.category] || 'bg-sky-50 text-sky-700 border-sky-200';

  return (
    <button
      type="button"
      onClick={() => onSelect(log)}
      className="w-full text-left bg-white hover:bg-sky-50/50 border border-sky-100 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-sky-200 transition-all flex items-center justify-between gap-3 group cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-200">
          <Droplets className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
              {log.beverage_name}
            </h4>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeStyle}`}
            >
              {log.category || 'Air Putih'}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {showDate
                ? `${formatDate(log.consumed_at)} · ${formatTime(log.consumed_at)}`
                : formatTime(log.consumed_at)}
            </span>
            {log.mood && (
              <span className="inline-flex items-center gap-1 text-sky-600">
                <Sparkles className="w-3 h-3" />
                {log.mood}
              </span>
            )}
          </div>
          {log.notes && (
            <p className="text-xs text-slate-400 mt-1 truncate">
              {truncate(log.notes, 55)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <span className="text-base sm:text-lg font-bold text-sky-600">
            +{log.amount_ml}
          </span>
          <span className="text-xs text-slate-400 ml-0.5">ml</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  );
}
