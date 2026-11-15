import { Heart } from 'lucide-react';
import { useIsFavorited } from '../../hooks/useFavorites';

export default function FavoriteButton({ beverageId, size = 'md' }) {
  const { isFavorited, toggleFavorite } = useIsFavorited(beverageId);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-[18px] h-[18px]',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite();
      }}
      aria-label={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
      className={`${sizes[size] || sizes.md} rounded-full flex items-center justify-center transition-all cursor-pointer ${
        isFavorited
          ? 'bg-sky-100 text-sky-600 shadow-sm ring-1 ring-sky-200'
          : 'bg-sky-50/80 text-slate-400 hover:text-sky-600 hover:bg-sky-100/70'
      }`}
    >
      <Heart
        className={`${iconSizes[size] || iconSizes.md} transition-transform ${
          isFavorited ? 'fill-sky-500 text-sky-500 scale-110' : ''
        }`}
      />
    </button>
  );
}
