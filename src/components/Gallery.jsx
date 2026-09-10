import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { useContent } from '../lib/content'
import { ANALYTICS_EVENTS } from '../lib/analytics'

/**
 * Masonry gallery: every photo keeps its natural proportions and is shown in full
 * (no cropping). Photos flow into 2 columns on phones and 3 on larger screens.
 */
function GalleryTile({ item, index }) {
  const caption = item.title || item.date
  return (
    <Reveal as="li" delay={Math.min(index, 8) * 50} className="mb-3 break-inside-avoid sm:mb-4">
      <figure className="group relative overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        {item.src ? (
          <a href={item.src} target="_blank" rel="noopener noreferrer" className="block" aria-label={`Open photo: ${item.title || item.alt || 'AIChE KU event'}`}>
            <img
              src={item.src}
              alt={item.alt || item.title || 'AIChE KU event'}
              loading="lazy"
              width={item.width || undefined}
              height={item.height || undefined}
              style={item.width && item.height ? { aspectRatio: `${item.width} / ${item.height}` } : undefined}
              className="block h-auto w-full bg-brand-50 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          </a>
        ) : (
          <div className="photo-placeholder flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 text-brand-300 transition-colors group-hover:text-brand-500">
            <Icon name="Camera" className="h-7 w-7" />
            <span className="font-display text-[11px] font-semibold uppercase tracking-widest">Photo coming soon</span>
          </div>
        )}
        {caption && (
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/80 to-transparent p-3 pt-8 text-white">
            {item.title && <span className="block font-display text-sm font-semibold">{item.title}</span>}
            {item.date && <span className="block text-xs text-white/75">{item.date}</span>}
          </figcaption>
        )}
      </figure>
    </Reveal>
  )
}

/** Show every real photo; fall back to six branded placeholders while none exist. */
function visibleItems(items) {
  const withPhotos = items.filter((item) => item.src)
  return withPhotos.length ? withPhotos : items.slice(0, 6)
}

export default function Gallery() {
  const { gallery: GALLERY } = useContent()
  const items = visibleItems(GALLERY.items)
  const hasPhotos = items.length > 0 && Boolean(items[0].src)
  return (
    <Section id="gallery" aria-labelledby="gallery-title">
      <SectionHeading
        id="gallery-title"
        eyebrow="Gallery"
        title="Moments from our events"
        action={
          <Button
            variant="outline"
            size="sm"
            href={GALLERY.viewMoreUrl}
            trackAs={ANALYTICS_EVENTS.GALLERY_VIEW_MORE}
            trackMeta={{ source: 'gallery' }}
          >
            {GALLERY.viewMoreLabel}
            <Icon name="ArrowUpRight" className="h-4 w-4" />
          </Button>
        }
      />
      <ul className="mt-8 columns-2 gap-3 sm:columns-3 sm:gap-4">
        {items.map((item, i) => (
          <GalleryTile key={item.id} item={item} index={i} />
        ))}
      </ul>
      {hasPhotos && (
        <p className="mt-2 text-sm text-ink-muted">
          {items.length} photo{items.length === 1 ? '' : 's'} · tap a photo to open it full size.
        </p>
      )}
    </Section>
  )
}
