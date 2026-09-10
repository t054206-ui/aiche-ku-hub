import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Icon from './Icon'
import { useToast } from './Toast'
import { track, ANALYTICS_EVENTS } from '../../lib/analytics'

const EmailContext = createContext(() => {})

/**
 * Every mailto: link on the site opens this sheet instead of navigating directly.
 * Plain mailto: links silently do nothing on many phones (no mail app configured)
 * and inside embedded/sandboxed previews, so we always offer working alternatives:
 * open the default mail app, compose in Gmail (a normal https link), or copy the address.
 */
export function EmailSheetProvider({ children }) {
  const [state, setState] = useState(null) // { address, subject }
  const toast = useToast()

  const openEmail = useCallback((address, subject) => setState({ address, subject }), [])
  const close = useCallback(() => setState(null), [])

  useEffect(() => {
    if (!state) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [state, close])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(state.address)
      toast('Email address copied')
    } catch {
      toast(state.address)
    }
    track(ANALYTICS_EVENTS.CONTACT_CLICK, { id: 'email-copy' })
  }

  const subjectParam = state?.subject ? `&subject=${encodeURIComponent(state.subject)}` : ''
  const mailtoHref = state ? `mailto:${state.address}${state.subject ? `?subject=${encodeURIComponent(state.subject)}` : ''}` : '#'
  const gmailHref = state ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(state.address)}${subjectParam}` : '#'

  const option =
    'flex w-full items-center gap-3 rounded-xl border border-line bg-white px-4 py-3.5 text-left font-display text-[15px] font-medium text-ink transition-colors hover:border-brand-200 hover:bg-brand-50'

  return (
    <EmailContext.Provider value={openEmail}>
      {children}
      {state && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="presentation">
          <button type="button" aria-label="Close" onClick={close} className="absolute inset-0 animate-fade-in bg-brand-900/50 backdrop-blur-[2px]" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-sheet-title"
            className="relative w-full max-w-md animate-fade-up rounded-t-3xl bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-lift sm:rounded-3xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-brand-500">Email us</p>
                <h2 id="email-sheet-title" className="mt-2 break-all font-display text-xl font-semibold text-brand-700">
                  {state.address}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-white hover:text-brand-700"
              >
                <Icon name="X" className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-2">
              <a href={mailtoHref} target="_blank" rel="noopener noreferrer" className={option} onClick={() => track(ANALYTICS_EVENTS.CONTACT_CLICK, { id: 'email-app' })}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon name="Mail" className="h-5 w-5" /></span>
                <span className="flex-1">Open in mail app</span>
                <Icon name="ArrowUpRight" className="h-4 w-4 text-brand-300" />
              </a>
              <a href={gmailHref} target="_blank" rel="noopener noreferrer" className={option} onClick={() => track(ANALYTICS_EVENTS.CONTACT_CLICK, { id: 'email-gmail' })}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon name="AtSign" className="h-5 w-5" /></span>
                <span className="flex-1">Compose in Gmail</span>
                <Icon name="ArrowUpRight" className="h-4 w-4 text-brand-300" />
              </a>
              <button type="button" onClick={copy} className={option}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon name="Copy" className="h-5 w-5" /></span>
                <span className="flex-1">Copy address</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </EmailContext.Provider>
  )
}

export const useEmailSheet = () => useContext(EmailContext)
