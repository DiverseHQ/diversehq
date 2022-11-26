import useWindowSize from './useWindowSize'
/*
default below 576px (portrait phones)
576px = landscape phones
768px = portrait tablets
992px - Desktops
1200px - Large Desktops
1600px - Extra Large Desktops
*/
const useDevice = () => {
  // eslint-disable-next-line
  const [windowHeight, windowWidth] = useWindowSize()
  const isMobile = windowWidth < 768
  const isDesktop = windowWidth >= 768
  return { isMobile, isDesktop }
}

export default useDevice
