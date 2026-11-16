import { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  BellRing,
  Clock,
  Droplets,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { getUserProfile, PROFILE_EVENT } from '../services/userService';
import {
  INTERVAL_OPTIONS,
  loadReminderSettings,
  saveReminderSettings,
  buildReminderSchedule,
  showHydroNotification,
} from '../utils/reminderSchedule';

export default function RemindersPage() {
  const [settings, setSettings] = useState(loadReminderSettings);
  const [profile, setProfile] = useState(getUserProfile);
  const [notifStatus, setNotifStatus] = useState(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [toast, setToast] = useState('');

  useEffect(() => {
    const syncProfile = () => setProfile(getUserProfile());
    window.addEventListener(PROFILE_EVENT, syncProfile);
    return () => window.removeEventListener(PROFILE_EVENT, syncProfile);
  }, []);

  useEffect(() => {
    saveReminderSettings(settings);
  }, [settings]);

  const schedule = useMemo(
    () => buildReminderSchedule(settings, profile.dailyTargetMl || 2100),
    [settings, profile.dailyTargetMl]
  );

  const handleToggleNotifications = async () => {
    if (typeof Notification === 'undefined') {
      setToast('Browser ini tidak mendukung Web Notification.');
      setTimeout(() => setToast(''), 3200);
      return;
    }

    if (!settings.enabled) {
      const perm = await Notification.requestPermission();
      setNotifStatus(perm);
      if (perm === 'granted') {
        setSettings((prev) => ({ ...prev, enabled: true }));
        await showHydroNotification(
          'Pengingat HydroTrack Aktif',
          `Jadwal minum setiap ${settings.intervalMinutes} menit sudah diaktifkan.`
        );
        setToast('Pengingat notifikasi berhasil diaktifkan!');
      } else {
        setToast(
          'Izin notifikasi diblokir browser. Izinkan notifikasi lewat ikon gembok di address bar.'
        );
      }
    } else {
      setSettings((prev) => ({ ...prev, enabled: false }));
      setToast('Pengingat notifikasi dinonaktifkan.');
    }
    setTimeout(() => setToast(''), 3500);
  };

  const handleTestNotification = async () => {
    if (typeof Notification === 'undefined') {
      setToast('Browser ini tidak mendukung Web Notification.');
      setTimeout(() => setToast(''), 3200);
      return;
    }

    let perm = Notification.permission;
    if (perm === 'default') {
      perm = await Notification.requestPermission();
      setNotifStatus(perm);
    }

    if (perm === 'granted') {
      const sent = await showHydroNotification(
        'Tes Pengingat HydroTrack',
        `Jangan lupa minum ${schedule[0]?.amountMl || 250} ml air putih sekarang.`
      );
      setToast(
        sent
          ? 'Notifikasi dikirim! Jika tidak muncul di macOS, cek System Settings > Notifications > Brave/Chrome.'
          : 'Gagal mengirim notifikasi pada browser ini.'
      );
    } else {
      setToast(
        'Izin notifikasi belum aktif atau diblokir. Klik ikon gembok di address bar browser untuk mengizinkan.'
      );
    }
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header Card */}
      <section className="rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-500 text-white p-6 shadow-lg shadow-sky-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              <Bell className="w-3.5 h-3.5" />
              Jadwal & Pengingat Pintar
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Timeline Minum Air Harian
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm max-w-lg">
              Dibagi otomatis menjadi {schedule.length} sesi (~{schedule[0]?.amountMl || 250} ml per sesi) agar target{' '}
              {(profile.dailyTargetMl || 2100).toLocaleString('id-ID')} ml tercapai dengan ringan.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer ${
                settings.enabled && notifStatus === 'granted'
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-white text-sky-700 hover:bg-sky-50'
              }`}
            >
              <BellRing className="w-4 h-4" />
              {settings.enabled && notifStatus === 'granted'
                ? 'Pengingat Aktif'
                : 'Aktifkan Notifikasi'}
            </button>
          </div>
        </div>
      </section>

      {toast && (
        <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-800 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium">
          <AlertCircle className="w-4 h-4 text-sky-600 shrink-0" />
          {toast}
        </div>
      )}

      {/* Configuration Card */}
      <section className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            Atur Jam & Interval Pengingat
          </h2>
          <button
            type="button"
            onClick={handleTestNotification}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            Tes Notifikasi
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
              <Sun className="w-3.5 h-3.5 text-sky-500" />
              Jam Bangun Tidur
            </label>
            <input
              type="time"
              value={settings.wakeTime}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, wakeTime: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
              <Moon className="w-3.5 h-3.5 text-sky-500" />
              Jam Tidur Malam
            </label>
            <input
              type="time"
              value={settings.sleepTime}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, sleepTime: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">
            Interval Pengingat
          </label>
          <div className="grid grid-cols-4 gap-2">
            {INTERVAL_OPTIONS.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() =>
                  setSettings((prev) => ({ ...prev, intervalMinutes: mins }))
                }
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                  settings.intervalMinutes === mins
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-sky-50/70 text-sky-700 border-sky-100 hover:bg-sky-100'
                }`}
              >
                Tiap {mins}m
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Schedule Timeline */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            Timeline Jadwal Hari Ini
          </h2>
          <span className="text-xs text-slate-400">
            {schedule.length} sesi terjadwal
          </span>
        </div>

        <div className="space-y-2.5">
          {schedule.map((slot) => (
            <div
              key={slot.id}
              className={`flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
                slot.isNext
                  ? 'bg-sky-50 border-sky-300 shadow-sm'
                  : slot.isPast
                    ? 'bg-slate-50/80 border-slate-100 opacity-75'
                    : 'bg-white border-sky-100'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    slot.isNext
                      ? 'bg-sky-600 text-white'
                      : slot.isPast
                        ? 'bg-slate-200 text-slate-500'
                        : 'bg-sky-100 text-sky-600'
                  }`}
                >
                  {slot.isPast ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : slot.isNext ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <Droplets className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm sm:text-base">
                      {slot.time} WIB
                    </span>
                    {slot.isNext && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-600 text-white px-2 py-0.5 rounded-full">
                        Berikutnya
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{slot.label}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm sm:text-base font-bold text-sky-600">
                  +{slot.amountMl} ml
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
