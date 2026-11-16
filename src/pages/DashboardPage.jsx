import { useState, useEffect, useMemo } from 'react';
import {
  Droplets,
  Plus,
  TrendingUp,
  CalendarDays,
  CheckCircle2,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { useLogs } from '../hooks/useLogs';
import { getUserProfile, PROFILE_EVENT } from '../services/userService';
import logService from '../services/logService';
import {
  isSameDay,
  getLast7DaysChart,
  getEffectiveHydrationMl,
} from '../utils/helpers';
import HydrationRing from '../components/common/HydrationRing';
import LogCard from '../components/logs/LogCard';
import ConfirmModal from '../components/modals/ConfirmModal';

const QUICK_DRINKS = [
  { name: 'Air Putih', category: 'Air Putih', index: 100 },
  { name: 'Infused Water', category: 'Infused', index: 98 },
  { name: 'Air Kelapa Murni', category: 'Elektrolit', index: 108 },
  { name: 'Teh Hijau Tawar', category: 'Teh', index: 92 },
  { name: 'Susu', category: 'Elektrolit', index: 115 },
  { name: 'Kopi', category: 'Minuman Hangat', index: 80 },
];

const QUICK_AMOUNTS = [
  { label: 'Gelas Kecil', amount: 200 },
  { label: 'Gelas Sedang', amount: 350 },
  { label: 'Botol', amount: 500 },
];

export default function DashboardPage({ onSelectLog, onNavigate }) {
  const { logs, loading } = useLogs();
  const [profile, setProfile] = useState(getUserProfile);
  const [quickToast, setQuickToast] = useState('');
  const [addingAmount, setAddingAmount] = useState(null);
  const [customMl, setCustomMl] = useState('');
  const [selectedDrink, setSelectedDrink] = useState(QUICK_DRINKS[0]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const syncProfile = () => setProfile(getUserProfile());
    window.addEventListener(PROFILE_EVENT, syncProfile);
    return () => window.removeEventListener(PROFILE_EVENT, syncProfile);
  }, []);

  const todayLogs = useMemo(() => {
    const now = new Date();
    return logs.filter((log) => isSameDay(log.consumed_at, now));
  }, [logs]);

  const todayTotalMl = useMemo(
    () => todayLogs.reduce((sum, item) => sum + Number(item.amount_ml || 0), 0),
    [todayLogs]
  );

  const todayHydratedMl = useMemo(
    () => todayLogs.reduce((sum, item) => sum + getEffectiveHydrationMl(item), 0),
    [todayLogs]
  );

  const weeklyChart = useMemo(() => getLast7DaysChart(logs), [logs]);
  const weeklyAverage = useMemo(() => {
    if (!weeklyChart.length) return 0;
    const sum = weeklyChart.reduce((acc, d) => acc + d.totalMl, 0);
    return Math.round(sum / weeklyChart.length);
  }, [weeklyChart]);

  const targetMl = profile.dailyTargetMl || 2200;
  const remainingMl = Math.max(0, targetMl - todayHydratedMl);

  const handleQuickAdd = async (amount) => {
    const validAmount = Math.round(Number(amount));
    if (!validAmount || validAmount < 1 || validAmount > 5000) return;

    const effectiveMl = Math.round(validAmount * (selectedDrink.index / 100));

    setAddingAmount(validAmount);
    try {
      await logService.create({
        beverage_name: selectedDrink.name,
        category: selectedDrink.category,
        amount_ml: validAmount,
        consumed_at: new Date().toISOString(),
        mood: 'Segar',
        notes: `Tambah cepat dari Dashboard (Indeks ${selectedDrink.index}%)`,
      });
      setQuickToast(
        `+${validAmount} ml ${selectedDrink.name} dicatat (${effectiveMl} ml hidrasi efektif)!`
      );
      setTimeout(() => setQuickToast(''), 2800);
    } finally {
      setAddingAmount(null);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    const val = Math.round(Number(customMl));
    if (!val || val < 1 || val > 5000) return;
    await handleQuickAdd(val);
    setCustomMl('');
  };

  const handleResetToday = async () => {
    setResetting(true);
    try {
      await Promise.all(todayLogs.map((log) => logService.remove(log.id)));
      setShowResetModal(false);
      setQuickToast('Catatan minum hari ini berhasil direset ke 0 ml.');
      setTimeout(() => setQuickToast(''), 2800);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Greeting Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-500 text-white p-5 sm:p-6 shadow-lg shadow-sky-200/70">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="w-full md:flex-1 space-y-3 text-center md:text-left">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
                Halo, {profile.username || 'Sahabat Hidrasi'}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm max-w-md mx-auto md:mx-0 mt-1 leading-relaxed">
                {remainingMl === 0
                  ? 'Target hidrasi harianmu sudah tercapai! Pertahankan ritme minum yang sehat.'
                  : `Butuh ${remainingMl.toLocaleString('id-ID')} ml hidrasi lagi untuk capai target hari ini.`}
              </p>
            </div>

            {/* Compact Control Panel: 1) Drink Select + Custom ml, 2) 3 Quick Buttons */}
            <div className="bg-white/15 backdrop-blur-xs border border-white/20 rounded-2xl p-2.5 space-y-2 max-w-md mx-auto md:mx-0">
              <div className="flex items-center gap-2">
                {/* Compact Drink Type Dropdown */}
                <div className="relative flex-1 min-w-0">
                  <select
                    value={selectedDrink.name}
                    onChange={(e) => {
                      const found = QUICK_DRINKS.find((d) => d.name === e.target.value);
                      if (found) setSelectedDrink(found);
                    }}
                    aria-label="Pilih jenis minuman"
                    className="w-full appearance-none bg-white text-sky-800 font-semibold text-xs sm:text-sm pl-3 pr-7 py-2 rounded-xl shadow-xs focus:outline-none cursor-pointer truncate"
                  >
                    {QUICK_DRINKS.map((drink) => (
                      <option key={drink.name} value={drink.name}>
                        {drink.name} ({drink.index}%)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-sky-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Compact Custom ml Input */}
                <form
                  onSubmit={handleCustomSubmit}
                  className="flex items-center bg-white rounded-xl p-0.5 pl-2.5 shadow-xs shrink-0"
                >
                  <input
                    type="number"
                    min={1}
                    max={5000}
                    step="any"
                    value={customMl}
                    onChange={(e) => setCustomMl(e.target.value)}
                    placeholder="ml"
                    aria-label="Volume air custom dalam ml"
                    className="w-12 sm:w-14 text-xs sm:text-sm font-semibold text-sky-800 placeholder:text-sky-400 placeholder:font-normal bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={addingAmount !== null || !customMl}
                    aria-label="Tambah volume custom"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-all cursor-pointer active:scale-95 disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Single-row 3 Quick Add Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {QUICK_AMOUNTS.map((item) => (
                  <button
                    key={item.amount}
                    type="button"
                    disabled={addingAmount !== null}
                    onClick={() => handleQuickAdd(item.amount)}
                    className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                  >
                    <Plus className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>{item.amount} ml</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative bg-white/95 rounded-3xl p-4 shadow-md flex flex-col items-center">
            {todayLogs.length > 0 && (
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                title="Reset catatan hari ini"
                aria-label="Reset catatan hari ini"
                className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-2 py-1 rounded-full transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <HydrationRing currentMl={todayHydratedMl} targetMl={targetMl} />
          </div>
        </div>
      </section>

      {quickToast && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-medium shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {quickToast}
        </div>
      )}

      {/* Summary Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-sky-100 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Droplets className="w-4 h-4 text-sky-500" />
            Terhidrasi Efektif
          </div>
          <p className="text-xl font-bold text-slate-800">
            {todayHydratedMl.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-medium text-slate-400">ml</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Total diminum: {todayTotalMl.toLocaleString('id-ID')} ml
          </p>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <TrendingUp className="w-4 h-4 text-cyan-500" />
            Rata-rata 7 Hari
          </div>
          <p className="text-xl font-bold text-slate-800">
            {weeklyAverage.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-medium text-slate-400">ml</span>
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white border border-sky-100 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <CalendarDays className="w-4 h-4 text-sky-500" />
            Frekuensi Hari Ini
          </div>
          <p className="text-xl font-bold text-slate-800">
            {todayLogs.length}{' '}
            <span className="text-xs font-medium text-slate-400">kali minum</span>
          </p>
        </div>
      </section>

      {/* Today's Clickable Log List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Catatan Hari Ini</h2>
            <p className="text-xs text-slate-500">
              Ketuk item untuk melihat detail, mengedit, atau menghapus catatan
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('History')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
          >
            Lihat Semua →
          </button>
        </div>

        {loading ? (
          <div className="bg-white border border-sky-100 rounded-2xl p-8 text-center text-sm text-slate-400">
            Memuat catatan hidrasi...
          </div>
        ) : todayLogs.length === 0 ? (
          <div className="bg-white border border-sky-100 rounded-2xl p-8 text-center space-y-2">
            <Droplets className="w-8 h-8 text-sky-300 mx-auto" />
            <p className="text-sm font-medium text-slate-600">
              Belum ada catatan minum hari ini.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('Beverages')}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Pilih dari Katalog Minuman
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayLogs.map((log) => (
              <LogCard key={log.id} log={log} onSelect={onSelectLog} />
            ))}
          </div>
        )}
      </section>
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset Catatan Hari Ini"
        message={`Hapus seluruh ${todayLogs.length} catatan minum hari ini (${todayTotalMl.toLocaleString('id-ID')} ml) agar kembali ke 0 ml?`}
        confirmText="Ya, Reset"
        onConfirm={handleResetToday}
        onCancel={() => setShowResetModal(false)}
        isLoading={resetting}
      />
    </div>
  );
}
