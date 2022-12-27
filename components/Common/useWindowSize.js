import { useEffect, useState } from 'react'

const useWindowSize = () => {
  const [windowHeight, setWindowHeight] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const onResize = () => {
    setWindowHeight(window.innerHeight)
    setWindowWidth(window.innerWidth)
  }
  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return [windowHeight, windowWidth]
}
export default useWindowSize
