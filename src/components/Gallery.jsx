import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { useContent } from '../lib/content'
import { ANALYTICS_EVENTS } from '../lib/analytics'

function GalleryTile({ item, index, isLast }) {
  const caption = item.title || item.date
  const lead = index === 0
  // Lead tile is a wide banner on mobile and a 2×2 block on larger screens.
  const span = lead ? 'col-span-2 sm:row-span-2' : isLast ? 'col-span-2 sm:col-span-1' : ''
  // 4:3 tiles suit event photos better than squares; the lead tile fills its 2×2 block.
  const ratio = lead ? 'aspect-[16/10] sm:aspect-auto sm:h-full' : isLast ? 'aspect-[2/1] sm:aspect-[4/3]' : 'aspect-[4/3]'
  const FOCUS = { left: 'left center', right: 'right center', top: 'center top', bottom: 'center bottom' }
  const objectPosition = FOCUS[item.focus] || 'center'
  return (
    <Reveal as="li" delay={index * 50} className={`${span} sm:h-full`}>
      <figure className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className={`${ratio} w-full`}>
          {item.src ? (
            <a href={item.src} target="_blank" rel="noopener noreferrer" className="block h-full w-full" aria-label={`Open photo: ${item.title || item.alt || 'AIChE KU event'}`}>
              <img
                src={item.src}
                alt={item.alt || item.title || 'AIChE KU event'}
                loading="lazy"
                style={{ objectPosition }}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </a>
          ) : (
            <div className="photo-placeholder flex h-full w-full flex-col items-center justify-center gap-2 text-brand-300 transition-colors group-hover:text-brand-500">
              <Icon name="Camera" className="h-7 w-7" />
              <span className="font-display text-[11px] font-semibold uppercase tracking-widest">Photo coming soon</span>
            </div>
          )}
        </div>
        {caption && (
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/80 to-transparent p-3 pt-8 text-white">
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
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {items.map((item, i, all) => (
          <GalleryTile key={item.id} item={item} index={i} isLast={i === all.length - 1 && all.length % 2 === 0} />
        ))}
      </ul>
      {items.length > 0 && items[0].src && (
        <p className="mt-4 text-sm text-ink-muted">
          {items.length} photo{items.length === 1 ? '' : 's'} · tap a photo to open it full size.
        </p>
      )}
    </Section>
  )
}
