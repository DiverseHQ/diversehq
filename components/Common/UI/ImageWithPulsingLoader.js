import React, { useState } from 'react'
import { IMAGE_KIT_ENDPOINT, LensInfuraEndpoint } from '../../../utils/config'

const ImageWithPulsingLoader = ({ loaderClassName, src, ...props }) => {
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
      <img
        {...props}
        src={
          src.startsWith(LensInfuraEndpoint)
            ? `${IMAGE_KIT_ENDPOINT}/${src}`
            : `${src}`
        }
        onLoad={() => setLoading(false)}
        className={`${props.className} ${loading ? 'hidden' : ''}`}
      />
    </>
  )
}

export default ImageWithPulsingLoader
