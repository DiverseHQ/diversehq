import React, { useEffect, useState } from 'react'

const useWindowSize = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const onResize = () => {
    setWindowHeight(window.innerHeight)
    setWindowWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return [windowHeight, windowWidth]
}
export default useWindowSize
