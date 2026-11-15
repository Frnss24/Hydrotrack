import { useState } from 'react';
import {
  ArrowLeft,
  Droplets,
  Calendar,
  Clock,
  Sparkles,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
} from 'lucide-react';
import logService from '../../services/logService';
import { formatDate, formatTime } from '../../utils/helpers';
import ConfirmModal from '../modals/ConfirmModal';

const MOODS = ['Segar', 'Berenergi', 'Haus', 'Santai', 'Setelah Olahraga'];
const PRESET_AMOUNTS = [150, 200, 250, 350, 500, 750];

export default function LogDetail({ log, onBack, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [amountMl, setAmountMl] = useState(log?.amount_ml || 250);
  const [mood, setMood] = useState(log?.mood || 'Segar');
  const [notes, setNotes] = useState(log?.notes || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');

  if (!log) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amountMl);
    if (!numericAmount || numericAmount < 10 || numericAmount > 5000) {
      setError('Jumlah air harus antara 10 ml hingga 5000 ml.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const updated = await logService.update(log.id, {
        amount_ml: numericAmount,
        mood,
        notes: notes.trim(),
      });
      setIsEditing(false);
      if (onUpdated) onUpdated(updated);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui catatan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await logService.remove(log.id);
      setShowDeleteModal(false);
      onBack();
    } catch (err) {
      setError(err.message || 'Gagal menghapus catatan.');
      setDeleting(false);
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
        Kembali
      </button>

      <div className="bg-white rounded-3xl border border-sky-100 shadow-lg shadow-sky-100/60 overflow-hidden">
        <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-500 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="inline-block text-xs font-medium bg-white/20 px-2.5 py-0.5 rounded-full mb-1.5">
                  {log.category || 'Air Putih'}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold">{log.beverage_name}</h1>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold">+{log.amount_ml}</div>
              <div className="text-xs text-sky-100 font-medium">mililiter</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
              {error}
            </div>
          )}

          {!isEditing ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" />
                    Tanggal
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {formatDate(log.consumed_at)}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    Waktu
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {formatTime(log.consumed_at)} WIB
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    Kondisi / Mood
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {log.mood || 'Segar'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-500" />
                  Catatan Tambahan
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {log.notes ? log.notes : 'Tidak ada catatan tambahan untuk konsumsi ini.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Catatan
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm rounded-xl border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Volume Minum (ml)
                </label>
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmountMl(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        Number(amountMl) === preset
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                      }`}
                    >
                      {preset} ml
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={10}
                  max={5000}
                  value={amountMl}
                  onChange={(e) => setAmountMl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Kondisi / Mood
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        mood === m
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Catatan
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Minum setelah lari pagi..."
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setAmountMl(log.amount_ml);
                    setMood(log.mood || 'Segar');
                    setNotes(log.notes || '');
                    setError('');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Hapus Catatan Minum"
        message={`Hapus catatan "${log.beverage_name} (+${log.amount_ml} ml)"? Total hidrasi hari terkait akan ikut diperbarui.`}
        confirmText="Ya, Hapus"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deleting}
      />
    </div>
  );
}
