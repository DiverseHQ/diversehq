import React from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import ImageWithPulsingLoader from './ImageWithPulsingLoader'

const ImageWithFullScreenZoom = ({ ...props }) => {
  return (
    <Zoom classDialog="custom-zoom cursor-pointer">
      <ImageWithPulsingLoader {...props} />
    </Zoom>
  )
}

export default ImageWithFullScreenZoom
