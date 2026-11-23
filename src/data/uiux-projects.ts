import type { ImageMetadata } from 'astro';
import datatixx from '../assets/services/ui-ux/datatixx.jpg';
import frelia from '../assets/services/ui-ux/frelia.jpg';
import solvia from '../assets/services/ui-ux/solvia.jpg';
import atlasona from '../assets/services/ui-ux/atlasona.jpg';
import staryLev from '../assets/services/ui-ux/stary-lev.jpg';
import greenthumbhub from '../assets/services/ui-ux/greenthumbhub.jpg';
import smart from '../assets/services/ui-ux/smart.jpg';

/**
 * Проєкти блоку «03 Наші проєкти» сторінки UI/UX (Figma «UI дизайн», 231:3409).
 * Тексти (опис, «що зробили») — у ui[locale].uiux.projects.texts за slug.
 * Обкладинки — цілі зображення (картки вищі, ніж у макеті), показуються з object-fit: cover.
 * Сфера — ключ ui[locale].uiux.projects.categories; фільтр показує лише сфери з переліку filterCategories.
 */
export type UiuxCategory = 'finance' | 'education' | 'ecommerce' | 'health' | 'gardening';

export interface UiuxProject {
  slug: string;
  /** Назва — власна назва проєкту, не перекладається */
  title: string;
  category: UiuxCategory;
  platform: 'app' | 'web';
  cover: ImageMetadata;
  /** Клієнтський проєкт (велика картка) чи власний / концепт */
  client?: boolean;
}

/** Порядок кнопок фільтра (Figma) */
export const filterCategories: UiuxCategory[] = ['finance', 'education', 'ecommerce', 'health'];

/** Порядок — як у перекладі: ліва колонка 1, 3, 5, права (зі зсувом) 2, 4, 6 */
export const uiuxProjects: UiuxProject[] = [
  { slug: 'datatixx', title: 'DataTixx', category: 'finance', platform: 'web', cover: datatixx, client: true },
  { slug: 'frelia', title: 'Frelia', category: 'health', platform: 'app', cover: frelia },
  { slug: 'solvia', title: 'Solvia', category: 'health', platform: 'web', cover: solvia },
  { slug: 'atlasona', title: 'Atlasona', category: 'ecommerce', platform: 'app', cover: atlasona },
  { slug: 'stary-lev', title: 'Видавництво Старого Лева', category: 'education', platform: 'app', cover: staryLev },
  { slug: 'greenthumbhub', title: 'GreenThumbHub', category: 'gardening', platform: 'web', cover: greenthumbhub },
  { slug: 'smart', title: 'SMART', category: 'education', platform: 'web', cover: smart },
];
