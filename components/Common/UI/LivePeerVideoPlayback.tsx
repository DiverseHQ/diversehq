import { Player } from '@livepeer/react'
import { memo } from 'react'
import { LensInfuraEndpoint } from '../../../utils/config'
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
      showPipButton
      showUploadingIndicator
      autoUrlUpload={{
        fallback: true,
        ipfsGateway: LensInfuraEndpoint
      }}
    />
  )
}

export default memo(LivePeerVideoPlayback)
