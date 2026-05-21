import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

const CONCIERGE_IMG =
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=85&w=2000&auto=format&fit=crop'

const PERKS = [
  {
    label: '24 / 7',
    title: 'White-Glove Concierge',
    body:  'Your dedicated attaché handles hotel-to-hotel delivery, private airstrip collection, and every logistical nuance — around the clock.',
  },
  {
    label: 'ZERO QUEUE',
    title: 'No Paperwork. No Lines.',
    body:  'Biometric pre-clearance and a single encrypted keystroke is all that stands between you and ignition.',
  },
  {
    label: 'ABSOLUTE',
    title: 'Discretion Guaranteed',
    body:  'No livery. No brand exposure. No digital footprint beyond the encrypted APEX network.',
  },
]

export default function Concierge({ isActive, onNavigate }) {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const imgRef     = useRef(null)

  // ── Entrance animation — text + image fade in when scene activates ─────────
  useEffect(() => {
    if (!isActive) return
    const el = contentRef.current
    if (!el) return

    // Image subtle scale entrance
    gsap.fromTo(imgRef.current,
      { scale: 1.06 },
      { scale: 1, duration: 1.8, ease: 'power2.out' },
    )

    // Text block fade + rise
    const items = el.querySelectorAll('[data-reveal]')
    gsap.fromTo(items,
      { y: 22, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.75, ease: 'power3.out', stagger: 0.09, delay: 0.2 },
    )
  }, [isActive])

  return (
    <div
      ref={sectionRef}
      className="absolute inset-0 bg-charcoal overflow-hidden"
    >
      {/*
        Two-column CSS Grid (no scroll, no ScrollTrigger).
        Left col: image with overlay.
        Right col: editorial copy.
        Collapses to single column on narrow viewports.
      */}
      <div className="grid h-full" style={{ gridTemplateColumns: '45% 55%' }}>

        {/* ── LEFT — image ────────────────────────────────── */}
        <div className="relative overflow-hidden border-r border-mocha-cream/[0.07]">
          <div
            ref={imgRef}
            className="absolute inset-0"
            style={{ willChange: 'transform' }}
          >
            <img
              src={CONCIERGE_IMG}
              alt="Luxury key handover"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* Directional overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(10,10,10,0.52) 0%, rgba(10,10,10,0.15) 55%, rgba(20,20,20,0.48) 100%)',
              }}
            />
            {/* Right edge blend */}
            <div
              className="absolute top-0 right-0 bottom-0 w-20"
              style={{ background: 'linear-gradient(to right, transparent, rgba(20,20,20,0.92))' }}
            />
          </div>

          {/* Decorative corner marks */}
          <div className="absolute top-8 left-8  w-9 h-9 border-t border-l border-burlywood/15 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-9 h-9 border-b border-r border-burlywood/15 pointer-events-none" />

          {/* Vertical label */}
          <div
            className="absolute top-1/2 left-5 pointer-events-none"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)' }}
          >
            <span className="font-mono text-[8px] tracking-[0.5em] text-mocha-cream/18 uppercase">
              Concierge Operations
            </span>
          </div>
        </div>

        {/* ── RIGHT — editorial copy ───────────────────────── */}
        <div
          ref={contentRef}
          className="flex flex-col justify-center px-12 py-16 lg:px-16 gap-y-10 overflow-y-auto"
        >

          {/* Section heading */}
          <div data-reveal className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-3">
              <div className="h-px w-5 bg-burlywood/40" />
              <span className="font-mono text-[9px] tracking-[0.6em] text-burlywood/55 uppercase">
                White-Glove Service
              </span>
            </div>
            <h2
              className="font-serif text-shimmer leading-[0.94]"
              style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)', letterSpacing: '-0.01em' }}
            >
              Every Detail.
              <br />
              Considered.
            </h2>
          </div>

          {/* Perk rows */}
          {PERKS.map((perk) => (
            <div
              key={perk.label}
              data-reveal
              className="border-t border-mocha-cream/[0.09] pt-6"
            >
              <div className="grid gap-x-6 items-start" style={{ gridTemplateColumns: '80px 1fr' }}>
                <span className="font-mono text-[9px] tracking-[0.4em] text-burlywood/42 uppercase pt-0.5">
                  {perk.label}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-platinum mb-2 leading-snug">
                    {perk.title}
                  </h3>
                  <p className="font-sans text-sm text-mocha-cream/38 leading-relaxed">
                    {perk.body}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* CTA */}
          <div data-reveal className="flex items-center gap-x-5 pt-1">
            <button
              onClick={() => onNavigate(3)}
              className="font-mono text-[10px] tracking-[0.45em] text-burlywood border border-burlywood/30 px-7 py-3 hover:bg-burlywood/10 hover:border-burlywood/55 transition-all duration-300 uppercase"
            >
              Request Concierge
            </button>
            <span className="font-mono text-[9px] tracking-[0.38em] text-mocha-cream/22">
              Response within 4 hrs
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
