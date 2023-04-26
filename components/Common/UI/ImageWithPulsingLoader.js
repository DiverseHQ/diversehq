import React, { useState } from 'react'
// import { IMAGE_KIT_ENDPOINT } from '../../../utils/config'
// import { IMAGE_KIT_ENDPOINT, LensInfuraEndpoint } from '../../../utils/config'

const ImageWithPulsingLoader = ({ loaderClassName = '', src, ...props }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
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
        src={!error ? src : '/gradient.jpg'}
        onError={() => {
          setLoading(false)
          setError(true)
        }}
        onLoad={() => setLoading(false)}
        alt="image not found"
        className={`${props.className} ${loading ? 'hidden' : ''}`}
      />
    </>
  )
}

export default ImageWithPulsingLoader
