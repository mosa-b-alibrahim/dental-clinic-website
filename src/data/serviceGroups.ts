export const serviceGroups = [
  {
    id: 'restorations',
    image: 'dental-restorations.webp',
    ar: {
      title: 'تركيبات وتعويضات الأسنان',
      description:
        'حلول لتعويض الأسنان المفقودة واستعادة الشكل والوظيفة الطبيعية للأسنان.',
      alt: 'نماذج تيجان وجسور الأسنان وبدلات الأسنان المتحركة',
      details: [
        'تيجان الأسنان',
        'جسور الأسنان',
        'تيجان الزيركون',
        'بدلات الأسنان المتحركة الجزئية',
        'بدلات الأسنان المتحركة الكاملة',
      ],
    },
    en: {
      title: 'Dental Prosthetics & Restorations',
      description:
        'Options to replace missing teeth and restore their natural appearance and function.',
      alt: 'Models of dental crowns, bridges and removable dentures',
      details: [
        'Dental crowns',
        'Dental bridges',
        'Zirconia crowns',
        'Partial removable dentures',
        'Complete removable dentures',
      ],
    },
  },
  {
    id: 'cosmetic',
    image: 'cosmetic-dentistry.webp',
    ar: {
      title: 'تجميل الأسنان',
      description:
        'خيارات تجميلية لتحسين مظهر الأسنان والحصول على ابتسامة متناسقة.',
      alt: 'صورة توضيحية لتبييض الأسنان والفينير والحشوات التجميلية',
      details: ['تبييض الأسنان بالليزر', 'فينير إيماكس', 'الحشوات التجميلية'],
    },
    en: {
      title: 'Cosmetic Dentistry',
      description:
        'Cosmetic options to improve the appearance of your teeth and create a balanced smile.',
      alt: 'Illustration of teeth whitening, veneers and tooth-colored fillings',
      details: ['Laser teeth whitening', 'E.max veneers', 'Cosmetic fillings'],
    },
  },
  {
    id: 'pediatric',
    image: 'pediatric-dentistry.webp',
    ar: {
      title: 'طب أسنان الأطفال',
      description:
        'رعاية سنية مخصصة للأطفال تشمل العلاج وخيارات التقويم المناسبة.',
      alt: 'طفل يبتسم في كرسي الأسنان مع رسوم توضيحية لعناية أسنان الأطفال',
      details: ['معالجة أسنان الأطفال', 'تقويم الأطفال'],
    },
    en: {
      title: 'Pediatric Dentistry',
      description:
        'Dental care for children, including treatment and suitable orthodontic options.',
      alt: 'A smiling child in a dental chair with illustrations of children’s dental care',
      details: ['Children’s dental treatment', 'Children’s orthodontics'],
    },
  },
  {
    id: 'root-canal',
    image: 'root-canal-treatment.webp',
    ar: {
      title: 'علاج الأسنان والعصب',
      description:
        'مداواة لبية تهدف إلى علاج الأسنان المصابة والمحافظة عليها متى أمكن.',
      alt: 'رسم توضيحي لعلاج قنوات الجذور ومقطع في لب السن',
      details: ['مداواة لبية (علاج العصب)'],
    },
    en: {
      title: 'Dental & Root Canal Treatment',
      description:
        'Endodontic care to treat affected teeth and preserve them whenever possible.',
      alt: 'Illustration of root canal treatment and a cross-section of dental pulp',
      details: ['Endodontic treatment (root canal treatment)'],
    },
  },
  {
    id: 'extraction',
    image: 'tooth-extraction.webp',
    ar: {
      title: 'خلع الأسنان',
      description: 'خلع الأسنان عند الحاجة بعد الفحص وتقييم الحالة.',
      alt: 'صورة توضيحية لسن وأداة خلع الأسنان في العيادة',
      details: ['قلع الأسنان'],
    },
    en: {
      title: 'Tooth Extraction',
      description:
        'Tooth removal when needed, following an examination and assessment.',
      alt: 'Illustration of a tooth held in dental extraction forceps in a clinic',
      details: ['Tooth extraction'],
    },
  },
] as const;
