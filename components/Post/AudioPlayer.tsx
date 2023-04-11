import type { APITypes } from 'plyr-react'
import type { FC } from 'react'
import React from 'react'
import { useRef, useState } from 'react'
import CoverImage from './CoverImage'
import Player from './Player'
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai'
import { Publication } from '../../graphql/generated'

interface Props {
  src: string
  publication: Publication
  coverImage: string
  className?: string
}

const AudioPlayer: FC<Props> = ({
  src,
  publication,
  coverImage,
  className
}) => {
  const [playing, setPlaying] = useState(false)
  const playerRef = useRef<APITypes>(null)

  const handlePlayPause = () => {
    if (!playerRef.current) {
      return
    }
    if (playerRef.current?.plyr.paused && !playing) {
      setPlaying(true)
      return playerRef.current?.plyr.play()
    }
    setPlaying(false)
    playerRef.current?.plyr.pause()
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`bg-p-btn overflow-hidden mx-4 rounded-lg sm:rounded-xl `}
      >
        <div className="flex flex-nowrap space-x-2">
          <CoverImage coverImage={coverImage} />
          <div className="flex w-full flex-col justify-between truncate py-1 md:px-3">
            <div className="mt-3 flex justify-between md:mt-7">
              <div className="flex w-full items-center space-x-2.5 truncate">
                <button type="button" onClick={handlePlayPause}>
                  {playing && !playerRef.current?.plyr.paused ? (
                    <AiFillPauseCircle className="h-[50px] w-[50px] text-gray-100 hover:text-white" />
                  ) : (
                    <AiFillPlayCircle className="h-[50px] w-[50px] text-gray-100 hover:text-white" />
                  )}
                </button>
                <div className="w-full truncate pr-3">
                  <h5 className="truncate text-lg text-white">
                    {publication?.metadata.name}
                  </h5>
                  <h6 className="truncate text-white/70">
                    {publication?.metadata?.attributes[1]?.value}
                  </h6>
                </div>
              </div>
            </div>
            <div className="md:pb-3 bg-transparent">
              <Player src={src} playerRef={playerRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
