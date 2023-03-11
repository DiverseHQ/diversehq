// import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { Publication } from '../../graphql/generated'
import { getURLsFromText } from '../../utils/utils'
import useDevice from '../Common/useDevice'
import getIPFSLink from '../User/lib/getIPFSLink'
import AttachmentCarousel from './AttachmentCarousel'
import AttachmentMedia from './AttachmentMedia'
import ReactEmbedo from './embed/ReactEmbedo'

interface Props {
  publication: Publication
  className: String
}

const Attachment: FC<Props> = ({ publication, className }) => {
  const medias = publication?.metadata?.media

  const [currentMedia, setCurrentMedia] = useState(0)

  const handleNextClick = () => {
    if (currentMedia === medias.length - 1) {
      setCurrentMedia(0)
    } else {
      setCurrentMedia(currentMedia + 1)
    }
  }

  const handlePrevClick = () => {
    if (currentMedia === 0) {
      setCurrentMedia(medias.length - 1)
    } else {
      setCurrentMedia(currentMedia - 1)
    }
  }

  const { isMobile } = useDevice()

  if (medias.length === 0) {
    if (getURLsFromText(publication?.metadata?.content)?.length > 0) {
      return (
        <ReactEmbedo url={getURLsFromText(publication?.metadata?.content)[0]} />
      )
    } else return null
  }

  return (
    <>
      {isMobile ? (
        <div
          className="relative flex flex-col justify-center items-center overflow-x-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <AttachmentCarousel
            publication={publication}
            medias={medias}
            className={`${medias.length > 1 ? 'h-[450px]' : className}`}
          />
        </div>
      ) : (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          {medias.length > 1 && (
            <>
              {currentMedia !== 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevClick()
                  }}
                  className="absolute left-0 top-[50%] z-20 p-1 rounded-full translate-x-[50%] -translate-y-[50%] hover:bg-m-btn-bg hover:text-m-btn-text bg-m-btn-hover-bg text-m-btn-hover-text transition-all duration-300"
                >
                  <AiOutlineArrowLeft className="w-6 h-6" />
                </button>
              )}
              {currentMedia !== medias.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextClick()
                  }}
                  className="absolute right-0 top-[50%] z-20 p-1 rounded-full -translate-x-[50%] -translate-y-[50%] hover:bg-m-btn-bg hover:text-m-btn-text bg-m-btn-hover-bg text-m-btn-hover-text transition-all duration-300"
                >
                  <AiOutlineArrowRight className="w-6 h-6" />
                </button>
              )}
              <div className="absolute top-[10px] right-[10px] z-20 bg-p-bg py-0.5 px-2 rounded-full">
                {currentMedia + 1}/{medias.length}
              </div>
            </>
          )}
          <AttachmentMedia
            type={medias[currentMedia].original.mimeType}
            url={getIPFSLink(medias[currentMedia].original.url)}
            publication={publication}
            className={`${medias.length > 1 ? 'h-[450px]' : className}`}
            // className={className}
          />
        </div>
      )}
    </>
  )
}

export default Attachment
