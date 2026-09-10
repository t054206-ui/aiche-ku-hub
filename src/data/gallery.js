import { SITE_CONFIG } from './site'

/**
 * =====================================================================
 *  GALLERY — every item with a photo is shown (add as many rows as you like).
 *  Photos live in the Supabase Storage bucket "gallery" (public). Upload a photo in
 *  the Supabase dashboard → Storage → gallery, copy its public URL, and set `src`
 *  (or edit the gallery_items table directly — the live site reads from there).
 *  Local files in /public/images/gallery also work ("/images/gallery/name.jpg").
 *  While src is null a branded placeholder tile is shown. The first item is the
 *  large lead tile.
 * =====================================================================
 */
export const GALLERY = {
  viewMoreUrl: SITE_CONFIG.instagramUrl,
  viewMoreLabel: 'View more on Instagram',
  items: [
    { id: 'g1', src: 'https://njrysdonstvtmnocmqsx.supabase.co/storage/v1/object/public/gallery/seed/certificate-of-achievement.jpg', alt: 'AIChE KU member receiving a Certificate of Achievement at Kuwait University College of Engineering', title: 'Certificate of Achievement', date: null },
    { id: 'g2', src: null, alt: 'AIChE KU event photo', title: null, date: null },
    { id: 'g3', src: null, alt: 'AIChE KU event photo', title: null, date: null },
    { id: 'g4', src: null, alt: 'AIChE KU event photo', title: null, date: null },
    { id: 'g5', src: null, alt: 'AIChE KU event photo', title: null, date: null },
    { id: 'g6', src: null, alt: 'AIChE KU event photo', title: null, date: null },
  ],
}
