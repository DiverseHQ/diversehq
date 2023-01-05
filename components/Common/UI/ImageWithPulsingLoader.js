import React, { useState } from 'react'

const ImageWithPulsingLoader = ({ loaderClassName, ...props }) => {
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
        onLoad={() => setLoading(false)}
        className={`${props.className} ${loading ? 'hidden' : ''}`}
      />
    </>
  )
}

export default ImageWithPulsingLoader
