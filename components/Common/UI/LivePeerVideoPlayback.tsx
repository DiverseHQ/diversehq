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
  posterUrl: string | null
}) => {
  return (
    <Player
      src={url}
      poster={posterUrl}
      objectFit="contain"
      autoPlay={false}
      controls={{ defaultVolume: 1 }}
      muted
      loop={false}
      showLoadingSpinner={true}
      autoUrlUpload={{
        fallback: true,
        ipfsGateway: 'https://gateway.ipfscdn.io/ipfs/'
      }}
    />
  )
}

export default memo(LivePeerVideoPlayback)
