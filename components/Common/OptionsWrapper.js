import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import BottomDrawerWrapper from './BottomDrawerWrapper'
import useDevice from './useDevice'

const OptionsWrapper = ({
  children,
  OptionPopUpModal,
  position,
  showOptionsModal,
  setShowOptionsModal,
  isDrawerOpen,
  setIsDrawerOpen
}) => {
  const { isMobile } = useDevice()
  const popupRef = useRef(null)

  const handleClick = (e) => {
    if (
      !!popupRef.current &&
      (!e.target?.id || popupRef.current.id !== e.target.id) &&
      !popupRef.current.contains(e.target)
    ) {
      setShowOptionsModal(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [popupRef])

  const handleButtonClick = () => {
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
        ref={popupRef}
        onClick={handleButtonClick}
        id="options-wrapper"
      >
        {children}
        {showOptionsModal && (
          <div
            className={`absolute min-w-[150px] ${position === 'left' ? 'top-[10px] right-[20px]' : ''
              } ${position === 'right' ? 'top-[25px] left-0' : ''} ${position === 'top' ? 'bottom-[25px] right-0' : ''
              } ${position === 'bottom' ? 'top-[25px] right-0' : ''} z-20`}
          >
            <OptionPopUpModal />
          </div>
        )}
      </button>
      <BottomDrawerWrapper
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        showClose
        position="bottom"
      >
        <OptionPopUpModal />
      </BottomDrawerWrapper>
    </>
  )
}

export default OptionsWrapper
