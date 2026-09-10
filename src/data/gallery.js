import { SITE_CONFIG } from './site'

/**
 * =====================================================================
 *  GALLERY — every item with a photo is shown (add as many rows as you like).
 *  Photos live in the Supabase Storage bucket "gallery" (public). Upload a photo in
 *  the Supabase dashboard → Storage → gallery, copy its public URL, and set `src`
 *  (or edit the gallery_items table directly — the live site reads from there).
 *  Local files in /public/images/gallery also work ("/images/gallery/name.jpg").
 *  While src is null a branded placeholder tile is shown. The first item is the
 *  Photos are shown in full (no cropping) in a masonry layout. `width`/`height` are the
 *  photo's pixel size — they let the page reserve space before the image loads.
 * =====================================================================
 */
export const GALLERY = {
  viewMoreUrl: SITE_CONFIG.instagramUrl,
  viewMoreLabel: 'View more on Instagram',
  items: [
    { id: 'g1', src: 'https://njrysdonstvtmnocmqsx.supabase.co/storage/v1/object/public/gallery/seed/certificate-of-achievement.jpg', alt: 'AIChE KU member receiving a Certificate of Achievement at Kuwait University College of Engineering', title: 'Certificate of Achievement', date: null, width: 1152, height: 645 },
    { id: 'g2', src: 'https://njrysdonstvtmnocmqsx.supabase.co/storage/v1/object/public/gallery/seed/equate-visit.jpg', alt: 'AIChE KU students on an industrial visit in front of the EQUATE sign', title: 'Industrial visit to EQUATE', date: null, width: 1254, height: 1003 },
    { id: 'g3', src: 'https://njrysdonstvtmnocmqsx.supabase.co/storage/v1/object/public/gallery/seed/engineering-design-exhibition-team.jpg', alt: 'Chemical Engineering students presenting their Two-Step Fermentation Process design at the Engineering Design Exhibition', title: 'Engineering Design Exhibition', date: null, width: 1634, height: 1073 },
    { id: 'g4', src: 'https://njrysdonstvtmnocmqsx.supabase.co/storage/v1/object/public/gallery/seed/engineering-design-exhibition-presentation.jpg', alt: 'Student explaining a chemical engineering design project to visitors at the exhibition', title: 'Presenting at the Design Exhibition', date: null, width: 1506, height: 994 },
    { id: 'g5', src: 'https://njrysdonstvtmnocmqsx.supabase.co/storage/v1/object/public/gallery/seed/cv-workshop.jpg', alt: 'Speaker presenting the contents of a resume to students in a classroom', title: 'CV workshop', date: null, width: 605, height: 656 },
    { id: 'g6', src: 'https://njrysdonstvtmnocmqsx.supabase.co/storage/v1/object/public/gallery/seed/chapter-visit-group.jpg', alt: 'AIChE KU students and hosts in a group photo during a chapter visit', title: 'Chapter visit', date: null, width: 1662, height: 1112 },
    { id: 'g7', src: 'https://njrysdonstvtmnocmqsx.supabase.co/storage/v1/object/public/gallery/seed/aiche-ku-booth.jpg', alt: 'AIChE Kuwait University booth with banner, notebooks, major sheets and a hard hat', title: 'AIChE KU booth', date: null, width: 995, height: 1600 },
    { id: 'g8', src: 'https://njrysdonstvtmnocmqsx.supabase.co/storage/v1/object/public/gallery/seed/aiche-library.jpg', alt: 'AIChE bookshelf of chemical engineering textbooks', title: 'AIChE library corner', date: null, width: 897, height: 1028 },
    { id: 'g9', src: 'https://njrysdonstvtmnocmqsx.supabase.co/storage/v1/object/public/gallery/seed/bangladesh-water-well.jpg', alt: 'Charity water well in Bangladesh funded by ChESS and AIChE Kuwait University', title: 'Charity water well, Bangladesh', date: null, width: 1625, height: 1221 },
  ],
}
