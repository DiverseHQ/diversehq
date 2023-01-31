import React from 'react'
import HoverWrapper from '../../Common/HoverWrapper'
const HoverFreeCollectPopup = ({ showCollectPopUp, setShowCollectPopUp }) => {
  return (
    <HoverWrapper
      showCollectPopUp={showCollectPopUp}
      setShowCollectPopUp={setShowCollectPopUp}
      position="right"
      className="absolute z-50"
    >
      <h1>dive</h1>
    </HoverWrapper>
  )
}

export default HoverFreeCollectPopup
