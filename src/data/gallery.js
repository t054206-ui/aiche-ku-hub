import { SITE_CONFIG } from './site'

/**
 * =====================================================================
 *  GALLERY — 4 to 6 photos work best.
 *  Put images in /public/images/gallery and set src to "/images/gallery/name.jpg".
 *  While src is null a branded placeholder tile is shown.
 * =====================================================================
 */
export const GALLERY = {
  viewMoreUrl: SITE_CONFIG.instagramUrl,
  viewMoreLabel: 'View more on Instagram',
  items: [
    { id: 'g1', src: null, alt: 'AIChE KU event photo', title: null, date: null },
    { id: 'g2', src: null, alt: 'AIChE KU event photo', title: null, date: null },
    { id: 'g3', src: null, alt: 'AIChE KU event photo', title: null, date: null },
    { id: 'g4', src: null, alt: 'AIChE KU event photo', title: null, date: null },
    { id: 'g5', src: null, alt: 'AIChE KU event photo', title: null, date: null },
    { id: 'g6', src: null, alt: 'AIChE KU event photo', title: null, date: null },
  ],
}
