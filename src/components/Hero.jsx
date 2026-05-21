import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

import carImg      from '../Assets/Mazda6.png'
import xpanderImg  from '../Assets/xpander.png'
import roadImg     from '../Assets/road.jpg'

const XPANDER_FILTER = 'brightness(0.80) drop-shadow(0 24px 48px rgba(0,0,0,0.99)) drop-shadow(0 0 28px rgba(110,15,10,0.2))'
const MAZDA_FILTER   = 'brightness(0.65) drop-shadow(0 24px 48px rgba(0,0,0,0.99)) drop-shadow(0 0 30px rgba(110,15,10,0.25))'

export default function Hero({ isActive, onNavigate }) {
  const headlineRef    = useRef(null)
  const panelRef       = useRef(null)
  const ctaRef         = useRef(null)
  const carRef         = useRef(null)
  const xpanderRef     = useRef(null)
  const xpanderBeamRef = useRef(null)
  const mazdaBeamRef   = useRef(null)
  const firstActive    = useRef(true)

  useEffect(() => {
    if (!isActive) return

    const car     = carRef.current
    const xpander = xpanderRef.current
    const isFirst = firstActive.current
    if (isFirst) firstActive.current = false

    gsap.killTweensOf([
      car, xpander,
      xpanderBeamRef.current, mazdaBeamRef.current,
      panelRef.current, headlineRef.current, ctaRef.current,
    ])

    // ── Xpander entrance ──────────────────────────────────────────────────
    gsap.set(xpander, {
      x: '-12vw', y: '-11vh', scale: 0.15,
      filter: 'blur(4px)', autoAlpha: 0,
      transformOrigin: 'center bottom',
    })
    const tl2 = gsap.timeline({ delay: isFirst ? 0.72 : 0 })
    tl2.set(xpander, { autoAlpha: 1 })
    tl2.to(xpander, { x: '2vw', y: 0, scale: 1.05, filter: 'blur(26px)', duration: 0.55, ease: 'expo.out' })
    tl2.to(xpander, { x: 0,     y: 0, scale: 1,    duration: 0.42,       ease: 'power4.out' })
    tl2.to(xpander, { filter: 'blur(0px)', duration: 0.65, ease: 'power2.out' }, '<')

    // ── Mazda entrance — first, Xpander catches up ────────────────────────
    gsap.set(car, {
      x: '-38vw', y: '-13vh', scale: 0.15,
      filter: 'blur(4px)', autoAlpha: 0,
      transformOrigin: 'center bottom',
    })
    const tl = gsap.timeline({ delay: isFirst ? 0.5 : 0 })
    tl.set(car, { autoAlpha: 1 })
    tl.to(car, { x: '3vw', y: 0, scale: 1.05, filter: 'blur(28px)', duration: 0.55, ease: 'expo.out' })
    tl.to(car, { x: 0,     y: 0, scale: 1,    duration: 0.42,       ease: 'power4.out' })
    tl.to(car, { filter: 'blur(0px)', duration: 0.65, ease: 'power2.out' }, '<')

    tl.fromTo(panelRef.current,
      { y: -12, autoAlpha: 0 },
      { y: 0,   autoAlpha: 1, duration: 0.65, ease: 'power3.out' },
      '-=0.18',
    )
    tl.fromTo(ctaRef.current,
      { y: 14, autoAlpha: 0 },
      { y: 0,  autoAlpha: 1, duration: 0.55, ease: 'power3.out' },
      '-=0.3',
    )

    gsap.set(headlineRef.current, { y: 20, autoAlpha: 0 })
    tl.to(headlineRef.current, {
      y: 0, autoAlpha: 1, duration: 0.85, ease: 'power4.out',
    }, '-=0.25')

    // ── Idle effects ─────────────────────────────────────────────────────
    const entranceDuration = (isFirst ? 0.72 : 0) + 0.55 + 0.42 + 0.65 + 0.3
    const idleDelay = entranceDuration * 1000

    const idleTimer = setTimeout(() => {
      gsap.to(xpanderBeamRef.current, { opacity: 0.7, duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true })
      gsap.to(mazdaBeamRef.current,   { opacity: 0.6, duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.8 })
    }, idleDelay)

    return () => {
      clearTimeout(idleTimer)
      gsap.killTweensOf([xpanderBeamRef.current, mazdaBeamRef.current])
    }
  }, [isActive])

  return (
    <div className="absolute inset-0 bg-obsidian overflow-hidden">

      {/* ── Road background ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img
          src={roadImg} alt="" draggable={false} loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 50%', filter: 'blur(2px)' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.32)' }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.72) 14%, transparent 32%, transparent 82%, rgba(10,10,10,0.4) 94%, #0a0a0a 100%)',
        }} />
        <div className="absolute top-0 left-0 right-0" style={{
          height: '48%',
          background: 'linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.82) 30%, rgba(10,10,10,0.4) 65%, transparent 100%)',
        }} />
        <div className="absolute bottom-0 left-0 right-0" style={{
          height: '18%',
          background: 'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.5) 55%, transparent 100%)',
        }} />
      </div>

      {/* ── Ambient glow ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute', right: '18%', bottom: '12%',
          width: '40vw', height: '32vh', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(222,184,135,0.1) 0%, rgba(222,184,135,0.03) 50%, transparent 72%)',
          filter: 'blur(55px)', mixBlendMode: 'screen',
        }} />
      </div>

      {/* ── Ground headlight beams ────────────────────────────────── */}
      <div
        ref={xpanderBeamRef}
        className="pointer-events-none"
        style={{
          position:     'absolute',
          right:        '22%',
          bottom:       '9vh',
          width:        '26vw',
          height:       '6vh',
          borderRadius: '50%',
          background:   'radial-gradient(ellipse at 12% 50%, rgba(255,248,200,0.7) 0%, rgba(222,184,135,0.3) 40%, transparent 72%)',
          filter:       'blur(18px)',
          mixBlendMode: 'screen',
          zIndex:       2,
          opacity:      0,
        }}
      />
      <div
        ref={mazdaBeamRef}
        className="pointer-events-none"
        style={{
          position:     'absolute',
          right:        '3%',
          bottom:       '14vh',
          width:        '18vw',
          height:       '4vh',
          borderRadius: '50%',
          background:   'radial-gradient(ellipse at 12% 50%, rgba(255,248,200,0.65) 0%, rgba(222,184,135,0.25) 40%, transparent 72%)',
          filter:       'blur(15px)',
          mixBlendMode: 'screen',
          zIndex:       2,
          opacity:      0,
        }}
      />

      {/* ── Xpander ─────────────────────────────────────────────── */}
      <div
        ref={xpanderRef}
        className="pointer-events-none"
        style={{ position: 'absolute', right: '37%', bottom: '13vh', zIndex: 3, willChange: 'transform, filter, opacity' }}
      >
        <img
          src={xpanderImg} alt="APEX CLUB Xpander" draggable={false}
          className="w-auto object-contain"
          style={{
            height: 'clamp(200px, 40vh, 475px)',
            transform: 'scaleX(-1)',
            filter: XPANDER_FILTER,
            display: 'block',
          }}
        />
      </div>

      {/* ── Mazda 6 ──────────────────────────────────────────────── */}
      <div
        ref={carRef}
        className="pointer-events-none"
        style={{ position: 'absolute', right: '14%', bottom: '21vh', zIndex: 2, willChange: 'transform, filter, opacity' }}
      >
        <img
          src={carImg} alt="APEX CLUB Mazda 6" draggable={false}
          className="w-auto object-contain"
          style={{
            height: 'clamp(150px, 29vh, 320px)',
            transform: 'scaleX(-1)',
            filter: MAZDA_FILTER,
            display: 'block',
          }}
        />
      </div>

      {/* ── Text ─────────────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center text-center pointer-events-none"
        style={{ paddingTop: '88px', zIndex: 5 }}
      >
        <div ref={panelRef} style={{ maxWidth: 'min(1400px, 92vw)', padding: '0 32px' }}>
          <div style={{ paddingBottom: '20px', marginTop: '36px' }}>
            <h1
              ref={headlineRef}
              className="font-serif leading-none whitespace-nowrap"
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 6.5rem)',
                letterSpacing: '-0.01em',
                color: '#e8dcc4',
                textShadow: '0 2px 40px rgba(0,0,0,1), 0 8px 80px rgba(0,0,0,0.95)',
              }}
            >
              <span className="text-shimmer">THE PINNACLE OF </span>
              <span
                className="word-motion italic"
                style={{
                  fontFamily:          '"Cormorant Garamond", Georgia, serif',
                  fontWeight:          600,
                  color:               '#deb887',
                  WebkitTextFillColor: '#deb887',
                  textShadow:          '0 0 40px rgba(222,184,135,0.6), 0 0 80px rgba(222,184,135,0.3)',
                  fontSize:            '1.15em',
                }}
              >
                MOTION
              </span>
            </h1>
          </div>
          <p className="font-sans text-2xl text-mocha-cream/65 leading-relaxed mt-1">
            Curated hypercars. Zero compromise. Absolute discretion.
          </p>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <div
        ref={ctaRef}
        className="absolute bottom-16 left-0 right-0 flex justify-center px-10"
        style={{ zIndex: 5 }}
      >
        <button
          onClick={() => onNavigate(1)}
          className="btn-ghost font-sans font-medium uppercase"
          style={{
            fontSize: '14px', letterSpacing: '0.22em',
            color: '#e8dcc4', background: 'transparent',
            padding: '16px 60px',
            border: '1px solid rgba(232,220,196,0.45)',
          }}
        >
          Explore Fleet
        </button>
      </div>

    </div>
  )
}
