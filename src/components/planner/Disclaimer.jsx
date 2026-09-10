import Icon from '../ui/Icon'
import { useContent } from '../../lib/content'

export default function Disclaimer({ className = '' }) {
  const { assistant: ASSISTANT } = useContent()
  return (
    <p className={`flex items-start gap-2 rounded-xl bg-surface px-3 py-2.5 text-xs leading-relaxed text-ink-muted ring-1 ring-inset ring-line ${className}`}>
      <Icon name="Info" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" />
      {ASSISTANT.disclaimer}
    </p>
  )
}
