import { useLayoutEffect, useState } from 'react'

const useWindowSize = (): {
  windowHeight: number
  windowWidth: number
} => {
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  )
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  useLayoutEffect(() => {
    const onResize = () => {
      setWindowHeight(window.innerHeight)
      setWindowWidth(window.innerWidth)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return { windowHeight, windowWidth }
}
export default useWindowSize
