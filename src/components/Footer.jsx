import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function Footer({ isActive, onNavigate }) {
  const sectionRef  = useRef(null)
  const headlineRef = useRef(null)
  const ctaRef      = useRef(null)
  const metaRef     = useRef(null)

  // ── Entrance — headline and CTA emerge on scene activation ───────────────
  useEffect(() => {
    if (!isActive) return

    // Headline — character-feel scale + letter-spacing burst into place
    gsap.fromTo(headlineRef.current,
      { scale: 0.88, autoAlpha: 0, letterSpacing: '-0.04em' },
      {
        scale:         1,
        autoAlpha:     1,
        letterSpacing: '0.06em',
        duration:      1.1,
        ease:          'power4.out',
        delay:         0.1,
      },
    )

    gsap.fromTo(ctaRef.current,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', delay: 0.55 },
    )

    gsap.fromTo(metaRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.6, ease: 'power2.out', delay: 0.8 },
    )
  }, [isActive])

  // ── Subtle headline breathing (looping, plays always when mounted) ─────────
  useEffect(() => {
    const tween = gsap.to(headlineRef.current, {
      letterSpacing: '0.1em',
      duration:      4,
      ease:          'sine.inOut',
      repeat:        -1,
      yoyo:          true,
      delay:         1.2,  // starts after entrance animation
    })
    return () => tween.kill()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="absolute inset-0 bg-obsidian overflow-hidden flex flex-col"
    >
      {/* ── Ambient burlywood glow — centered, wide ───────── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <div
          style={{
            width:        '80vw',
            height:       '40vh',
            background:   'radial-gradient(ellipse, rgba(222,184,135,0.08) 0%, transparent 65%)',
            filter:       'blur(60px)',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* ── Main scene content ───────────────────────────── */}
      <div className="relative flex-1 flex flex-col items-center justify-center gap-y-10 px-10" style={{ zIndex: 2 }}>

        {/* Section label */}
        <div className="flex items-center gap-x-3">
          <div className="h-px w-6 bg-burlywood/30" />
          <span className="font-mono text-[9px] tracking-[0.65em] text-mocha-cream/28 uppercase">
            Membership
          </span>
          <div className="h-px w-6 bg-burlywood/30" />
        </div>

        {/*
          "TAKE THE WHEEL" — fullscreen typographic sculpture.
          whitespace-nowrap ensures it stays one line.
          The breathing GSAP tween expands/contracts letter-spacing.
        */}
        <h2
          ref={headlineRef}
          className="font-serif text-shimmer text-center whitespace-nowrap"
          style={{
            fontSize:      'clamp(2.5rem, 9vw, 9rem)',
            letterSpacing: '0.06em',
            lineHeight:    1,
            willChange:    'transform, letter-spacing',
            opacity:       0,
            visibility:    'hidden',
          }}
        >
          TAKE THE WHEEL
        </h2>

        {/* CTA block */}
        <div
          ref={ctaRef}
          className="flex flex-col items-center gap-y-5"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <button
            className="group relative font-mono text-[11px] tracking-[0.65em] text-obsidian bg-burlywood px-12 py-4 uppercase overflow-hidden hover:bg-mocha-cream transition-colors duration-400"
            onClick={() => window.alert('APEX CLUB — By referral only.')}
          >
            {/* Hover sweep */}
            <span
              className="absolute inset-0 bg-platinum/15 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
              aria-hidden
            />
            <span className="relative z-10">ENTER THE CLUB</span>
          </button>

          <div className="flex items-center gap-x-3">
            <div className="h-px w-4 bg-burlywood/28" />
            <span className="font-mono text-[9px] tracking-[0.5em] text-mocha-cream/28 uppercase">
              By Referral Only
            </span>
            <div className="h-px w-4 bg-burlywood/28" />
          </div>
        </div>
      </div>

      {/* ── Footer meta strip ────────────────────────────── */}
      <div
        ref={metaRef}
        className="relative border-t border-mocha-cream/[0.07]"
        style={{ zIndex: 2, opacity: 0, visibility: 'hidden' }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between px-10 py-6 lg:px-16 gap-y-3">
          <div className="flex items-center gap-x-3">
            <span className="font-serif text-[10px] tracking-[0.65em] text-platinum/50">APEX</span>
            <div className="w-px h-3 bg-burlywood/28" />
            <span className="font-serif text-[10px] tracking-[0.65em] text-burlywood/50">CLUB</span>
          </div>

          <nav className="flex items-center gap-x-8">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="font-mono text-[9px] tracking-[0.4em] text-mocha-cream/22 hover:text-burlywood/55 transition-colors duration-300 uppercase"
              >
                {item}
              </a>
            ))}
          </nav>

          <span className="font-mono text-[8px] tracking-[0.35em] text-mocha-cream/18">
            © MMXXIV APEX CLUB. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </div>
  )
}
