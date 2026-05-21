import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import viosLogo    from '../Assets/vios logo.png'
import mazdaLogo   from '../Assets/mazda 6 logo.png'
import xpanderLogo from '../Assets/xpander logo.png'

import viosVid    from '../Assets/videos/Vios showcase.mp4'
import mazda6Vid  from '../Assets/videos/Mazda6 showcase.mp4'
import xpanderVid from '../Assets/videos/xpander showcase.mp4'

const FLEET = [
  {
    id: 'vios', brand: 'Toyota', model: 'Vios', tagline: 'Urban Elegance',
    logo: viosLogo, video: viosVid,
    logoProps: { className: 'h-24 w-auto object-contain ml-2' },
    daily: 85,  insurance: 'Fully Covered', mileage: '300 km / day', fuel: 'Full → Full',
    engine: '1.5L DOHC Dual VVT-i', zeroSixty: '9.8 sec', topSpeed: '175 km/h', power: '107 hp',
  },
  {
    id: 'mazda6', brand: 'Mazda', model: '6', tagline: 'Performance Redefined',
    logo: mazdaLogo, video: mazda6Vid,
    logoProps: { className: 'h-16 w-auto object-contain -ml-6' },
    daily: 145, insurance: 'Fully Covered', mileage: '350 km / day', fuel: 'Full → Full',
    engine: '2.5L SkyActiv-G',       zeroSixty: '7.2 sec', topSpeed: '220 km/h', power: '187 hp',
  },
  {
    id: 'xpander', brand: 'Mitsubishi', model: 'Xpander', tagline: 'Commanding Presence',
    logo: xpanderLogo, video: xpanderVid,
    logoProps: { className: 'h-32 w-auto object-contain ml-0' },
    daily: 110, insurance: 'Fully Covered', mileage: '400 km / day', fuel: 'Full → Full',
    engine: '1.5L MIVEC DOHC',        zeroSixty: '11.2 sec', topSpeed: '185 km/h', power: '105 hp',
  },
]

// ── Micro-components ──────────────────────────────────────────────────────────

function SpecLabel({ children, right }) {
  return (
    <div style={{
      fontFamily:    '"Inter", system-ui, sans-serif',
      fontSize:      '11px',
      letterSpacing: '0.34em',
      textTransform: 'uppercase',
      color:         'rgba(232,220,196,0.6)',
      marginBottom:  '4px',
      textAlign:     right ? 'right' : 'left',
    }}>
      {children}
    </div>
  )
}

function SpecVal({ children, right }) {
  return (
    <div style={{
      fontFamily:    '"Inter", system-ui, sans-serif',
      fontSize:      '20px',
      fontWeight:    700,
      letterSpacing: '0.02em',
      color:         '#f4f4f5',
      textAlign:     right ? 'right' : 'left',
    }}>
      {children}
    </div>
  )
}

function SpecRow({ label, value, right }) {
  return (
    <div>
      <SpecLabel right={right}>{label}</SpecLabel>
      <SpecVal   right={right}>{value}</SpecVal>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function Fleet({ isActive, onNavigate }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const lockRef     = useRef(false)
  const firstActive = useRef(true)

  const leftRef  = useRef(null)
  const rightRef = useRef(null)
  const videoRef = useRef(null)
  const deckRef  = useRef(null)

  const car = FLEET[activeIdx]

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.src = FLEET[0].video
    v.load()
    v.play().catch(() => {})
  }, [])

  useEffect(() => {
    if (!isActive) return
    const delay = firstActive.current ? 0.15 : 0
    if (firstActive.current) firstActive.current = false

    gsap.killTweensOf([leftRef.current, rightRef.current, videoRef.current, deckRef.current])
    gsap.set(leftRef.current,  { autoAlpha: 0, x: -28 })
    gsap.set(rightRef.current, { autoAlpha: 0, x:  28 })
    gsap.set(videoRef.current, { autoAlpha: 0, filter: 'blur(0px)' })
    gsap.set(deckRef.current,  { autoAlpha: 0, y: 16 })

    const tl = gsap.timeline({ delay })
    tl.to([leftRef.current, rightRef.current],
      { autoAlpha: 1, x: 0, duration: 0.68, ease: 'power3.out', stagger: 0 })
    tl.fromTo(videoRef.current,
      { autoAlpha: 0, filter: 'blur(24px)' },
      { autoAlpha: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
      '-=0.46')
    tl.to(deckRef.current,
      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.38')
  }, [isActive])

  const goTo = useCallback((nextIdx) => {
    if (lockRef.current) return
    if (nextIdx < 0 || nextIdx >= FLEET.length) return
    if (nextIdx === activeIdx) return
    lockRef.current = true

    const tl = gsap.timeline({ onComplete: () => { lockRef.current = false } })

    tl.to([leftRef.current, rightRef.current],
      { opacity: 0, y: 10, duration: 0.26, ease: 'power2.in', stagger: 0.03 })
    tl.to(videoRef.current,
      { filter: 'blur(20px)', opacity: 0.15, duration: 0.28, ease: 'power2.in' }, '<')
    tl.call(() => {
      setActiveIdx(nextIdx)
      const v = videoRef.current
      if (v) { v.src = FLEET[nextIdx].video; v.load(); v.play().catch(() => {}) }
    })
    tl.to({}, { duration: 0.05 })
    tl.fromTo([leftRef.current, rightRef.current],
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.56, ease: 'power2.inOut', stagger: 0.03 })
    tl.fromTo(videoRef.current,
      { filter: 'blur(20px)', opacity: 0.15 },
      { filter: 'blur(0px)',  opacity: 1,   duration: 0.72, ease: 'power2.inOut' }, '<')
  }, [activeIdx])

  useEffect(() => {
    if (!isActive) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(activeIdx + 1)
      if (e.key === 'ArrowLeft')  goTo(activeIdx - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, activeIdx, goTo])

  return (
    <div
      className="absolute inset-0 bg-obsidian overflow-hidden"
      style={{ paddingTop: '88px', display: 'flex', flexDirection: 'column' }}
    >

      <div style={{
        flex:                '1 1 0%',
        minHeight:           0,
        display:             'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows:    '1fr',
        alignItems:          'stretch',
      }}>

        {/* ── LEFT: Identity & Specs ──────────────────────────────── */}
        <div
          ref={leftRef}
          style={{
            gridColumn:    '1 / span 2',
            display:       'flex',
            flexDirection: 'column',
            justifyContent:'center',
            padding:       '40px 8px 40px 48px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '34px' }}>

            <img
              src={car.logo}
              alt={car.brand}
              {...car.logoProps}
              style={{ objectPosition: 'left center', display: 'block' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <SpecRow label="Engine"     value={car.engine}    />
              <SpecRow label="0 — 60 mph" value={car.zeroSixty} />
              <SpecRow label="Top Speed"  value={car.topSpeed}  />
              <SpecRow label="Power"      value={car.power}     />
            </div>

          </div>
        </div>

        {/* ── CENTER: Cinematic Video ─────────────────────────────── */}
        {/*
          position:relative with NO overflow:hidden on this column.
          The arc divs (below) are siblings to the video container and can
          bleed outside the column via top/bottom:-10vh without being clipped
          here. The outer Fleet wrapper's overflow-hidden clips them cleanly.
        */}
        <div style={{ gridColumn: '3 / span 8', position: 'relative' }}>

          {/* Ambient halo */}
          <div style={{
            position:      'absolute', inset: 0,
            display:       'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', zIndex: 0,
          }}>
            <div style={{
              width:        '72%',
              height:       '65%',
              borderRadius: '50%',
              background:   'radial-gradient(ellipse, rgba(222,184,135,0.06) 0%, transparent 70%)',
              filter:       'blur(64px)',
            }} />
          </div>

          {/*
            Video layer — overflow:hidden is scoped here only, clipping the
            video and overlays to the column bounds. The arc divs are NOT
            inside this wrapper; they live as siblings so their overscaled
            top/bottom is not chopped by this overflow constraint.
          */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
            <div style={{
              position:        'absolute',
              inset:           0,
              maskImage:       'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
            }}>
              <video
                ref={videoRef}
                autoPlay loop muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Top & bottom cinematic burn */}
              <div style={{
                position:      'absolute', inset: 0,
                background:    'linear-gradient(to bottom, rgba(10,10,10,0.62) 0%, transparent 22%, transparent 74%, rgba(10,10,10,0.75) 100%)',
                pointerEvents: 'none', zIndex: 2,
              }} />

              {/* Centre-to-edge vignette */}
              <div style={{
                position:      'absolute', inset: 0,
                background:    'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(10,10,10,0.4) 100%)',
                mixBlendMode:  'multiply',
                pointerEvents: 'none', zIndex: 3,
              }} />
            </div>
          </div>

          {/*
            ── Left open arc  (  ─────────────────────────────────────
            Sibling to the video container — NOT inside overflow:hidden.
            Positioned relative to the center column (position:relative above).

            top:-10vh / bottom:-10vh pushes the arc 10vh beyond the column on
            each end. The Fleet wrapper's overflow-hidden clips those extensions,
            hiding the pinched poles of the 50%-radius ellipse. What remains is
            the graceful mid-sweep of the ( curve.

            border-l-[6px]: only the LEFT edge of the vertical ellipse is drawn,
            tracing the ( arc. All other borders are explicitly zeroed.
            drop-shadow traces only rendered pixels — the glow hugs the arc line.
          */}
          <div
            className="absolute left-[1vw] w-[15vw] pointer-events-none z-30 hidden md:block border-l-[3px] border-t-0 border-r-0 border-b-0 border-burlywood drop-shadow-[0_0_15px_rgba(222,184,135,0.8)]"
            style={{ borderRadius: '50%', top: '-10vh', bottom: '-10vh' }}
          />

          {/*
            ── Right open arc  )  ────────────────────────────────────
            Mirror geometry. border-r-[6px] draws only the RIGHT edge of the
            right-positioned vertical ellipse — the ) arc.
          */}
          <div
            className="absolute right-[1vw] w-[15vw] pointer-events-none z-30 hidden md:block border-r-[3px] border-t-0 border-l-0 border-b-0 border-burlywood drop-shadow-[0_0_15px_rgba(222,184,135,0.8)]"
            style={{ borderRadius: '50%', top: '-10vh', bottom: '-10vh' }}
          />

        </div>

        {/* ── RIGHT: Financials & Booking ─────────────────────────── */}
        <div
          ref={rightRef}
          style={{
            gridColumn:    '11 / span 2',
            display:       'flex',
            flexDirection: 'column',
            justifyContent:'center',
            padding:       '40px 48px 40px 8px',
            textAlign:     'right',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            <div style={{
              fontFamily:    '"Inter", system-ui, sans-serif',
              fontSize:      '11px',
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              color:         'rgba(232,220,196,0.6)',
              marginBottom:  '8px',
              textAlign:     'right',
            }}>
              Daily Rate
            </div>

            <div style={{
              display:        'flex',
              alignItems:     'flex-start',
              justifyContent: 'flex-end',
              gap:            '3px',
              marginBottom:   '4px',
            }}>
              <span style={{
                fontFamily:    '"Inter", system-ui, sans-serif',
                fontSize:      '18px',
                color:         'rgba(232,220,196,0.32)',
                letterSpacing: '0.04em',
                marginTop:     '14px',
              }}>
                $
              </span>
              <span style={{
                fontFamily:    '"Cinzel", Georgia, serif',
                fontSize:      'clamp(4.5rem, 7vw, 7.5rem)',
                letterSpacing: '-0.025em',
                color:         '#f4f4f5',
                lineHeight:    1,
              }}>
                {car.daily}
              </span>
            </div>

            <div style={{
              fontFamily:    '"Inter", system-ui, sans-serif',
              fontSize:      '11px',
              letterSpacing: '0.18em',
              color:         'rgba(232,220,196,0.28)',
              textAlign:     'right',
              marginBottom:  '22px',
            }}>
              per day, excl. taxes
            </div>

            <div style={{ height: '1px', background: 'rgba(232,220,196,0.08)', marginBottom: '20px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '26px' }}>
              <SpecRow label="Insurance"     value={car.insurance} right />
              <SpecRow label="Daily Mileage" value={car.mileage}   right />
              <SpecRow label="Fuel Policy"   value={car.fuel}      right />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => onNavigate && onNavigate(2)}
                style={{
                  fontFamily:    '"Inter", system-ui, sans-serif',
                  fontSize:      '11px',
                  letterSpacing: '0.36em',
                  textTransform: 'uppercase',
                  color:         '#deb887',
                  background:    'transparent',
                  padding:       '11px 24px',
                  border:        '1px solid rgba(222,184,135,0.28)',
                  borderRadius:  '3px',
                  cursor:        'pointer',
                  whiteSpace:    'nowrap',
                  transition:    'border-color 0.3s ease, background 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(222,184,135,0.62)'
                  e.currentTarget.style.background   = 'rgba(222,184,135,0.07)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(222,184,135,0.28)'
                  e.currentTarget.style.background   = 'transparent'
                }}
              >
                Reserve Now
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ── Control Deck ─────────────────────────────────────────── */}
      <div
        ref={deckRef}
        style={{
          flex:           '0 0 auto',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '40px',
          padding:        '16px 0 34px',
        }}
      >

        <button
          onClick={() => goTo(activeIdx - 1)}
          disabled={activeIdx === 0}
          style={{
            display:    'flex',
            alignItems: 'center',
            background: 'transparent',
            border:     'none',
            padding:    '8px',
            cursor:     activeIdx === 0 ? 'not-allowed' : 'pointer',
            color:      activeIdx === 0 ? 'rgba(232,220,196,0.12)' : 'rgba(232,220,196,0.48)',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={e => { if (activeIdx > 0) e.currentTarget.style.color = '#deb887' }}
          onMouseLeave={e => {
            e.currentTarget.style.color = activeIdx === 0
              ? 'rgba(232,220,196,0.12)' : 'rgba(232,220,196,0.48)'
          }}
        >
          <ChevronLeft size={20} strokeWidth={1.3} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {FLEET.map((f, i) => (
            <button
              key={f.id}
              onClick={() => goTo(i)}
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           '9px',
                background:    'transparent',
                border:        'none',
                cursor:        'pointer',
                padding:       '4px 0',
              }}
            >
              <div style={{
                width:        i === activeIdx ? '48px' : '18px',
                height:       '2px',
                borderRadius: '2px',
                background:   i === activeIdx ? '#deb887' : 'rgba(232,220,196,0.2)',
                boxShadow:    i === activeIdx
                  ? '0 0 12px rgba(222,184,135,0.75), 0 0 4px rgba(222,184,135,1)'
                  : 'none',
                transition:   'width 0.46s ease, background 0.46s ease, box-shadow 0.46s ease',
              }} />
              <div style={{
                fontFamily:    '"Inter", system-ui, sans-serif',
                fontSize:      '9px',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color:         i === activeIdx ? 'rgba(222,184,135,0.85)' : 'rgba(232,220,196,0.26)',
                transition:    'color 0.46s ease',
              }}>
                {f.model}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => goTo(activeIdx + 1)}
          disabled={activeIdx === FLEET.length - 1}
          style={{
            display:    'flex',
            alignItems: 'center',
            background: 'transparent',
            border:     'none',
            padding:    '8px',
            cursor:     activeIdx === FLEET.length - 1 ? 'not-allowed' : 'pointer',
            color:      activeIdx === FLEET.length - 1 ? 'rgba(232,220,196,0.12)' : 'rgba(232,220,196,0.48)',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={e => { if (activeIdx < FLEET.length - 1) e.currentTarget.style.color = '#deb887' }}
          onMouseLeave={e => {
            e.currentTarget.style.color = activeIdx === FLEET.length - 1
              ? 'rgba(232,220,196,0.12)' : 'rgba(232,220,196,0.48)'
          }}
        >
          <ChevronRight size={20} strokeWidth={1.3} />
        </button>

      </div>

    </div>
  )
}
