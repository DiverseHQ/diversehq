import React, { FC } from 'react'
import getIPFSLink from '../User/lib/getIPFSLink'
import AttachmentSlide from './AttachmentSlide'
import AttachmentMedia from './AttachmentMedia'
import { Publication } from '../../graphql/generated'

interface Props {
  publication: Publication
  medias: any
  className: string
}

const AttachmentCarousel: FC<Props> = ({ publication, medias, className }) => {
  const renderElements = ({ index }) => (
    <>
      <div className="flex flex-row justify-end absolute top-[10px] right-[10px]">
        <div className=" bg-p-bg rounded-full px-2 py-0.5">
          {index + 1}/{medias.length}
        </div>
      </div>
      <div className="absolute bottom-[20px] left-[50%] -translate-x-[50%] flex gap-2 overflow-x-hidden">
        {medias.map((media, i) => {
          return (
            <div
              key={i}
              className={`w-1.5 h-1.5 border-[1px] border-[#9378d8] ${
                i === index ? 'bg-[#9378d8] ' : 'bg-transparent'
              } rounded-full`}
            ></div>
          )
        })}
      </div>
    </>
  )

  const renderChildren = () =>
    medias.map((media, i) => {
      const type = media.original.mimeType
      const url = getIPFSLink(media.original.url)

      return (
        <div
          key={i}
          className="flex items-center justify-center overflow-hidden"
        >
          <AttachmentMedia
            url={url}
            type={type}
            publication={publication}
            className={className}
          />
        </div>
      )
    })
  return (
    <div>
      <AttachmentSlide
        renderElements={renderElements}
        transition="0.8s"
        className="overflow-x-hidden"
      >
        {renderChildren}
      </AttachmentSlide>
    </div>
  )
}

export default AttachmentCarousel
