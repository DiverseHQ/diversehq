import React from 'react'

/* eslint-disable */

interface ContextType {
  isMobile: boolean
  isDesktop: boolean
  setIsMobile: (isMobile: boolean) => void
}

export const DeviceContext = React.createContext<ContextType>({
  isMobile: true,
  isDesktop: false,
  setIsMobile: () => {}
})

const DeviceWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = React.useState(true)
  return (
    <DeviceContext.Provider
      value={{
        isMobile: isMobile,
        isDesktop: !isMobile,
        setIsMobile
      }}
    >
      {children}
    </DeviceContext.Provider>
  )
}

export const useDevice = () => React.useContext(DeviceContext)

export default DeviceWrapper
