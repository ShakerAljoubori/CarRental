import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useState, useEffect, useRef, useCallback } from 'react'

import CustomCursor from './components/CustomCursor'
import Preloader    from './components/Preloader'
import Hero         from './components/Hero'
import Fleet        from './components/Fleet'
import Concierge    from './components/Concierge'
import Footer       from './components/Footer'

gsap.registerPlugin(useGSAP)

const SCENE_COUNT   = 4
const SCENE_LABELS  = ['HERO', 'FLEET', 'CONCIERGE', 'MEMBERSHIP']
const SceneComponents = [Hero, Fleet, Concierge, Footer]

export default function App() {
  const [appReady,    setAppReady]   = useState(false)
  const [activeScene, setActive]     = useState(0)

  const sceneRefs  = useRef([])   // DOM refs for each scene wrapper
  const currentRef = useRef(0)    // authoritative scene index (readable in closures)
  const lockRef    = useRef(false)

  // ── Core transition: blur-smear out → emerge in ───────────────────────────
  const goToScene = useCallback((next) => {
    if (lockRef.current) return
    if (next < 0 || next >= SCENE_COUNT) return
    if (next === currentRef.current) return

    const prev  = currentRef.current
    const outEl = sceneRefs.current[prev]
    const inEl  = sceneRefs.current[next]
    if (!outEl || !inEl) return

    lockRef.current    = true
    currentRef.current = next

    const tl = gsap.timeline({
      onComplete() {
        setActive(next)
        lockRef.current = false
      },
    })

    // Outgoing — heavy blur + scale collapse
    tl.to(outEl, {
      filter:    'blur(20px)',
      scale:     0.93,
      autoAlpha: 0,
      duration:  0.52,
      ease:      'power3.in',
    })

    // Incoming — emerge from blur into sharp focus
    tl.fromTo(
      inEl,
      { filter: 'blur(20px)', scale: 1.06, autoAlpha: 0 },
      { filter: 'blur(0px)',  scale: 1,    autoAlpha: 1, duration: 0.74, ease: 'power4.out' },
      '-=0.1',
    )
  }, [])

  // ── Initialize scene visibility after preloader ───────────────────────────
  useEffect(() => {
    if (!appReady) return

    sceneRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, {
        autoAlpha:  0,
        filter:     'blur(0px)',
        scale:      1,
        willChange: 'transform, filter, opacity',
      })
    })

    // Scene 0 fades in with a slight delay so preloader cross-fade overlaps
    gsap.to(sceneRefs.current[0], {
      autoAlpha: 1,
      duration:  0.9,
      ease:      'power2.out',
      delay:     0.05,
    })
  }, [appReady])

  // ── Wheel hijack — replaces native vertical scroll ────────────────────────
  useEffect(() => {
    if (!appReady) return
    const onWheel = (e) => {
      e.preventDefault()
      if (lockRef.current) return
      goToScene(currentRef.current + (e.deltaY > 0 ? 1 : -1))
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [appReady, goToScene])

  // ── Touch swipe ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!appReady) return
    let y0 = 0
    const onStart = (e) => { y0 = e.touches[0].clientY }
    const onEnd   = (e) => {
      if (lockRef.current) return
      const dy = y0 - e.changedTouches[0].clientY
      if (Math.abs(dy) < 55) return
      goToScene(currentRef.current + (dy > 0 ? 1 : -1))
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend',   onEnd,   { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend',   onEnd)
    }
  }, [appReady, goToScene])

  // ── Keyboard (Up/Down) ────────────────────────────────────────────────────
  useEffect(() => {
    if (!appReady) return
    const onKey = (e) => {
      if (lockRef.current) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goToScene(currentRef.current + 1)
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   goToScene(currentRef.current - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [appReady, goToScene])

  return (
    <div className="bg-obsidian w-screen h-screen overflow-hidden relative">
      <CustomCursor />

      <Preloader onComplete={() => setAppReady(true)} />

      {/* ── Global frosted navigation bar ─────────────────── */}
      {appReady && (
        <header
          className="fixed top-0 left-0 right-0 z-50 border-b border-mocha-cream/[0.06]"
          style={{ background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(22px)' }}
        >
          <div className="flex items-center justify-between px-10 py-4 lg:px-16">
            {/* Logo */}
            <button
              onClick={() => goToScene(0)}
              className="flex items-center gap-x-3"
            >
              <span className="font-serif text-[15px] tracking-[0.5em] text-platinum">APEX</span>
              <div className="w-px h-4 bg-burlywood/60" />
              <span className="font-serif text-[15px] tracking-[0.5em] text-burlywood">CLUB</span>
            </button>

            {/* Scene links */}
            <ul className="hidden md:flex items-center gap-x-10">
              {['FLEET', 'CONCIERGE', 'MEMBERSHIP'].map((label, i) => (
                <li key={label}>
                  <button
                    onClick={() => goToScene(i + 1)}
                    className="nav-link font-sans text-[15px] tracking-[0.06em] text-platinum/85 hover:text-burlywood transition-colors duration-300"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

          </div>
        </header>
      )}

      {/* ── Vertical scene dot navigator ──────────────────── */}
      {appReady && (
        <div className="fixed right-7 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-y-3 items-center">
          {SCENE_LABELS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToScene(i)}
              className="rounded-full transition-all duration-500"
              style={{
                width:      4,
                height:     i === activeScene ? 22 : 8,
                background:  i === activeScene ? '#deb887' : 'rgba(232,220,196,0.2)',
                boxShadow:   i === activeScene ? '0 0 8px rgba(222,184,135,0.7)' : 'none',
              }}
              aria-label={`Go to scene ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/*
        ── Scene layers ──────────────────────────────────────
        All four scenes are always in the DOM.
        GSAP controls autoAlpha — only one is visible at a time.
        Using absolute inset-0 so they all occupy the same space.
      */}
      <div className="absolute inset-0">
        {SceneComponents.map((SceneComp, i) => (
          <div
            key={i}
            ref={(el) => { sceneRefs.current[i] = el }}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0, visibility: 'hidden' }}  // GSAP takes over immediately
          >
            <SceneComp
              isActive={appReady && activeScene === i}
              onNavigate={goToScene}
              sceneIndex={i}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
