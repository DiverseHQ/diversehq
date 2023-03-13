import React, { memo } from 'react'
import { Player } from '@livepeer/react'
// import imageProxy from '../../User/lib/imageProxy'
// import VideoWithAutoPause from './VideoWithAutoPause'
const LivePeerVideoPlayback = ({
  url,
  title,
  posterUrl
}: {
  url: string
  title: string
  posterUrl: string
}) => {
  return (
    <Player
      title={title}
      src={url}
      playbackId={url}
      poster={posterUrl}
      muted
      loop={false}
      autoUrlUpload={{ fallback: true, ipfsGateway: 'https://w3s.link' }}
    />
  )
}

export default memo(LivePeerVideoPlayback)
