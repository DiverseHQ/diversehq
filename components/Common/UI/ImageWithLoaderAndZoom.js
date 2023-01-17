import React, { useState } from 'react'
import ImageWithFullScreenZoom from './ImageWithFullScreenZoom'

const ImageWithLoaderAndZoom = ({ loaderClassName, ...props }) => {
  const [loading, setLoading] = useState(true)
  return (
    <>
      {loading && (
        <div
          className={`${
            loaderClassName ? loaderClassName : props.className
          } bg-gray-300 animate-pulse`}
        />
      )}
      <ImageWithFullScreenZoom
        {...props}
        onLoad={() => setLoading(false)}
        className={`${props.className} ${
          loading ? 'hidden' : ''
        } cursor-pointer`}
      />
    </>
  )
}

export default ImageWithLoaderAndZoom
