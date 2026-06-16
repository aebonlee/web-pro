import { useEffect, useRef, useState } from 'react'

// 스크롤 진입 시 1회 reveal (IntersectionObserver)
export function useReveal(opts = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: opts.threshold ?? 0.16, rootMargin: opts.rootMargin ?? '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, shown]
}
