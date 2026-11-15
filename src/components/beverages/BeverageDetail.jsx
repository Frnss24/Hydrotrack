import { useState } from 'react';
import {
  ArrowLeft,
  GlassWater,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  PlusCircle,
} from 'lucide-react';
import FavoriteButton from '../common/FavoriteButton';
import logService from '../../services/logService';

export default function BeverageDetail({ beverage, onBack, onLogged }) {
  const [logging, setLogging] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  if (!beverage) return null;

  const recommendedMl = beverage.recommended_ml || 250;

  const handleQuickLog = async () => {
    setLogging(true);
    try {
      await logService.create({
        beverage_name: beverage.name,
        category: beverage.category,
        amount_ml: recommendedMl,
        consumed_at: new Date().toISOString(),
        mood: 'Segar',
        notes: `Dicatat cepat dari panduan ${beverage.name}`,
      });
      setLoggedSuccess(true);
      setTimeout(() => {
        setLoggedSuccess(false);
        if (onLogged) onLogged();
      }, 900);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-900 bg-white border border-sky-100 px-3.5 py-2 rounded-xl shadow-xs mb-5 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Minuman
      </button>

      <div className="bg-white rounded-3xl border border-sky-100 shadow-lg shadow-sky-100/60 overflow-hidden">
        <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-500 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <GlassWater className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="inline-block text-xs font-medium bg-white/20 px-2.5 py-0.5 rounded-full mb-1.5">
                  {beverage.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold">{beverage.name}</h1>
              </div>
            </div>
            <FavoriteButton beverageId={beverage.id} size="lg" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3">
              <div className="text-xs text-sky-100">Indeks Hidrasi</div>
              <div className="text-xl font-bold flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-4 h-4" />
                {beverage.hydration_index ?? 100}%
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3">
              <div className="text-xs text-sky-100">Takaran Disarankan</div>
              <div className="text-xl font-bold mt-0.5">{recommendedMl} ml</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Tentang Minuman
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {beverage.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-sky-800">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              Manfaat Utama
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {beverage.benefits}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-900">
              <Lightbulb className="w-4 h-4 text-cyan-600" />
              Tips Konsumsi
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {beverage.tips || 'Minum secara bertahap sepanjang hari untuk penyerapan optimal.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickLog}
            disabled={logging || loggedSuccess}
            className={`w-full py-3.5 px-5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              loggedSuccess
                ? 'bg-emerald-500 text-white shadow-emerald-200'
                : 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-sky-200'
            }`}
          >
            {loggedSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Berhasil Dicatat (+{recommendedMl} ml)
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                {logging
                  ? 'Mencatat...'
                  : `Catat Minuman Ini (+${recommendedMl} ml)`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
