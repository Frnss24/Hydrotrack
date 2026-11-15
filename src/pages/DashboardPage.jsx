import { useState, useEffect, useMemo } from 'react';
import {
  Droplets,
  Plus,
  Sparkles,
  TrendingUp,
  CalendarDays,
  CheckCircle2,
} from 'lucide-react';
import { useLogs } from '../hooks/useLogs';
import { getUserProfile, PROFILE_EVENT } from '../services/userService';
import logService from '../services/logService';
import { isSameDay, getLast7DaysChart } from '../utils/helpers';
import HydrationRing from '../components/common/HydrationRing';
import LogCard from '../components/logs/LogCard';

const QUICK_AMOUNTS = [
  { label: 'Gelas Kecil', amount: 200 },
  { label: 'Gelas Sedang', amount: 350 },
  { label: 'Botol', amount: 500 },
];

export default function DashboardPage({ onSelectLog, onNavigate }) {
  const { logs, loading, isLocal } = useLogs();
  const [profile, setProfile] = useState(getUserProfile);
  const [quickToast, setQuickToast] = useState('');
  const [addingAmount, setAddingAmount] = useState(null);

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

  const weeklyChart = useMemo(() => getLast7DaysChart(logs), [logs]);
  const weeklyAverage = useMemo(() => {
    if (!weeklyChart.length) return 0;
    const sum = weeklyChart.reduce((acc, d) => acc + d.totalMl, 0);
    return Math.round(sum / weeklyChart.length);
  }, [weeklyChart]);

  const targetMl = profile.dailyTargetMl || 2200;
  const remainingMl = Math.max(0, targetMl - todayTotalMl);

  const handleQuickAdd = async (amount) => {
    setAddingAmount(amount);
    try {
      await logService.create({
        beverage_name: 'Air Putih',
        category: 'Air Putih',
        amount_ml: amount,
        consumed_at: new Date().toISOString(),
        mood: 'Segar',
        notes: 'Tambah cepat dari Dashboard',
      });
      setQuickToast(`+${amount} ml air putih berhasil dicatat!`);
      setTimeout(() => setQuickToast(''), 2500);
    } finally {
      setAddingAmount(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Greeting Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-500 text-white p-6 shadow-lg shadow-sky-200/70">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              {isLocal ? 'Mode Lokal Offline-Ready' : 'Terhubung ke API'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Halo, {profile.username || 'Sahabat Hidrasi'}
            </h1>
            <p className="text-sky-100 text-sm max-w-md leading-relaxed">
              {remainingMl === 0
                ? 'Target hidrasi harianmu sudah tercapai! Pertahankan ritme minum yang sehat.'
                : `Kamu butuh ${remainingMl.toLocaleString('id-ID')} ml lagi untuk mencapai target harianmu hari ini.`}
            </p>

            {/* Quick Add Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              {QUICK_AMOUNTS.map((item) => (
                <button
                  key={item.amount}
                  type="button"
                  disabled={addingAmount !== null}
                  onClick={() => handleQuickAdd(item.amount)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  <Plus className="w-4 h-4 text-sky-500" />
                  +{item.amount} ml
                  <span className="hidden sm:inline text-sky-400 font-normal">
                    ({item.label})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/95 rounded-3xl p-4 shadow-md">
            <HydrationRing currentMl={todayTotalMl} targetMl={targetMl} size={172} />
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
            Total Hari Ini
          </div>
          <p className="text-xl font-bold text-slate-800">
            {todayTotalMl.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-medium text-slate-400">ml</span>
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
              onClick={() => onNavigate('LogDrink')}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Catat Minuman Pertama
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
    </div>
  );
}
