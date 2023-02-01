import React from 'react'

const HoverWrapper = ({
  children,
  showCollectPopUp,
  setShowCollectPopUp,
  position
}) => {
  return (
    <div
      onMouseEnter={() => setShowCollectPopUp(true)}
      onMouseLeave={() => setShowCollectPopUp(false)}
      className={`absolute min-w-[150px] ${
        position === 'left' ? 'top-[10px] right-[20px]' : ''
      } ${position === 'right' ? 'top-[25px] left-0' : ''} ${
        position === 'top' ? 'bottom-[25px] right-0' : ''
      } ${position === 'bottom' ? 'top-[25px] right-0' : ''} z-20`}
    >
      {showCollectPopUp && <>{children}</>}
    </div>
  )
}

export default HoverWrapper
