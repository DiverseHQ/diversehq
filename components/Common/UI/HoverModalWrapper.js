import React, { useState } from 'react'
import BottomDrawerWrapper from '../BottomDrawerWrapper'
import useDevice from '../useDevice'

const HoverModalWrapper = ({ disabled, children, HoverModal, position }) => {
  const { isMobile } = useDevice()
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleButtonClick = async () => {
    if (disabled) return
    if (isMobile) {
      setIsDrawerOpen(true)
    } else {
      setShowOptionsModal(true)
    }
  }

  return (
    <>
      <button
        className="relative"
        onClick={handleButtonClick}
        onMouseEnter={() => {
          if (disabled || isMobile) return
          setShowOptionsModal(true)
        }}
        onMouseLeave={() => {
          if (disabled || isMobile) return
          setShowOptionsModal(false)
        }}
      >
        {children}
        {showOptionsModal && (
          <div
            className={`absolute ${
              position === 'left' ? 'top-[10px] right-[20px]' : ''
            } ${position === 'right' ? 'top-[25px] left-0' : ''} ${
              position === 'top' ? 'bottom-[25px] right-0' : ''
            } ${
              position === 'bottom' ? 'top-[25px] right-0' : ''
            } z-20 bg-s-bg shadow-lg`}
          >
            <HoverModal />
          </div>
        )}
      </button>
      <BottomDrawerWrapper
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        showClose
      >
        <HoverModal />
      </BottomDrawerWrapper>
    </>
  )
}

export default HoverModalWrapper
