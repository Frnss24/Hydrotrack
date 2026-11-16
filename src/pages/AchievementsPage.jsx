import { useMemo, useState, useEffect } from 'react';
import {
  Award,
  Flame,
  Trophy,
  Droplets,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useLogs } from '../hooks/useLogs';
import { getUserProfile, PROFILE_EVENT } from '../services/userService';
import { getEffectiveHydrationMl } from '../utils/helpers';

function getLocalDateKey(dateInput) {
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export default function AchievementsPage() {
  const { logs, loading } = useLogs();
  const [profile, setProfile] = useState(getUserProfile);

  useEffect(() => {
    const syncProfile = () => setProfile(getUserProfile());
    window.addEventListener(PROFILE_EVENT, syncProfile);
    return () => window.removeEventListener(PROFILE_EVENT, syncProfile);
  }, []);

  const targetMl = profile.dailyTargetMl || 2100;

  const stats = useMemo(() => {
    const dailyTotals = {};
    let totalEffectiveMl = 0;
    let hasElectrolyte = false;
    let hasEarlyMorning = false;

    const timeSlots = {
      Pagi: 0, // 05:00 - 10:59
      Siang: 0, // 11:00 - 14:59
      Sore: 0, // 15:00 - 18:59
      Malam: 0, // 19:00 - 04:59
    };

    logs.forEach((log) => {
      const effective = getEffectiveHydrationMl(log);
      totalEffectiveMl += effective;

      const key = getLocalDateKey(log.consumed_at);
      if (key) {
        dailyTotals[key] = (dailyTotals[key] || 0) + effective;
      }

      const catText = `${log.beverage_name || ''} ${log.category || ''}`.toLowerCase();
      if (
        catText.includes('kelapa') ||
        catText.includes('elektrolit') ||
        catText.includes('isotonik') ||
        catText.includes('susu')
      ) {
        hasElectrolyte = true;
      }

      const d = new Date(log.consumed_at);
      if (!Number.isNaN(d.getTime())) {
        const h = d.getHours();
        if (h >= 5 && h < 8) hasEarlyMorning = true;
        if (h >= 5 && h < 11) timeSlots.Pagi += 1;
        else if (h >= 11 && h < 15) timeSlots.Siang += 1;
        else if (h >= 15 && h < 19) timeSlots.Sore += 1;
        else timeSlots.Malam += 1;
      }
    });

    const daysMetTarget = Object.values(dailyTotals).filter(
      (ml) => ml >= targetMl
    ).length;

    // Calculate current streak ending today (or yesterday if today hasn't met target yet)
    let currentStreak = 0;
    const cursor = new Date();
    const todayKey = getLocalDateKey(cursor);
    if ((dailyTotals[todayKey] || 0) < targetMl) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (true) {
      const k = getLocalDateKey(cursor);
      if ((dailyTotals[k] || 0) >= targetMl) {
        currentStreak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate best streak across all recorded dates
    const sortedKeys = Object.keys(dailyTotals).sort();
    let bestStreak = 0;
    let running = 0;
    let prevDate = null;

    sortedKeys.forEach((key) => {
      if (dailyTotals[key] >= targetMl) {
        const curDate = new Date(`${key}T00:00:00`);
        if (
          prevDate &&
          Math.round((curDate - prevDate) / (1000 * 60 * 60 * 24)) === 1
        ) {
          running += 1;
        } else {
          running = 1;
        }
        bestStreak = Math.max(bestStreak, running);
        prevDate = curDate;
      } else {
        running = 0;
        prevDate = null;
      }
    });

    bestStreak = Math.max(bestStreak, currentStreak);

    const maxSlotCount = Math.max(1, ...Object.values(timeSlots));
    const favoriteSlot = Object.entries(timeSlots).sort((a, b) => b[1] - a[1])[0];

    return {
      currentStreak,
      bestStreak,
      daysMetTarget,
      totalLogs: logs.length,
      totalEffectiveMl,
      hasElectrolyte,
      hasEarlyMorning,
      timeSlots,
      maxSlotCount,
      favoriteSlot: favoriteSlot && favoriteSlot[1] > 0 ? favoriteSlot[0] : null,
    };
  }, [logs, targetMl]);

  const badges = [
    {
      id: 'first-drop',
      title: 'First Drop',
      desc: 'Mencatat konsumsi air pertama kali.',
      unlocked: stats.totalLogs >= 1,
      progress: `${Math.min(stats.totalLogs, 1)}/1 catatan`,
      Icon: Droplets,
    },
    {
      id: 'early-bird',
      title: 'Morning Hydration',
      desc: 'Minum air di pagi hari (05:00 - 08:00).',
      unlocked: stats.hasEarlyMorning,
      progress: stats.hasEarlyMorning ? 'Tercapai' : 'Belum tercapai',
      Icon: Sunrise,
    },
    {
      id: 'target-master',
      title: 'Target Master',
      desc: 'Mencapai 100% target hidrasi harian minimal 1 hari.',
      unlocked: stats.daysMetTarget >= 1,
      progress: `${Math.min(stats.daysMetTarget, 1)}/1 hari`,
      Icon: Trophy,
    },
    {
      id: 'streak-3',
      title: '3-Day Streak',
      desc: 'Capai target hidrasi 3 hari berturut-turut.',
      unlocked: stats.bestStreak >= 3,
      progress: `${Math.min(stats.bestStreak, 3)}/3 hari`,
      Icon: Flame,
    },
    {
      id: 'electrolyte-balance',
      title: 'Electrolyte Balance',
      desc: 'Mencatat minuman elektrolit alami atau air kelapa.',
      unlocked: stats.hasElectrolyte,
      progress: stats.hasElectrolyte ? 'Tercapai' : 'Belum tercatat',
      Icon: Sparkles,
    },
    {
      id: 'hydration-guardian',
      title: 'Hydration Guardian',
      desc: 'Total hidrasi tercatat mencapai 10.000 ml.',
      unlocked: stats.totalEffectiveMl >= 10000,
      progress: `${Math.min(stats.totalEffectiveMl, 10000).toLocaleString('id-ID')}/10.000 ml`,
      Icon: ShieldCheck,
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const slotMeta = [
    { key: 'Pagi', label: 'Pagi (05-11)', Icon: Sunrise },
    { key: 'Siang', label: 'Siang (11-15)', Icon: Sun },
    { key: 'Sore', label: 'Sore (15-19)', Icon: Sunset },
    { key: 'Malam', label: 'Malam (19-05)', Icon: Moon },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Streak Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-500 text-white p-6 shadow-lg shadow-sky-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              <Award className="w-3.5 h-3.5" />
              Streak & Pencapaian
            </div>
            <h1 className="text-2xl font-bold">Konsistensi Hidrasi Kamu</h1>
            <p className="text-sky-100 text-xs sm:text-sm max-w-md">
              {stats.currentStreak > 0
                ? `Luar biasa! Kamu menjaga target hidrasi selama ${stats.currentStreak} hari berturut-turut.`
                : 'Capai target hidrasi harianmu hari ini untuk memulai streak pertamamu.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/95 text-slate-800 rounded-2xl px-4 py-3 text-center shadow-sm">
              <Flame className="w-5 h-5 text-sky-600 mx-auto mb-1" />
              <div className="text-2xl font-extrabold text-sky-700">
                {stats.currentStreak}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Streak Saat Ini
              </div>
            </div>
            <div className="bg-white/95 text-slate-800 rounded-2xl px-4 py-3 text-center shadow-sm">
              <Trophy className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
              <div className="text-2xl font-extrabold text-sky-700">
                {stats.bestStreak}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Streak Terbaik
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Time-of-Day Drinking Pattern */}
      <section className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Pola Waktu Minum Paling Rutin
            </h2>
            <p className="text-xs text-slate-500">
              {stats.favoriteSlot
                ? `Kamu paling sering minum air di waktu ${stats.favoriteSlot}.`
                : 'Belum ada data catatan minum untuk dianalisis.'}
            </p>
          </div>
          <span className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
            {stats.totalLogs} total catatan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {slotMeta.map(({ key, label, Icon }) => {
            const count = stats.timeSlots[key] || 0;
            const pct = Math.round((count / stats.maxSlotCount) * 100);
            const isTop = stats.favoriteSlot === key && count > 0;
            return (
              <div
                key={key}
                className={`p-3.5 rounded-2xl border space-y-2 ${
                  isTop
                    ? 'bg-sky-50 border-sky-200'
                    : 'bg-slate-50/70 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={`w-4 h-4 ${
                      isTop ? 'text-sky-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {count}x
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-sky-100">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${count > 0 ? Math.max(pct, 12) : 0}%` }}
                  />
                </div>
                <div className="text-[11px] font-medium text-slate-500">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievement Badges (Pure Lucide Vector Icons - No Emojis) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            Badge Pencapaian ({unlockedCount}/{badges.length})
          </h2>
          {loading && (
            <span className="text-xs text-slate-400">Menghitung data...</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {badges.map(({ id, title, desc, unlocked, progress, Icon }) => (
            <div
              key={id}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                unlocked
                  ? 'bg-white border-sky-200 shadow-xs'
                  : 'bg-slate-50/70 border-slate-100 opacity-75'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  unlocked
                    ? 'bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sm shadow-sky-200'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-800 truncate">
                    {title}
                  </h3>
                  {unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Terbuka
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                      <Lock className="w-3 h-3" />
                      Terkunci
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                <div className="text-[11px] font-semibold text-sky-600 pt-0.5">
                  Progres: {progress}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
