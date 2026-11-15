import { useState } from 'react';
import {
  User,
  Droplets,
  Calculator,
  CheckCircle2,
  Info,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { getUserProfile, saveUserProfile } from '../services/userService';

export default function ProfileAboutPage() {
  const [profile, setProfile] = useState(getUserProfile);
  const [savedToast, setSavedToast] = useState(false);

  const recommendedFromWeight = Math.round(Number(profile.weightKg || 60) * 35);

  const handleSave = (e) => {
    e.preventDefault();
    saveUserProfile({
      ...profile,
      weightKg: Number(profile.weightKg) || 60,
      dailyTargetMl: Number(profile.dailyTargetMl) || 2200,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const applyRecommendedTarget = () => {
    setProfile((prev) => ({ ...prev, dailyTargetMl: recommendedFromWeight }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Profile Header */}
      <section className="bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-500 rounded-3xl p-6 text-white shadow-lg shadow-sky-200/70">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {profile.username || 'Pengguna HydroTrack'}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm mt-0.5">
              {profile.bio || 'Menjaga hidrasi harian agar tetap fokus dan sehat'}
            </p>
            <span className="inline-block mt-2 text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full">
              Target Harian: {Number(profile.dailyTargetMl).toLocaleString('id-ID')} ml
            </span>
          </div>
        </div>
      </section>

      {savedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Profil dan target hidrasi berhasil diperbarui!
        </div>
      )}

      {/* Profile & Target Settings */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2 text-base font-bold text-slate-800">
          <Calculator className="w-5 h-5 text-sky-600" />
          Pengaturan Profil & Target Hidrasi
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Nama Pengguna
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Berat Badan (kg)
            </label>
            <input
              type="number"
              min={25}
              max={250}
              value={profile.weightKg}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, weightKg: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Rekomendasi berdasarkan berat badan ({profile.weightKg || 60} kg × 35 ml):{' '}
            <strong className="text-sky-700">
              {recommendedFromWeight.toLocaleString('id-ID')} ml/hari
            </strong>
          </div>
          <button
            type="button"
            onClick={applyRecommendedTarget}
            className="text-xs font-semibold text-sky-700 bg-white border border-sky-200 hover:bg-sky-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            Gunakan Rekomendasi
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">
            Target Konsumsi Air Harian (ml)
          </label>
          <input
            type="number"
            min={500}
            max={6000}
            step={50}
            value={profile.dailyTargetMl}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, dailyTargetMl: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">
            Bio / Motivasi Hidrasi
          </label>
          <input
            type="text"
            value={profile.bio}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
        >
          Simpan Pengaturan
        </button>
      </form>

      {/* About HydroTrack Section */}
      <section className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-800">
          <Info className="w-5 h-5 text-sky-600" />
          Tentang Aplikasi HydroTrack
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>HydroTrack</strong> adalah aplikasi Progressive Web App (PWA) untuk
          pencatatan dan visualisasi konsumsi air minum harian. Dirancang dengan
          antarmuka putih-biru yang menenangkan untuk membantu membangun kebiasaan
          hidrasi yang konsisten setiap hari.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
            <Droplets className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-800">Pelacakan Harian</h3>
            <p className="text-xs text-slate-500">
              Catat air putih & minuman sehat lengkap dengan grafik 7 hari terakhir.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
            <Smartphone className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-800">PWA & Offline</h3>
            <p className="text-xs text-slate-500">
              Dapat di-install ke layar utama dan tetap berjalan dengan fallback lokal.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-800">REST API + Supabase</h3>
            <p className="text-xs text-slate-500">
              Didukung backend Express.js MVC dan database PostgreSQL Supabase.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-sky-50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>Tugas Akhir Praktikum PPB 2026</span>
          <span>HydroTrack v1.0.0 · Calming Blue Edition</span>
        </div>
      </section>
    </div>
  );
}
