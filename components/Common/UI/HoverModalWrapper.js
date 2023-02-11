import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import useDevice from '../useDevice'
import BottomDrawerWrapper from '../BottomDrawerWrapper'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { useNotify } from '../NotifyContext'
const HoverModalWrapper = ({ disabled, children, HoverModal, position }) => {
  const { isMobile } = useDevice()
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const popupRef = useRef(null)
  const { isSignedIn, hasProfile } = useLensUserContext()
  const [isCollecting, setIsCollecting] = useState(false)
  const { notifyInfo } = useNotify()

  const handleButtonClick = async () => {
    if (disabled) return
    if (!isSignedIn || !hasProfile) {
      notifyInfo('Sign In with your Lens Handle')
      return
    }
    if (!isCollecting && showOptionsModal && !isMobile) {
      setShowOptionsModal(false)
      return
    }
    if (isMobile) {
      setIsDrawerOpen(true)
    } else {
      setShowOptionsModal(true)
    }
  }

  const handleClick = useCallback(
    (e) => {
      console.log('!popupRef.current', !!popupRef.current)
      console.log('!isMobile', !isMobile)
      console.log('!collecting', !isCollecting)
      console.log(
        '!!e.target?.id || popupRef.current...',
        !e.target?.id || popupRef.current.id !== e.target.id
      )
      console.log(
        !!popupRef.current &&
        !isMobile &&
        (!e.target?.id || popupRef.current.id !== e.target.id) &&
        !popupRef.current.contains(e.target) &&
        !isCollecting
      )
      if (
        !!popupRef.current &&
        !isMobile &&
        (!e.target?.id || popupRef.current.id !== e.target.id) &&
        !popupRef.current.contains(e.target) &&
        !isCollecting
      ) {
        setShowOptionsModal(false)
      }
    },
    [popupRef, isMobile, isCollecting]
  )

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [popupRef])

  return (
    <>
      <div className="relative w-fit h-fit" ref={popupRef}>
        {showOptionsModal && (
          <div
            className={`absolute ${position === 'left' ? 'top-[200px] right-[20px]' : ''
              } ${position === 'right' ? 'top-[0px] left-0' : ''} ${position === 'top' ? ' -translate-x-44 -translate-y-20' : ''
              } ${position === 'bottom' ? 'translate-x-44 translate-y-20' : ''
              } z-20 bg-s-bg shadow-lg rounded-lg border `}
          >
            <HoverModal
              setIsDrawerOpen={setIsDrawerOpen}
              setShowOptionsModal={setShowOptionsModal}
              setIsCollecting={setIsCollecting}
            />
          </div>
        )}
        <button
          onClick={handleButtonClick}
          onMouseEnter={() => {
            if (disabled || isMobile) return
            if (!isSignedIn) return
            setShowOptionsModal(true)
          }}
        >
          {children}
        </button>
      </div>
      <BottomDrawerWrapper
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        showClose
        position="bottom"
      >
        <HoverModal
          setIsDrawerOpen={setIsDrawerOpen}
          setShowOptionsModal={setShowOptionsModal}
          setIsCollecting={setIsCollecting}
        />
      </BottomDrawerWrapper>
    </>
  )
}

export default memo(HoverModalWrapper)
