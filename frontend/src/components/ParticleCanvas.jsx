import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = window.devicePixelRatio || 1
    let mouse = { x: -1000, y: -1000, active: false }
    let particles = []
    let animationFrameId = null

    function initCanvas() {
      dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      const count = Math.min(Math.max(Math.floor((width * height) / 26000), 20), 55)
      particles = []
      for (let i = 0; i < count; i++) {
        const isBright = Math.random() > 0.65
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.11,
          vy: (Math.random() - 0.5) * 0.11,
          radius: isBright ? Math.random() * 1.0 + 2.0 : Math.random() * 0.9 + 1.4,
          baseAlpha: isBright ? Math.random() * 0.25 + 0.65 : Math.random() * 0.25 + 0.45,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.010 + 0.005,
          isBright
        })
      }
    }

    initCanvas()

    const handleResize = () => {
      initCanvas()
    }

    let orientationTimeout = null
    const handleOrientation = () => {
      if (orientationTimeout) clearTimeout(orientationTimeout)
      orientationTimeout = setTimeout(initCanvas, 180)
    }

    const handlePointerMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }

    const handlePointerLeave = () => {
      mouse.active = false
      mouse.x = -1000
      mouse.y = -1000
    }

    const handlePointerUp = () => {
      if (window.matchMedia('(pointer: coarse)').matches) {
        mouse.active = false
        mouse.x = -1000
        mouse.y = -1000
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientation)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('pointerup', handlePointerUp)

    const maxDist = 125
    const mouseMaxDist = 160

    function renderParticles() {
      ctx.clearRect(0, 0, width, height)
      const pLen = particles.length

      const themeAttr = document.documentElement.getAttribute('data-theme') || 'emerald'
      let themeR = 16, themeG = 185, themeB = 129, themeGlow = '#10b981'
      let accentR = 52, accentG = 211, accentB = 153
      let alphaMult = 1.0

      if (themeAttr === 'midnight') {
        themeR = 56; themeG = 189; themeB = 248; themeGlow = '#38bdf8'
        accentR = 99; accentG = 102; accentB = 241
      } else if (themeAttr === 'obsidian') {
        themeR = 34; themeG = 211; themeB = 238; themeGlow = '#22d3ee'
        accentR = 255; accentG = 255; accentB = 255
      } else if (themeAttr === 'violet') {
        themeR = 192; themeG = 132; themeB = 252; themeGlow = '#c084fc'
        accentR = 232; accentG = 121; accentB = 249
      } else if (themeAttr === 'light') {
        themeR = 99; themeG = 102; themeB = 241; themeGlow = '#6366f1'
        accentR = 59; accentG = 130; accentB = 246
        alphaMult = 0.55
      }

      for (let i = 0; i < pLen; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // Smooth Floating & Soft Border Bounce
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        else if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        else if (p.y > height) { p.y = height; p.vy *= -1; }

        // Interactive Mouse Physics
        if (mouse.active) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const distToMouse = Math.sqrt(dx * dx + dy * dy)
          if (distToMouse < mouseMaxDist && distToMouse > 15) {
            const force = (1 - distToMouse / mouseMaxDist) * 0.0035
            p.vx += dx * force
            p.vy += dy * force
            p.vx *= 0.985
            p.vy *= 0.985

            const lineAlpha = (1 - distToMouse / mouseMaxDist) * 0.52 * alphaMult
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${lineAlpha.toFixed(3)})`
            ctx.lineWidth = 1.15
            ctx.shadowColor = themeGlow
            ctx.shadowBlur = 4
            ctx.stroke()
            ctx.shadowBlur = 0
          }
        }

        // Inter-Dot Connections
        for (let j = i + 1; j < pLen; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.38 * alphaMult
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${themeR}, ${themeG}, ${themeB}, ${lineAlpha.toFixed(3)})`
            ctx.lineWidth = 0.95
            ctx.stroke()
          }
        }

        // Draw Dot with Vibrant Glow
        p.pulse += p.pulseSpeed
        const currentAlpha = (p.baseAlpha + Math.sin(p.pulse) * 0.18) * alphaMult
        const clampedAlpha = Math.max(0.2, Math.min(1.0, currentAlpha))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.isBright ? accentR : themeR}, ${p.isBright ? accentG : themeG}, ${p.isBright ? accentB : themeB}, ${clampedAlpha.toFixed(3)})`
        ctx.shadowColor = themeGlow
        ctx.shadowBlur = p.isBright ? 6.5 : 3.5
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animationFrameId = requestAnimationFrame(renderParticles)
    }

    animationFrameId = requestAnimationFrame(renderParticles)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (orientationTimeout) clearTimeout(orientationTimeout)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientation)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  return (
    <canvas
      id="particle-canvas"
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
