import { useRef, useState, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import imgVios    from '../Assets/vios.png'
import imgCity    from '../Assets/city.png'
import imgMazda6  from '../Assets/Mazda6.png'
import imgXpander from '../Assets/xpander.png'

const CARS = [
  {
    id:       0,
    brand:    'TOYOTA',
    model:    'VIOS',
    tagline:  'Precision. Comfort. Command.',
    hp:       '107',
    sprint:   '9.5',
    topSpeed: '175',
    engine:   '1.5L DOHC Dual VVT-i',
    origin:   'Thailand',
    weight:   '1,050 kg',
    image:    imgVios,
    accent:   'rgba(160,140,90,0.18)',
  },
  {
    id:       1,
    brand:    'HONDA',
    model:    'CITY',
    tagline:  'Urban Elegance Refined.',
    hp:       '121',
    sprint:   '9.2',
    topSpeed: '180',
    engine:   '1.5L DOHC i-VTEC',
    origin:   'Thailand',
    weight:   '1,080 kg',
    image:    imgCity,
    accent:   'rgba(100,130,180,0.18)',
  },
  {
    id:       2,
    brand:    'MAZDA',
    model:    'MAZDA 6',
    tagline:  'Grand Touring Redefined.',
    hp:       '187',
    sprint:   '8.0',
    topSpeed: '210',
    engine:   '2.5L SKYACTIV-G',
    origin:   'Japan',
    weight:   '1,470 kg',
    image:    imgMazda6,
    accent:   'rgba(180,60,60,0.18)',
  },
  {
    id:       3,
    brand:    'MITSUBISHI',
    model:    'XPANDER',
    tagline:  'Space. Power. Presence.',
    hp:       '105',
    sprint:   '11.0',
    topSpeed: '165',
    engine:   '1.5L MIVEC DOHC',
    origin:   'Indonesia',
    weight:   '1,310 kg',
    image:    imgXpander,
    accent:   'rgba(80,120,160,0.18)',
  },
]

export default function Fleet({ isActive, onNavigate }) {
  const sectionRef  = useRef(null)
  const carRef      = useRef(null)    // the <img> tag — receives blur+scale transitions
  const glowRef     = useRef(null)    // ambient light source
  const leftPanel   = useRef(null)
  const rightPanel  = useRef(null)
  const arrowLeft   = useRef(null)
  const arrowRight  = useRef(null)

  const [carIdx, setCarIdx]       = useState(0)
  const [switching, setSwitching] = useState(false)
  const activeCar = CARS[carIdx]

  // ── Car switch — blur-smear out + scale-down emerge ───────────────────────
  const switchCar = useCallback((nextIdx) => {
    if (switching) return
    if (nextIdx < 0 || nextIdx >= CARS.length) return
    if (nextIdx === carIdx) return

    setSwitching(true)

    const tl = gsap.timeline({ onComplete: () => setSwitching(false) })

    // Blur out current car + panels
    tl.to(carRef.current, {
      filter:    'blur(22px)',
      scale:     0.82,
      autoAlpha: 0,
      duration:  0.32,
      ease:      'power3.in',
    })
    tl.to([leftPanel.current, rightPanel.current], {
      filter:    'blur(8px)',
      autoAlpha: 0,
      y:         -12,
      duration:  0.26,
      ease:      'power3.in',
      stagger:   0.04,
    }, '<')

    // Swap car data mid-transition (screen is obscured)
    tl.call(() => setCarIdx(nextIdx))

    // Emerge new car: scale DOWN from 1.3 to 1.0 — user's mandate
    tl.fromTo(carRef.current,
      { filter: 'blur(22px)', scale: 1.3, autoAlpha: 0 },
      { filter: 'blur(0px)',  scale: 1,   autoAlpha: 1, duration: 0.7, ease: 'power4.out' },
    )

    // Spec panels slide back in
    tl.fromTo([leftPanel.current, rightPanel.current],
      { filter: 'blur(8px)', autoAlpha: 0, y: 12 },
      { filter: 'blur(0px)', autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 },
      '<20%',
    )
  }, [carIdx, switching])

  // ── Keyboard left/right (scene Up/Down handled by App) ────────────────────
  useEffect(() => {
    if (!isActive) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') switchCar(carIdx + 1)
      if (e.key === 'ArrowLeft')  switchCar(carIdx - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, carIdx, switchCar])

  // ── Entrance animation when scene becomes active ──────────────────────────
  const hasEntered = useRef(false)
  useEffect(() => {
    if (!isActive) return

    const targets = [carRef.current, leftPanel.current, rightPanel.current].filter(Boolean)
    if (!targets.length) return

    if (hasEntered.current) {
      // Re-entry: gentle re-emerge
      gsap.fromTo(targets,
        { autoAlpha: 0, filter: 'blur(12px)', scale: 1.04 },
        { autoAlpha: 1, filter: 'blur(0px)',  scale: 1, duration: 0.65, ease: 'power3.out', stagger: 0.04 },
      )
      return
    }
    hasEntered.current = true

    // First entry: car scales down from 1.3 into view
    gsap.fromTo(carRef.current,
      { filter: 'blur(20px)', scale: 1.3, autoAlpha: 0 },
      { filter: 'blur(0px)',  scale: 1,   autoAlpha: 1, duration: 0.85, ease: 'power4.out', delay: 0.15 },
    )
    gsap.fromTo([leftPanel.current, rightPanel.current],
      { y: 20, autoAlpha: 0 },
      { y: 0,  autoAlpha: 1, duration: 0.65, ease: 'power3.out', delay: 0.3, stagger: 0.08 },
    )
  }, [isActive])

  return (
    <div ref={sectionRef} className="absolute inset-0 bg-obsidian overflow-hidden flex flex-col">

      {/*
        ── Ambient glow — changes colour subtly per car (accent field).
        Positioned behind the car image.
      */}
      <div
        ref={glowRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <div
          style={{
            width:        '60vw',
            height:       '60vh',
            borderRadius: '50%',
            background:   `radial-gradient(ellipse, ${activeCar.accent} 0%, transparent 70%)`,
            filter:       'blur(100px)',
            mixBlendMode: 'screen',
            transition:   'background 0.8s ease',
          }}
        />
      </div>

      {/*
        ── Three-column layout: spec-left | car-center | spec-right
        CSS Grid with fixed-width panels and flexible center.
        All layout is normal flow — only the car <img> and sweep overlay
        use absolute/fixed.
      */}
      <div
        className="relative flex-1 grid overflow-hidden"
        style={{ gridTemplateColumns: '320px 1fr 300px', zIndex: 2 }}
      >

        {/* ── LEFT spec panel ─────────────────────────────── */}
        <div className="flex flex-col justify-center px-10 py-16 border-r border-mocha-cream/[0.07]">
          <div ref={leftPanel} className="glass-panel-light p-6">

            {/* Car number */}
            <p className="font-mono text-[9px] tracking-[0.6em] text-burlywood/45 mb-5">
              {String(carIdx + 1).padStart(2, '0')} / {String(CARS.length).padStart(2, '0')}
            </p>

            {/* Brand + model */}
            <p className="font-mono text-[9px] tracking-[0.6em] text-burlywood/60 uppercase mb-1.5">
              {activeCar.brand}
            </p>
            <h2
              className="font-serif text-shimmer leading-none mb-2"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.8rem)', letterSpacing: '-0.01em' }}
            >
              {activeCar.model}
            </h2>
            <p className="font-mono text-[10px] tracking-[0.38em] text-mocha-cream/38 uppercase mb-6">
              {activeCar.tagline}
            </p>

            <div className="h-px w-full bg-mocha-cream/10 mb-5" />

            {/* Powertrain data */}
            <div className="space-y-3">
              {[
                ['Engine',    activeCar.engine],
                ['Origin',    activeCar.origin],
                ['Dry Weight', activeCar.weight],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-sans text-[9px] text-mocha-cream/35 mb-0.5">{label}</p>
                  <p className="font-mono text-[11px] text-platinum leading-snug">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTER — car display ─────────────────────────── */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden">

          {/*
            The transparent PNG car.
            GSAP transitions target this element directly (blur + scale).
            drop-shadow gives depth and grounds it on the "stage".
          */}
          <img
            ref={carRef}
            src={activeCar.image}
            alt={`${activeCar.brand} ${activeCar.model}`}
            className="w-auto object-contain relative z-10"
            style={{
              height:     'clamp(220px, 55vh, 580px)',
              filter:     'drop-shadow(0 40px 70px rgba(0,0,0,0.9)) drop-shadow(0 0 60px rgba(0,0,0,0.6))',
              willChange: 'transform, filter, opacity',
            }}
            loading="eager"
          />

          {/* ── Arrow navigation ──────────────────────── */}
          <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-x-6 z-20">
            <button
              ref={arrowLeft}
              onClick={() => switchCar(carIdx - 1)}
              disabled={carIdx === 0 || switching}
              className="flex items-center justify-center w-10 h-10 border border-mocha-cream/15 hover:border-burlywood/40 transition-colors duration-300 disabled:opacity-20"
              aria-label="Previous car"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="#e8dcc4" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-x-2.5">
              {CARS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => switchCar(i)}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width:      i === carIdx ? 20 : 5,
                    height:     1,
                    background:  i === carIdx ? '#deb887' : 'rgba(232,220,196,0.2)',
                    boxShadow:   i === carIdx ? '0 0 6px rgba(222,184,135,0.65)' : 'none',
                  }}
                />
              ))}
            </div>

            <button
              ref={arrowRight}
              onClick={() => switchCar(carIdx + 1)}
              disabled={carIdx === CARS.length - 1 || switching}
              className="flex items-center justify-center w-10 h-10 border border-mocha-cream/15 hover:border-burlywood/40 transition-colors duration-300 disabled:opacity-20"
              aria-label="Next car"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="#e8dcc4" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── RIGHT spec panel ─────────────────────────────── */}
        <div className="flex flex-col justify-center px-10 py-16 border-l border-mocha-cream/[0.07]">
          <div ref={rightPanel} className="flex flex-col gap-y-4">

            {/* 0–60 block */}
            <div className="glass-panel-light p-5">
              <p className="font-mono text-[8px] tracking-[0.55em] text-burlywood/45 uppercase mb-2">
                0 – 60 MPH
              </p>
              <div className="flex items-end gap-x-2">
                <span
                  className="font-serif text-shimmer leading-none"
                  style={{ fontSize: '3.4rem', letterSpacing: '-0.03em' }}
                >
                  {activeCar.sprint}
                </span>
                <span className="font-mono text-xs text-mocha-cream/40 mb-1.5">SEC</span>
              </div>
            </div>

            {/* HP block */}
            <div className="glass-panel-light p-5">
              <p className="font-mono text-[8px] tracking-[0.55em] text-burlywood/45 uppercase mb-2">
                Power Output
              </p>
              <div className="flex items-end gap-x-2">
                <span
                  className="font-serif text-shimmer leading-none"
                  style={{ fontSize: '2.9rem', letterSpacing: '-0.03em' }}
                >
                  {activeCar.hp}
                </span>
                <span className="font-mono text-xs text-mocha-cream/40 mb-1.5">HP</span>
              </div>
              {/* Power bar */}
              <div className="mt-2.5 h-px bg-mocha-cream/10 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full laser-line transition-all duration-700"
                  style={{ width: `${(parseInt(activeCar.hp.replace(',','')) / 1200) * 100}%` }}
                />
              </div>
            </div>

            {/* Vmax block */}
            <div className="glass-panel-light px-5 py-4">
              <p className="font-mono text-[8px] tracking-[0.55em] text-burlywood/45 uppercase mb-1.5">
                V-Max
              </p>
              <span className="font-mono text-lg text-platinum">{activeCar.topSpeed} MPH</span>
            </div>

            {/* Inquire CTA */}
            <button
              onClick={() => onNavigate(3)}
              className="mt-2 font-mono text-[9px] tracking-[0.5em] text-burlywood border border-burlywood/28 py-3 hover:bg-burlywood/10 transition-all duration-300 uppercase"
            >
              Reserve This Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
