import React, { FC } from 'react'
import { Publication } from '../../graphql/generated'
import AttachmentCarousel from './AttachmentCarousel'

interface Props {
  publication: Publication
  className: String
}

const Attachment: FC<Props> = ({ publication, className }) => {
  const medias = publication?.metadata?.media
  if (medias.length === 0) return <></>

  return (
    <>
      <div className="relative flex flex-col justify-center items-center">
        <AttachmentCarousel
          publication={publication}
          medias={medias}
          className={className}
        />
      </div>
    </>
  )
}

export default Attachment
