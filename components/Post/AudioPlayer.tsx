import type { APITypes } from 'plyr-react'
import type { ChangeEvent, FC } from 'react'
import React from 'react'
import { useRef, useState } from 'react'
import CoverImage from './CoverImage'
import Player from './Player'
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai'
import { Publication } from '../../graphql/generated'
import { usePublicationStore } from '../../store/publication'
import { getThumbnailUrl } from '../User/lib/getThumbnailUrl'
import clsx from 'clsx'

interface Props {
  src: string
  publication: Publication
  isNew?: boolean
  className?: string
  hideDelete?: boolean
}

const AudioPlayer: FC<Props> = ({
  src,
  publication,
  className,
  isNew = false,
  hideDelete = false
}) => {
  const [playing, setPlaying] = useState(false)
  const playerRef = useRef<APITypes>(null)
  const audioPublication = usePublicationStore(
    (state) => state.audioPublication
  )
  const setAudioPublication = usePublicationStore(
    (state) => state.setAudioPublication
  )
  const imageRef = useRef<HTMLImageElement>(null)

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAudioPublication({
      ...audioPublication,
      [e.target.name]: e.target.value
    })
  }

  const title =
    hideDelete && isNew
      ? // @ts-ignore
        publication?.attributes?.find((attr) => attr.traitType === 'title')
          ?.value ||
        // @ts-ignore
        publication?.name
      : publication?.metadata?.attributes?.find(
          (attr) => attr.traitType === 'title'
        )?.value || publication?.metadata?.name

  const author =
    hideDelete && isNew // @ts-ignore
      ? publication?.attributes?.find((attr) => attr.traitType === 'author')
          ?.value ||
        // @ts-ignore
        publication?.name
      : publication?.metadata?.attributes?.find(
          (attr) => attr.traitType === 'author'
        )?.value

  return (
    <div className={clsx('flex items-center', className)}>
      <div
        className={`bg-p-btn overflow-hidden mx-4 rounded-lg sm:rounded-xl `}
      >
        <div className="flex flex-nowrap space-x-2">
          {isNew && hideDelete ? (
            <CoverImage
              isNew={false}
              // @ts-ignore
              cover={publication?.image}
            />
          ) : (
            <CoverImage
              isNew={isNew}
              cover={
                isNew ? audioPublication.cover : getThumbnailUrl(publication)
              }
              setCover={(url, mimeType) =>
                setAudioPublication({
                  ...audioPublication,
                  cover: url,
                  coverMimeType: mimeType
                })
              }
              imageRef={imageRef}
            />
          )}
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
                  {isNew && !hideDelete ? (
                    <div className="flex flex-col w-full">
                      <input
                        className="border-none text-lg text-white placeholder-white bg-transparent outline-none"
                        placeholder={`Add title`}
                        name="title"
                        value={audioPublication.title}
                        autoComplete="off"
                        onChange={handleChange}
                      />
                      <input
                        className="border-none text-white/70 placeholder-white/70 bg-transparent outline-none"
                        placeholder={`Add author`}
                        name="author"
                        value={audioPublication.author}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                    </div>
                  ) : (
                    <>
                      <h5 className="truncate text-lg text-white">
                        {String(title)}
                      </h5>
                      {author && (
                        <h6 className="truncate text-white/70">
                          {String(author)}
                        </h6>
                      )}
                    </>
                  )}
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
