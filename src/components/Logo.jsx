import v1 from '../assets/logos/aiche-ku-v1.svg?raw'
import v2 from '../assets/logos/aiche-ku-v2-full.svg?raw'
import arabic from '../assets/logos/aiche-arabic-slogan.svg?raw'

/**
 * Official AIChE KU logo lock-ups, extracted as vectors from the brand PDF.
 * They inherit `currentColor`, so set a text colour class to recolour them
 * (white on blue, Pepsi Blue on white). Never stretch — size with a height class.
 *
 *  v1      AIChE / KUWAIT UNIVERSITY
 *  v2      v1 + "American Institute of Chemical Engineers"
 *  arabic  المعهد الأمريكي للمهندسين الكيميائيين
 */
const VARIANTS = {
  v1: { svg: v1, label: 'AIChE Kuwait University' },
  v2: { svg: v2, label: 'AIChE Kuwait University — American Institute of Chemical Engineers' },
  arabic: { svg: arabic, label: 'المعهد الأمريكي للمهندسين الكيميائيين' },
}

export default function Logo({ variant = 'v1', className = '', title }) {
  const { svg, label } = VARIANTS[variant] || VARIANTS.v1
  return (
    <span
      role="img"
      aria-label={title || label}
      className={`logo ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
