import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Simplified dual-stage cursor — elegant, not "extra".
 * Dot: 7px burlywood, tight lag.
 * Ring: 28px mocha-cream outline, softer lag.
 * On button/anchor hover: ring expands slightly, brightens.
 */
export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -200, y: -200 })

    const qDotX  = gsap.quickTo(dot,  'x', { duration: 0.1,  ease: 'power3.out' })
    const qDotY  = gsap.quickTo(dot,  'y', { duration: 0.1,  ease: 'power3.out' })
    const qRingX = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3.out' })
    const qRingY = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3.out' })

    const onMove = (e) => {
      qDotX(e.clientX);  qDotY(e.clientY)
      qRingX(e.clientX); qRingY(e.clientY)
    }

    const isInteractive = (el) =>
      el.closest('button, a, [data-cursor-expand], input, select, textarea')

    const onOver = (e) => {
      if (!isInteractive(e.target)) return
      gsap.to(ring, { scale: 1.7, borderColor: 'rgba(222,184,135,0.65)', duration: 0.25, ease: 'power3.out' })
      gsap.to(dot,  { scale: 0.45, duration: 0.2 })
    }

    const onOut = (e) => {
      if (!isInteractive(e.target)) return
      gsap.to(ring, { scale: 1, borderColor: 'rgba(232,220,196,0.28)', duration: 0.25 })
      gsap.to(dot,  { scale: 1, duration: 0.2 })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout',  onOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout',  onOut)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          top: 0, left: 0,
          width:         7,
          height:        7,
          borderRadius:  '50%',
          background:    '#deb887',
          pointerEvents: 'none',
          zIndex:        99999,
          willChange:    'transform',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position:      'fixed',
          top: 0, left: 0,
          width:         28,
          height:        28,
          borderRadius:  '50%',
          border:        '1px solid rgba(232,220,196,0.28)',
          pointerEvents: 'none',
          zIndex:        99998,
          willChange:    'transform',
        }}
      />
    </>
  )
}
