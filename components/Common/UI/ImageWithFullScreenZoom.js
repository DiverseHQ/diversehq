import React from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ImageWithFullScreenZoom = ({ ...props }) => {
  return (
    <Zoom>
      <img {...props} className={`${props.className}`} />
    </Zoom>
  )
}

export default ImageWithFullScreenZoom