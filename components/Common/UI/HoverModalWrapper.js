import React, { useEffect, useRef, useState } from 'react'
import useCollectPublication from '../../Post/Collect/useCollectPublication'
import useDevice from '../useDevice'
import FreeCollectDrawer from '../../Post/Collect/FreeCollectDrawer'
import FeeCollectDrawer from '../../Post/Collect/FeeCollectDrawer'
const HoverModalWrapper = ({
  disabled,
  children,
  HoverModal,
  position,
  collectModule,
  publication,
  author,
  isCollected,
  setCollectCount,
  setIsCollected
}) => {
  const { isMobile } = useDevice()
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const popupRef = useRef(null)
  const { loading: collecting } = useCollectPublication(collectModule)

  const handleButtonClick = async () => {
    if (collecting) return
    if (disabled) return
    if (isMobile) {
      setIsDrawerOpen(true)
    } else {
      setShowOptionsModal(true)
    }
  }

  const handleClick = (e) => {
    if (
      !!popupRef.current &&
      !isMobile &&
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

  return (
    <>
      <button
        className="relative"
        onClick={handleButtonClick}
        onMouseEnter={() => {
          if (disabled || isMobile) return
          setShowOptionsModal(true)
        }}
        ref={popupRef}
      >
        {showOptionsModal && (
          <div
            className={`absolute ${
              position === 'left' ? 'top-[10px] right-[20px]' : ''
            } ${position === 'right' ? 'top-[25px] left-0' : ''} ${
              position === 'top' ? ' -translate-x-44 -translate-y-20 ' : ''
            } ${
              position === 'bottom' ? 'translate-x-44 translate-y-20' : ''
            } z-20 bg-s-bg shadow-lg rounded-lg border `}
          >
            <HoverModal
              setIsDrawerOpen={setIsDrawerOpen}
              setShowOptionsModal={setShowOptionsModal}
            />
          </div>
        )}
        {children}
      </button>
      <>
        {isDrawerOpen &&
          collectModule?.__typename === 'FreeCollectModuleSettings' && (
            <FreeCollectDrawer
              setIsDrawerOpen={setIsDrawerOpen}
              isDrawerOpen={isDrawerOpen}
              collectModule={collectModule}
              setIsCollected={setIsCollected}
              isCollected={isCollected}
              author={author}
              publication={publication}
              setCollectCount={setCollectCount}
            />
          )}
        {collectModule?.__typename === 'FeeCollectModuleSettings' && (
          <FeeCollectDrawer
            setIsDrawerOpen={setIsDrawerOpen}
            isDrawerOpen={isDrawerOpen}
            collectModule={collectModule}
            setIsCollected={setIsCollected}
            isCollected={isCollected}
            author={author}
            publication={publication}
            setCollectCount={setCollectCount}
          />
        )}
      </>
    </>
  )
}

export default HoverModalWrapper
