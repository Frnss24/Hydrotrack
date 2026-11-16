import { Droplets, ChevronRight } from 'lucide-react';

export default function LogCard({ log, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(log)}
      className="w-full text-left bg-white hover:bg-sky-50/50 border border-sky-100 rounded-2xl px-4 py-3.5 shadow-xs hover:shadow-md hover:border-sky-200 transition-all flex items-center justify-between gap-3 group cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-200">
          <Droplets className="w-5 h-5" />
        </div>
        <h4 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
          {log.beverage_name}
        </h4>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div>
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
