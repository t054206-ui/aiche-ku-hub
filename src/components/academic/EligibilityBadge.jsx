import Badge from '../ui/Badge'

const MAP = {
  completed: { tone: 'success', label: 'Completed' },
  'in-progress': { tone: 'info', label: 'Taking now' },
  eligible: { tone: 'success', label: 'Open to you' },
  'needs-coreq': { tone: 'warn', label: 'Needs co-requisite' },
  blocked: { tone: 'neutral', label: 'Not yet' },
}

export default function EligibilityBadge({ status, className = '' }) {
  const m = MAP[status]
  if (!m) return null
  return (
    <Badge tone={m.tone} className={className}>
      {m.label}
    </Badge>
  )
}
