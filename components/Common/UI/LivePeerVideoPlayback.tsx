import React, { memo } from 'react'
import { Player } from '@livepeer/react'
// import imageProxy from '../../User/lib/imageProxy'
// import VideoWithAutoPause from './VideoWithAutoPause'
const LivePeerVideoPlayback = ({
  url,
  posterUrl
}: {
  url: string
  title?: string
  posterUrl: string
}) => {
  return (
    <Player
      src={url}
      playbackId={url}
      poster={posterUrl}
      autoPlay={false}
      muted
      loop={false}
      showLoadingSpinner={true}
      autoUrlUpload={{ fallback: true, ipfsGateway: 'https://w3s.link' }}
    />
  )
}

export default memo(LivePeerVideoPlayback)
