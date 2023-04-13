import React from 'react'
// import { useEffect } from 'react'
import { useRef } from 'react'
import BottomDrawerWrapper from './BottomDrawerWrapper'
import { useDevice } from './DeviceWrapper'
import clsx from 'clsx'
import useOnClickOutside from '../../utils/hooks/useOnClickOutside'

/* eslint-disable */

const OptionsWrapper = ({
  children,
  OptionPopUpModal,
  position,
  showOptionsModal,
  setShowOptionsModal,
  isDrawerOpen,
  setIsDrawerOpen,
  disabled = false
}: {
  children: any
  OptionPopUpModal: any
  position: 'left' | 'right' | 'top' | 'bottom' | 'top-right'
  showOptionsModal: boolean
  setShowOptionsModal: (showOptionsModal: boolean) => void
  isDrawerOpen: boolean
  setIsDrawerOpen: (isDrawerOpen: boolean) => void
  disabled?: boolean
}) => {
  const { isMobile } = useDevice()
  const popupRef = useRef(null)

  useOnClickOutside(popupRef, () => setShowOptionsModal(false))

  // const handleClick = (e) => {
  //   if (
  //     !!popupRef.current &&
  //     (!e.target?.id || popupRef.current.id !== e.target.id) &&
  //     !popupRef.current.contains(e.target)
  //   ) {
  //     setShowOptionsModal(false)
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('click', handleClick)
  //   return () => {
  //     document.removeEventListener('click', handleClick)
  //   }
  // }, [popupRef])

  const handleButtonClick = () => {
    if (disabled) return
    if (isMobile) {
      setIsDrawerOpen(true)
    } else {
      setShowOptionsModal(true)
    }
  }

  return (
    <>
      <div className="relative" ref={popupRef}>
        <div
          className="relative cursor-pointer"
          onClick={handleButtonClick}
          id="options-wrapper"
        >
          {children}
        </div>
        {showOptionsModal && (
          <div
            className={clsx(
              'absolute min-w-[200px] z-40',
              position === 'left' && 'top-[10px] right-[20px]',
              position === 'right' && 'top-[25px] left-0',
              position === 'top' && ' left-[25px] right-0',
              position === 'bottom' && 'top-[25px] right-0',
              position === 'top-right' && 'bottom-0 left-4'
            )}
          >
            <OptionPopUpModal />
          </div>
        )}
      </div>
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
