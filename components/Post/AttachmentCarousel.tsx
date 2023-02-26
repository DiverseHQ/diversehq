import React from 'react'
import getIPFSLink from '../User/lib/getIPFSLink'
import AttachmentSlide from './AttachmentSlide'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import AttachmentMedia from './AttachmentMedia'

const AttachmentCarousel = ({ publication, medias, className }) => {
  const renderElements = ({ index, onChangeIndex }) => (
    <>
      <button
        className="absolute bottom-[50%] translate-y-[50%] -translate-x-[50%] left-0 p-1 rounded-full hover:bg-m-btn-bg hover:text-m-btn-text bg-m-btn-hover-bg text-m-btn-hover-text"
        onClick={(e) => {
          e.stopPropagation()
          onChangeIndex(index === 0 ? medias.length - 1 : index - 1)
        }}
      >
        <AiOutlineArrowLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute bottom-[50%] translate-y-[50%] translate-x-[50%] right-0 p-1 rounded-full hover:bg-m-btn-bg hover:text-m-btn-text bg-m-btn-hover-bg text-m-btn-hover-text"
        onClick={(e) => {
          e.stopPropagation()
          onChangeIndex(index === medias.length - 1 ? 0 : index + 1)
        }}
      >
        <AiOutlineArrowRight className="w-6 h-6" />
      </button>
      <div className="flex flex-row justify-end absolute top-[10px] right-[10px]">
        <div className=" bg-p-bg rounded-full px-2 py-0.5">
          {index + 1}/{medias.length}
        </div>
      </div>
    </>
  )

  const renderChildren = () =>
    medias.map((media, i) => {
      const type = media.original.mimeType
      const url = getIPFSLink(media.original.url)

      return (
        <div key={i} className="flex items-center justify-center">
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
      <AttachmentSlide renderElements={renderElements} transition="0.8s">
        {renderChildren}
      </AttachmentSlide>
    </div>
  )
}

export default AttachmentCarousel
