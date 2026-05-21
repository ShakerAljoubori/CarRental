import { useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null)
  const flashRef     = useRef(null)
  const buttonRef    = useRef(null)
  const ringRef      = useRef(null)
  const [fired, setFired] = useState(false)

  // ── Outer ring slow rotation ──────────────────────────────────────────────
  useGSAP(() => {
    gsap.to(ringRef.current, {
      rotation: 360,
      transformOrigin: '50% 50%',
      repeat: -1,
      duration: 18,
      ease: 'none',
    })
  }, { scope: containerRef })

  // ── Ignition — cinematic white flash ─────────────────────────────────────
  const handleIgnite = useCallback(() => {
    if (fired) return
    setFired(true)

    const tl = gsap.timeline()

    // Micro button press feedback
    tl.to(buttonRef.current, { scale: 0.96, duration: 0.08, ease: 'power2.in' })
    tl.to(buttonRef.current, { scale: 1.0,  duration: 0.12, ease: 'power2.out' })

    // Blinding white flash — instant hit, like a strobe
    tl.to(flashRef.current, {
      autoAlpha: 1,
      duration:  0.13,
      ease:      'power4.out',
    }, '+=0.04')

    // Short hold at white
    tl.to({}, { duration: 0.09 })

    // Fade flash out — reveals whatever is behind (the app)
    tl.to(flashRef.current, {
      autoAlpha: 0,
      duration:  0.95,
      ease:      'power2.inOut',
    })

    // Preloader dissolves — starts just as flash begins to fade
    // onComplete fires so App can reveal scene 0 underneath
    tl.to(containerRef.current, {
      autoAlpha: 0,
      duration:  0.5,
      ease:      'power2.out',
      onStart:   onComplete,   // fire during dissolve so scene 0 rises in parallel
    }, '-=0.75')
  }, [fired, onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9000] bg-obsidian flex items-center justify-center select-none"
    >
      {/* ── Decorative corner brackets ──────────────────────── */}
      <div className="absolute top-8 left-8   w-10 h-10 border-t border-l border-mocha-cream/[0.12] pointer-events-none" />
      <div className="absolute top-8 right-8  w-10 h-10 border-t border-r border-mocha-cream/[0.12] pointer-events-none" />
      <div className="absolute bottom-8 left-8  w-10 h-10 border-b border-l border-mocha-cream/[0.12] pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-mocha-cream/[0.12] pointer-events-none" />

      {/* ── Brand wordmark ──────────────────────────────────── */}
      <div className="absolute top-9 left-1/2 -translate-x-1/2 flex items-center gap-x-3">
        <span className="font-serif text-[10px] tracking-[0.7em] text-mocha-cream/32">APEX</span>
        <div className="w-px h-3 bg-burlywood/22" />
        <span className="font-serif text-[10px] tracking-[0.7em] text-mocha-cream/32">CLUB</span>
      </div>

      {/* ── Central mechanism ───────────────────────────────── */}
      <div className="flex flex-col items-center gap-y-10">

        {/* Outer slowly-rotating arc ring */}
        <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
          <svg
            ref={ringRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
          >
            {/* Dim base circle */}
            <circle cx="100" cy="100" r="92" stroke="rgba(232,220,196,0.06)" strokeWidth="0.5" />

            {/* Sparse tick marks */}
            {Array.from({ length: 24 }, (_, i) => {
              const a = ((i * 15) - 90) * (Math.PI / 180)
              const len = i % 6 === 0 ? 8 : 4
              return (
                <line
                  key={i}
                  x1={100 + (92 - len) * Math.cos(a)} y1={100 + (92 - len) * Math.sin(a)}
                  x2={100 + 92 * Math.cos(a)}          y2={100 + 92 * Math.sin(a)}
                  stroke={i % 6 === 0 ? 'rgba(222,184,135,0.35)' : 'rgba(232,220,196,0.1)'}
                  strokeWidth="0.6"
                />
              )
            })}

            {/* Single burlywood arc sweep */}
            <circle
              cx="100" cy="100" r="92"
              stroke="#deb887" strokeWidth="0.8"
              strokeDasharray="60 518" strokeLinecap="round"
              opacity="0.7"
            />
          </svg>

          {/*
            Ignition button — purely elegant.
            No matrix, no split halves needed here.
            CSS breathing glow via .ignition-glow class.
            On click → cinematic flash.
          */}
          <button
            ref={buttonRef}
            onClick={handleIgnite}
            className="ignition-glow relative rounded-full flex items-center justify-center focus:outline-none z-10"
            style={{
              width:      148,
              height:     148,
              background: 'radial-gradient(ellipse at center, rgba(222,184,135,0.1) 0%, rgba(10,10,10,0.9) 70%)',
              border:     '1px solid rgba(222,184,135,0.42)',
            }}
            aria-label="Ignite engine"
          >
            <div className="flex flex-col items-center gap-y-1">
              <span className="font-serif text-burlywood tracking-[0.45em]"
                    style={{ fontSize: '1.35rem' }}>
                IGNITE
              </span>
              <div className="w-8 h-px bg-burlywood/30" />
            </div>
          </button>
        </div>

        <p className="font-mono text-[9px] tracking-[0.65em] text-mocha-cream/22 uppercase">
          Press to Start Engine
        </p>
      </div>

      {/* ── Bottom label ────────────────────────────────────── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-y-2">
        <div className="w-px h-5 bg-burlywood/20" />
        <span className="font-mono text-[8px] tracking-[0.6em] text-mocha-cream/20 uppercase">
          Invitation Only
        </span>
      </div>

      {/*
        ── Cinematic white flash ────────────────────────────────
        Sits above everything in the preloader.
        GSAP fades it to autoAlpha: 1 on ignition, then back to 0.
        The backdropFilter blurs the edges as it bleeds into the scene below.
      */}
      <div
        ref={flashRef}
        className="absolute inset-0 z-20"
        style={{
          background:     'white',
          visibility:     'hidden',
          opacity:        0,
          backdropFilter: 'blur(14px)',
        }}
      />
    </div>
  )
}
