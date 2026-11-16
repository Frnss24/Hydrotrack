import { useState, useMemo, useEffect } from 'react';
import { BarChart3, Search, Droplets, Filter } from 'lucide-react';
import { useLogs } from '../hooks/useLogs';
import { getLast7DaysChart } from '../utils/helpers';
import { getUserProfile, PROFILE_EVENT } from '../services/userService';
import LogCard from '../components/logs/LogCard';

const CATEGORIES = ['Semua', 'Air Putih', 'Air Mineral', 'Infused', 'Elektrolit', 'Teh'];

export default function HistoryPage({ onSelectLog }) {
  const { logs, loading } = useLogs();
  const [profile, setProfile] = useState(getUserProfile);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    const syncProfile = () => setProfile(getUserProfile());
    window.addEventListener(PROFILE_EVENT, syncProfile);
    return () => window.removeEventListener(PROFILE_EVENT, syncProfile);
  }, []);

  const chartData = useMemo(() => getLast7DaysChart(logs), [logs]);
  const targetMl = profile.dailyTargetMl || 2200;
  const maxChartMl = useMemo(() => {
    const peak = Math.max(...chartData.map((d) => d.totalMl), targetMl);
    return peak > 0 ? peak : 2500;
  }, [chartData, targetMl]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchCategory =
        selectedCategory === 'Semua' || log.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        (log.beverage_name || '').toLowerCase().includes(q) ||
        (log.notes || '').toLowerCase().includes(q) ||
        (log.mood || '').toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [logs, selectedCategory, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* 7-Day Hydration Visualization */}
      <section className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 mb-1">
              <BarChart3 className="w-4 h-4" />
              Visualisasi 7 Hari Terakhir
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              Riwayat & Grafik Konsumsi Air
            </h1>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
            Target: {targetMl.toLocaleString('id-ID')} ml/hari
          </span>
        </div>

        <div className="relative pt-4">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44">
            {chartData.map((day) => {
              const heightPct = Math.min(
                100,
                Math.round((day.totalMl / maxChartMl) * 100)
              );
              const reachedTarget = day.totalMl >= targetMl;

              return (
                <div
                  key={day.dateStr}
                  className="flex flex-col items-center justify-end h-full gap-1.5"
                >
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500">
                    {day.totalMl > 0 ? `${day.totalMl}` : '0'}
                  </span>
                  <div className="w-full max-w-[42px] h-28 bg-sky-50 rounded-xl flex items-end overflow-hidden border border-sky-100/80">
                    <div
                      style={{ height: `${Math.max(heightPct, day.totalMl > 0 ? 8 : 0)}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        day.isToday
                          ? 'bg-gradient-to-t from-sky-600 to-cyan-400'
                          : reachedTarget
                            ? 'bg-gradient-to-t from-sky-500 to-sky-300'
                            : 'bg-sky-300/80'
                      }`}
                    />
                  </div>
                  <div className="text-center leading-tight">
                    <span
                      className={`block text-xs font-medium ${
                        day.isToday ? 'text-sky-700 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {day.label}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {day.dateStr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search & Category Filter */}
      <section className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama minuman, catatan, atau mood..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sky-100 rounded-2xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-sky-500 shrink-0" />
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-600 border-sky-100 hover:border-sky-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Clickable History List */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            Semua Catatan ({filteredLogs.length})
          </h2>
          <span className="text-xs text-slate-400">Ketuk item untuk detail</span>
        </div>

        {loading ? (
          <div className="bg-white border border-sky-100 rounded-2xl p-8 text-center text-sm text-slate-400">
            Memuat riwayat konsumsi...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white border border-sky-100 rounded-2xl p-8 text-center space-y-2">
            <Droplets className="w-8 h-8 text-sky-300 mx-auto" />
            <p className="text-sm text-slate-500">
              Tidak ada catatan yang cocok dengan filter saat ini.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredLogs.map((log) => (
              <LogCard
                key={log.id}
                log={log}
                onSelect={onSelectLog}
                showDate
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
