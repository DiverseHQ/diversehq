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
  console.log('windowWidth: ', windowWidth)
  const isMobile = windowWidth < 950
  return { isMobile, isDesktop: !isMobile }
}

export default useDevice
