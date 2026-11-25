import type { ImageMetadata } from 'astro';
import { directionPaths } from '../i18n/ui';
import type { DirectionKey } from '../i18n/services';
import uiux from '../assets/services/overview/direction-uiux.png';
import sites from '../assets/services/overview/direction-sites.jpg';
import shop from '../assets/services/overview/direction-shop.jpg';
import branding from '../assets/services/overview/direction-brand.jpg';
import photo from '../assets/services/overview/direction-photo.jpg';

/** Напрями сторінки «Послуги» в порядку макета; шлях — той самий, що й у directionPaths (головна, меню) */
export const directionKeys: DirectionKey[] = ['uiux', 'sites', 'shop', 'branding', 'photo'];

export const directionPath = (key: DirectionKey) => directionPaths[directionKeys.indexOf(key)];

export const directionImages: Record<DirectionKey, ImageMetadata> = { uiux, sites, shop, branding, photo };
