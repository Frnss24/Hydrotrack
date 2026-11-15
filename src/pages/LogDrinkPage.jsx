import { useState, useEffect } from 'react';
import { Droplets, CheckCircle2, Save, RotateCcw } from 'lucide-react';
import logService from '../services/logService';
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  getDraftTimestamp,
  formatDraftTime,
} from '../utils/draftStorage';

const BEVERAGE_OPTIONS = [
  { name: 'Air Putih', category: 'Air Putih' },
  { name: 'Air Mineral', category: 'Air Mineral' },
  { name: 'Infused Water Lemon', category: 'Infused' },
  { name: 'Air Kelapa Murni', category: 'Elektrolit' },
  { name: 'Teh Hijau Tawar', category: 'Teh' },
  { name: 'Minuman Isotonik', category: 'Elektrolit' },
];

const AMOUNT_PRESETS = [150, 200, 250, 350, 500, 750, 1000];
const MOODS = ['Segar', 'Berenergi', 'Haus', 'Santai', 'Setelah Olahraga'];

const DEFAULT_FORM = {
  beverage_name: 'Air Putih',
  category: 'Air Putih',
  amount_ml: 250,
  mood: 'Segar',
  notes: '',
};

export default function LogDrinkPage({ onSuccess }) {
  const [form, setForm] = useState(() => loadDraft('log_drink') || DEFAULT_FORM);
  const [draftTime, setDraftTime] = useState(() => getDraftTimestamp('log_drink'));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    saveDraft(form, 'log_drink');
    setDraftTime(getDraftTimestamp('log_drink'));
  }, [form]);

  const handleSelectBeverage = (bev) => {
    setForm((prev) => ({
      ...prev,
      beverage_name: bev.name,
      category: bev.category,
    }));
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    deleteDraft('log_drink');
    setDraftTime(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = Number(form.amount_ml);

    if (!form.beverage_name.trim()) {
      setError('Nama minuman wajib diisi.');
      return;
    }
    if (!numericAmount || numericAmount < 10 || numericAmount > 5000) {
      setError('Volume air harus antara 10 ml hingga 5000 ml.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await logService.create({
        beverage_name: form.beverage_name.trim(),
        category: form.category || 'Air Putih',
        amount_ml: numericAmount,
        consumed_at: new Date().toISOString(),
        mood: form.mood,
        notes: form.notes.trim(),
      });

      deleteDraft('log_drink');
      setForm(DEFAULT_FORM);
      setSuccessMsg(`Berhasil mencatat +${numericAmount} ml ${form.beverage_name}!`);
      setTimeout(() => {
        setSuccessMsg('');
        if (onSuccess) onSuccess();
      }, 900);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan catatan minum.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-5">
      <section className="bg-gradient-to-br from-sky-500 to-cyan-500 rounded-3xl p-6 text-white shadow-md shadow-sky-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Droplets className="w-6 h-6" />
              Catat Konsumsi Minum
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm mt-1">
              Draft otomatis tersimpan di perangkat agar tidak hilang saat berpindah halaman.
            </p>
          </div>
          {draftTime && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-white/20 px-2.5 py-1 rounded-full">
              <Save className="w-3 h-3" />
              {formatDraftTime(draftTime)}
            </span>
          )}
        </div>
      </section>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5"
      >
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Pilih Jenis Minuman
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {BEVERAGE_OPTIONS.map((bev) => (
              <button
                key={bev.name}
                type="button"
                onClick={() => handleSelectBeverage(bev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  form.beverage_name === bev.name
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100'
                }`}
              >
                {bev.name}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={form.beverage_name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, beverage_name: e.target.value }))
            }
            placeholder="Atau ketik nama minuman..."
            className="w-full px-4 py-2.5 rounded-xl border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Volume Air (ml)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {AMOUNT_PRESETS.map((ml) => (
              <button
                key={ml}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, amount_ml: ml }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  Number(form.amount_ml) === ml
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                }`}
              >
                {ml} ml
              </button>
            ))}
          </div>
          <input
            type="number"
            min={10}
            max={5000}
            value={form.amount_ml}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, amount_ml: e.target.value }))
            }
            className="w-full px-4 py-2.5 rounded-xl border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Kondisi / Mood Saat Minum
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, mood }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  form.mood === mood
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Contoh: Minum sebelum kelas pagi..."
            className="w-full px-4 py-2.5 rounded-xl border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold text-sm shadow-md shadow-sky-200 transition-all cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Catatan Minum'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Reset Form"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
