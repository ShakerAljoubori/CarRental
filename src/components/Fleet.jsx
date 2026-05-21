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
    id: 'vios', brand: 'Toyota', model: 'Vios', navLabel: 'VIOS', tagline: 'Urban Elegance',
    logo: viosLogo, video: viosVid,
    logoProps: { className: 'h-32 w-auto object-contain ml-2' },
    daily: 85,  insurance: 'Fully Covered', mileage: '300 km / day', fuel: 'Full → Full',
    engine: '1.5L DOHC Dual VVT-i', zeroSixty: '9.8 sec', topSpeed: '175 km/h', power: '107 hp',
  },
  {
    id: 'mazda6', brand: 'Mazda', model: '6', navLabel: 'MAZDA 6', tagline: 'Performance Redefined',
    logo: mazdaLogo, video: mazda6Vid,
    logoProps: { className: 'h-16 w-auto object-contain -ml-6' },
    daily: 145, insurance: 'Fully Covered', mileage: '350 km / day', fuel: 'Full → Full',
    engine: '2.5L SkyActiv-G',       zeroSixty: '7.2 sec', topSpeed: '220 km/h', power: '187 hp',
  },
  {
    id: 'xpander', brand: 'Mitsubishi', model: 'Xpander', navLabel: 'XPANDER', tagline: 'Commanding Presence',
    logo: xpanderLogo, video: xpanderVid,
    logoProps: { className: 'h-40 w-auto object-contain ml-0' },
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
  const lockRef      = useRef(false)
  const firstActive  = useRef(true)
  const pointerDownX = useRef(null)

  const leftRef   = useRef(null)
  const rightRef  = useRef(null)
  const videoARef = useRef(null)   // double-buffer: front
  const videoBRef = useRef(null)   // double-buffer: back (pre-loading)
  const frontRef  = useRef('A')    // which buffer is currently visible
  const deckRef   = useRef(null)

  const car = FLEET[activeIdx]

  useEffect(() => {
    const v = videoARef.current
    if (!v) return
    v.src = FLEET[0].video
    v.load()
    v.play().catch(() => {})
    gsap.set(videoARef.current, { zIndex: 1 })
    if (videoBRef.current) gsap.set(videoBRef.current, { opacity: 0, zIndex: 0 })
  }, [])

  useEffect(() => {
    if (!isActive) return
    const delay = firstActive.current ? 0.15 : 0
    if (firstActive.current) firstActive.current = false

    const frontVideo = frontRef.current === 'A' ? videoARef.current : videoBRef.current
    const backVideo  = frontRef.current === 'A' ? videoBRef.current : videoARef.current

    gsap.killTweensOf([leftRef.current, rightRef.current, videoARef.current, videoBRef.current, deckRef.current])
    gsap.set(leftRef.current,  { autoAlpha: 0, x: -28 })
    gsap.set(rightRef.current, { autoAlpha: 0, x:  28 })
    gsap.set(frontVideo, { autoAlpha: 0, filter: 'blur(0px)', x: 0, scale: 1 })
    gsap.set(backVideo,  { opacity: 0, x: 0, filter: 'blur(0px)', scale: 1 })
    gsap.set(deckRef.current,  { autoAlpha: 0, y: 16 })

    const tl = gsap.timeline({ delay })
    tl.to([leftRef.current, rightRef.current],
      { autoAlpha: 1, x: 0, duration: 0.68, ease: 'power3.out', stagger: 0 })
    tl.fromTo(frontVideo,
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

    const dir   = nextIdx > activeIdx ? 1 : -1
    const front = frontRef.current === 'A' ? videoARef.current : videoBRef.current
    const back  = frontRef.current === 'A' ? videoBRef.current : videoARef.current

    // Load next video into back buffer NOW — gives it ~300ms head-start before we need to show it
    if (back) {
      back.src = FLEET[nextIdx].video
      back.load()
      back.play().catch(() => {})
    }
    gsap.set(back, { x: dir * 56, opacity: 0, filter: 'blur(18px)', scale: 0.97, zIndex: 0 })

    const tl = gsap.timeline({ onComplete: () => { lockRef.current = false } })

    // Exit — front video + panels slide out in direction of travel
    tl.to([leftRef.current, rightRef.current], {
      opacity: 0, x: dir * -28, duration: 0.28, ease: 'power2.in', stagger: 0.04,
    })
    tl.to(front, {
      x: dir * -56, filter: 'blur(18px)', opacity: 0, scale: 0.97,
      duration: 0.3, ease: 'power2.in',
    }, '<')

    // Flip state + z-indices so back becomes the new front
    tl.call(() => {
      setActiveIdx(nextIdx)
      frontRef.current = frontRef.current === 'A' ? 'B' : 'A'
      gsap.set(front, { zIndex: 0 })
      gsap.set(back,  { zIndex: 1 })
    })

    // Enter — back video + panels arrive from the opposite direction
    tl.fromTo([leftRef.current, rightRef.current],
      { opacity: 0, x: dir * 28 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04 })
    tl.to(back,
      { x: 0, filter: 'blur(0px)', opacity: 1, scale: 1, duration: 0.76, ease: 'power3.out' },
      '<')
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

  // ── Drag handlers ────────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerDownX.current = e.clientX
  }, [])

  const handlePointerUp = useCallback((e) => {
    if (pointerDownX.current === null) return
    const delta = e.clientX - pointerDownX.current
    pointerDownX.current = null
    if (delta < -50) goTo(activeIdx + 1)
    else if (delta > 50) goTo(activeIdx - 1)
  }, [activeIdx, goTo])

  const handlePointerCancel = useCallback(() => {
    pointerDownX.current = null
  }, [])

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
              draggable={false}
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
          Drag container: setPointerCapture ensures the pointer up fires even
          if the cursor exits the element mid-drag. select-none prevents the
          browser ghost-drag on text/video content.
        */}
        <div
          className="select-none touch-pan-y"
          style={{ gridColumn: '3 / span 8', position: 'relative', cursor: 'grab' }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >

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

          {/* Outer wrapper — horizontal mask */}
          <div style={{
            position:        'absolute', inset: 0, zIndex: 1, overflow: 'hidden',
            maskImage:       'linear-gradient(to right, transparent 0%, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%, transparent 100%)',
          }}>
            {/* Inner wrapper — vertical mask */}
            <div style={{
              position:        'absolute',
              inset:           0,
              maskImage:       'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
            }}>
              <video
                ref={videoARef}
                autoPlay loop muted playsInline draggable={false}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <video
                ref={videoBRef}
                autoPlay loop muted playsInline draggable={false}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0 }}
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

          {/* Left arc ( */}
          <div
            className="absolute left-[1vw] w-[35vw] pointer-events-none z-30 hidden md:block border-l-[3px] border-t-0 border-r-0 border-b-0 border-burlywood drop-shadow-[0_0_15px_rgba(222,184,135,0.8)]"
            style={{
              borderRadius:    '50%',
              top:             '-10vh',
              bottom:          '-10vh',
              maskImage:       'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
            }}
          />

          {/* Right arc ) */}
          <div
            className="absolute right-[1vw] w-[35vw] pointer-events-none z-30 hidden md:block border-r-[3px] border-t-0 border-l-0 border-b-0 border-burlywood drop-shadow-[0_0_15px_rgba(222,184,135,0.8)]"
            style={{
              borderRadius:    '50%',
              top:             '-10vh',
              bottom:          '-10vh',
              maskImage:       'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
            }}
          />

          {/* Floating CTA — z-40 sits above arcs and video */}
          <button
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 bg-burlywood text-[#0a0a0a] font-semibold uppercase rounded-sm hover:scale-[1.04] transition-[transform,box-shadow] duration-300"
            style={{
              fontFamily:    '"Inter", system-ui, sans-serif',
              fontSize:      '14px',
              letterSpacing: '0.2em',
              padding:       '18px 52px',
              boxShadow:     '0 0 28px rgba(222,184,135,0.42), 0 0 8px rgba(222,184,135,0.18), 0 6px 22px rgba(0,0,0,0.5)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 50px rgba(222,184,135,0.7), 0 0 18px rgba(222,184,135,0.38), 0 8px 28px rgba(0,0,0,0.55)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 0 28px rgba(222,184,135,0.42), 0 0 8px rgba(222,184,135,0.18), 0 6px 22px rgba(0,0,0,0.5)'
            }}
            onClick={() => onNavigate && onNavigate(2)}
          >
            I WANT THIS CAR
          </button>

        </div>

        {/* ── RIGHT: Financials ────────────────────────────────────── */}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <SpecRow label="Insurance"     value={car.insurance} right />
              <SpecRow label="Daily Mileage" value={car.mileage}   right />
              <SpecRow label="Fuel Policy"   value={car.fuel}      right />
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
              <div
                className="transition-all duration-500 ease-in-out"
                style={{
                  width:        i === activeIdx ? '48px' : '18px',
                  height:       '2px',
                  borderRadius: '2px',
                  background:   i === activeIdx ? '#deb887' : 'rgba(232,220,196,0.2)',
                  boxShadow:    i === activeIdx
                    ? '0 0 12px rgba(222,184,135,0.75), 0 0 4px rgba(222,184,135,1)'
                    : 'none',
                }}
              />
              <div
                className="transition-all duration-500 ease-in-out"
                style={{
                  fontFamily:    '"Inter", system-ui, sans-serif',
                  fontSize:      '12px',
                  fontWeight:    i === activeIdx ? 600 : 400,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color:         i === activeIdx ? 'rgba(222,184,135,0.85)' : 'rgba(232,220,196,0.26)',
                }}
              >
                {f.navLabel}
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
