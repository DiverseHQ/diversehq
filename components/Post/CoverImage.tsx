import React from 'react'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'

const CoverImage = ({ coverImage }) => {
  return (
    <div className="h-24 w-24 md:h-40 md:w-60 md:rounded-none">
      <ImageWithFullScreenZoom
        src={coverImage}
        alt="image"
        className="image-unselectable object-cover h-24 w-24 md:h-40 md:w-60"
      />
    </div>
  )
}

export default CoverImage
