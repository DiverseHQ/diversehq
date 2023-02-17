import React, { useEffect, useRef } from 'react'
import { IMAGE_KIT_ENDPOINT, LensInfuraEndpoint } from '../../../utils/config'

const VideoWithAutoPause = ({ src, ...props }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    // create an IntersectionObserver instance
    let observer = new IntersectionObserver(
      ([entry]) => {
        // if the video is not in the viewport pause it
        if (!entry.isIntersecting) {
          videoRef.current.pause()
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.5 }
    )

    // observe the video element
    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        videoRef.current.pause()
      }
    }

    // add the visibilitychange event listener
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      // clean up the observer when the component unmounts
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
  return (
    <video
      // src={
      //   src.startsWith(LensInfuraEndpoint)
      //     ? `${IMAGE_KIT_ENDPOINT}/${src}`
      //     : src
      // }
      src={src}
      ref={videoRef}
      {...props}
    />
  )
}

export default VideoWithAutoPause
