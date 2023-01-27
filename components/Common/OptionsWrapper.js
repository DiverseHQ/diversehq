import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'

const OptionsWrapper = ({
  children,
  setShowOptionsModal,
  showOptionsModal
}) => {
  const popupRef = useRef(null)

  useEffect(() => {
    const handleClick = (event) => {
      // Check if the target element of the click is the dropdown element
      // or a descendant of the dropdown element
      if (popupRef.current && !popupRef.current?.contains(event.target)) {
        // Hide the dropdown
        setShowOptionsModal(false)
      }
    }
    // Add the event listener
    document.addEventListener('click', handleClick)

    // Remove the event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })

  return (
    <>
      {showOptionsModal && (
        <div ref={popupRef} className="absolute z-50">
          {children}
        </div>
      )}
    </>
  )
}

export default OptionsWrapper
