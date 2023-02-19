import { useEffect, useState } from 'react'

const useScrollPXAwayFromBottom = () => {
  const [scrollPXAwayFromBottom, setScrollPXAwayFromBottom] = useState(0)
  if (typeof window === 'undefined') {
    return { scrollPXAwayFromBottom: 0 }
  }
  const [scroll, setScroll] = useState({
    x: window.scrollX,
    y: window.scrollY
  })
  useEffect(() => {
    const handleScroll = () => {
      setScroll({
        x: window.scrollX,
        y: window.scrollY
      })
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollPXAwayFromBottom(
        document.body.offsetHeight - (window.innerHeight + window.scrollY)
      )
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scroll])
  return { scrollPXAwayFromBottom }
}

export default useScrollPXAwayFromBottom
