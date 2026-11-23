import type { ImageMetadata } from 'astro';
// Фото ноутбука на камені, скадроване як у макеті «Остання робота» (Figma, 24.11.2026)
import datatixxCover from '../assets/hero/datatixx-card.jpg';

/** Роботи для картки «Остання робота» в першому екрані. Картка гортається сама, якщо робіт більше однієї. */
export interface FeaturedWork {
  slug: string;
  title: string;
  cover: ImageMetadata;
}

export const featuredWorks: FeaturedWork[] = [
  { slug: 'datatixx', title: 'DataTixx', cover: datatixxCover },
  // Другий слайд (журнал) ще не вирішено — див. план, розділ 10, «UI першого екрана».
];
