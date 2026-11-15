export const BEVERAGES_LOCAL = [
  {
    id: 'bev-1',
    name: 'Air Mineral Murni',
    category: 'Air Murni',
    hydration_index: 100,
    recommended_ml: 250,
    calories_per_250ml: 0,
    best_time: 'Sepanjang hari',
    description:
      'Pilihan hidrasi terbaik tanpa kalori yang langsung diserap tubuh untuk menjaga konsentrasi, metabolisme, dan suhu tubuh.',
    benefits: [
      '100% efektif menghidrasi sel tubuh tanpa gula tambahan',
      'Membantu menjaga fokus belajar dan mengurangi rasa lelah',
      'Mendukung fungsi ginjal dan pencernaan optimal',
    ],
    tips: [
      'Minum 1 gelas (250 ml) segera setelah bangun tidur',
      'Sediakan botol minum di meja belajar agar mudah dijangkau',
    ],
  },
  {
    id: 'bev-2',
    name: 'Infused Water Lemon & Mint',
    category: 'Infused & Herbal',
    hydration_index: 98,
    recommended_ml: 350,
    calories_per_250ml: 5,
    best_time: 'Pagi & Siang hari',
    description:
      'Air mineral yang direndam irisan lemon segar dan daun mint untuk memberikan kesegaran alami tanpa pemanis buatan.',
    benefits: [
      'Mengandung vitamin C ringan dan antioksidan alami',
      'Memberikan aroma menenangkan yang meningkatkan mood minum air',
      'Alternatif sehat pengganti minuman manis kemasan',
    ],
    tips: [
      'Rendam di kulkas 2–4 jam sebelum diminum',
      'Ganti irisan buah maksimal setiap 24 jam',
    ],
  },
  {
    id: 'bev-3',
    name: 'Air Kelapa Murni',
    category: 'Elektrolit Alami',
    hydration_index: 108,
    recommended_ml: 300,
    calories_per_250ml: 45,
    best_time: 'Setelah olahraga / cuaca panas',
    description:
      'Sumber elektrolit alami kaya kalium dan magnesium yang membantu memulihkan cairan tubuh setelah aktivitas fisik intens.',
    benefits: [
      'Mengembalikan elektrolit tubuh secara cepat dan alami',
      'Rendah natrium namun tinggi kalium untuk keseimbangan cairan',
      'Membantu mencegah kram otot setelah berolahraga',
    ],
    tips: [
      'Pilih air kelapa muda murni tanpa tambahan sirup atau gula',
      'Ideal diminum 30 menit setelah aktivitas fisik',
    ],
  },
  {
    id: 'bev-4',
    name: 'Teh Hijau Tawar (Green Tea)',
    category: 'Minuman Hangat',
    hydration_index: 92,
    recommended_ml: 200,
    calories_per_250ml: 2,
    best_time: 'Pagi atau Sore hari',
    description:
      'Minuman hangat kaya katekin dan L-theanine yang menghidrasi sekaligus memberikan efek relaksasi dan ketenangan pikiran.',
    benefits: [
      'Membantu hidrasi harian sekaligus kaya antioksidan',
      'L-theanine membantu fokus tenang tanpa rasa gelisah berlebih',
      'Cocok dinikmati hangat saat cuaca dingin atau sore hari',
    ],
    tips: [
      'Seduh dengan air bersuhu ~80°C selama 2–3 menit agar tidak pahit',
      'Hindari minum terlalu larut malam karena mengandung sedikit kafein',
    ],
  },
  {
    id: 'bev-5',
    name: 'Air Hangat Pagi',
    category: 'Minuman Hangat',
    hydration_index: 100,
    recommended_ml: 250,
    calories_per_250ml: 0,
    best_time: 'Bangun tidur & Sebelum tidur',
    description:
      'Air putih bersuhu hangat suam-suam kuku yang lembut di lambung, membantu melancarkan sirkulasi dan menenangkan tubuh.',
    benefits: [
      'Merangsang sistem pencernaan secara lembut di pagi hari',
      'Membantu meredakan ketegangan tenggorokan dan tubuh',
      'Menjaga hidrasi sebelum tidur tanpa membuat kaget lambung',
    ],
    tips: [
      'Gunakan suhu sekitar 40–50°C agar nyaman diminum',
      'Minum perlahan dengan napas rileks',
    ],
  },
  {
    id: 'bev-6',
    name: 'Infused Water Timun & Chia',
    category: 'Infused & Herbal',
    hydration_index: 102,
    recommended_ml: 350,
    calories_per_250ml: 20,
    best_time: 'Siang hari',
    description:
      'Kombinasi air timun yang menyejukkan dengan biji chia yang menahan kelembapan lebih lama di dalam tubuh.',
    benefits: [
      'Biji chia membantu pelepasan hidrasi secara bertahap',
      'Memberikan sensasi sejuk dan kenyang lebih lama',
      'Kaya serat larut yang baik untuk pencernaan',
    ],
    tips: [
      'Rendam 1 sendok teh biji chia minimal 15 menit hingga mengembang',
      'Aduk merata sebelum diminum',
    ],
  },
]

const todayISO = (hour, minute = 0) => {
  const d = new Date()
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const daysAgoISO = (days, hour, minute = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const INITIAL_LOGS_LOCAL = [
  {
    id: 'log-1',
    beverage_name: 'Air Hangat Pagi',
    category: 'Minuman Hangat',
    amount_ml: 250,
    consumed_at: todayISO(7, 15),
    mood: 'Tenang',
    notes: 'Segelas air hangat setelah bangun tidur.',
  },
  {
    id: 'log-2',
    beverage_name: 'Air Mineral Murni',
    category: 'Air Murni',
    amount_ml: 350,
    consumed_at: todayISO(10, 30),
    mood: 'Fokus',
    notes: 'Minum di sela kuliah pagi.',
  },
  {
    id: 'log-3',
    beverage_name: 'Infused Water Lemon & Mint',
    category: 'Infused & Herbal',
    amount_ml: 300,
    consumed_at: todayISO(13, 20),
    mood: 'Segar',
    notes: 'Setelah makan siang.',
  },
  {
    id: 'log-4',
    beverage_name: 'Air Mineral Murni',
    category: 'Air Murni',
    amount_ml: 500,
    consumed_at: daysAgoISO(1, 14, 0),
    mood: 'Segar',
    notes: 'Target harian tercapai kemarin.',
  },
  {
    id: 'log-5',
    beverage_name: 'Air Kelapa Murni',
    category: 'Elektrolit Alami',
    amount_ml: 350,
    consumed_at: daysAgoISO(1, 17, 30),
    mood: 'Lega',
    notes: 'Setelah jogging sore.',
  },
  {
    id: 'log-6',
    beverage_name: 'Air Mineral Murni',
    category: 'Air Murni',
    amount_ml: 1450,
    consumed_at: daysAgoISO(2, 16, 0),
    mood: 'Fokus',
    notes: 'Total catatan minum 2 hari lalu.',
  },
  {
    id: 'log-7',
    beverage_name: 'Air Mineral Murni',
    amount_ml: 1850,
    category: 'Air Murni',
    consumed_at: daysAgoISO(3, 18, 0),
    mood: 'Segar',
    notes: 'Hampir mencapai target 2000 ml.',
  },
]
