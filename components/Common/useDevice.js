import React from 'react'
/*
default below 576px (portrait phones)
576px = landscape phones
768px = portrait tablets
992px - Desktops
1200px - Large Desktops
1600px - Extra Large Desktops
*/
const useDevice = () => {
  const [isMobile, setIsMobile] = React.useState(true)

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }
    handleResize() // Initial set
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  // eslint-disable-next-line
  return { isMobile, isDesktop: !isMobile }
}

export default useDevice
