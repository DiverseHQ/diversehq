import React from 'react'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import imageProxy from '../User/lib/imageProxy'
import getIPFSLink from '../User/lib/getIPFSLink'
import clsx from 'clsx'
import { AiOutlineFileImage } from 'react-icons/ai'
import type { ChangeEvent } from 'react'
import { uploadFilesToIpfsAndGetAttachments } from '../../utils/utils'
import { useNotify } from '../Common/NotifyContext'

const CoverImage = ({
  isNew = false,
  cover,
  setCover,
  imageRef
}: {
  isNew?: boolean
  cover?: string
  // eslint-disable-next-line no-unused-vars
  setCover?: (url: string, mimeType: string) => void
  imageRef?: React.RefObject<HTMLImageElement>
}) => {
  const [loading, setLoading] = React.useState(false)
  const { notifyError } = useNotify()

  const onError = (error: any) => {
    console.log(error)
    notifyError('Error uploading cover image')
    setLoading(false)
  }

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        setLoading(true)
        const attachment = await uploadFilesToIpfsAndGetAttachments(
          e.target.files
        )
        setCover(attachment[0].item, attachment[0].type)
      } catch (error) {
        onError(error)
      }
    }
  }

  return (
    <div className="w-full pt-3 px-4 sm:px-20 sm:rounded-xl">
      {cover && (
        <ImageWithFullScreenZoom
          src={imageProxy(getIPFSLink(cover))}
          alt="cover"
          className="image-unselectable object-cover w-full rounded-xl"
          ref={imageRef}
        />
      )}
      {isNew && (
        <label
          className={clsx(
            { visible: loading && !cover, invisible: cover },
            'absolute top-0 grid md:w-40 md:h-40 h-24 w-24 bg-gray-100 dark:bg-gray-900 cursor-pointer place-items-center group-hover:visible backdrop-blur-lg'
          )}
        >
          {loading && !cover ? (
            <div className="spinner border-s-border w-5 h-5" />
          ) : (
            <div className="text-sm dark:text-white text-black flex flex-col opacity-60 items-center">
              <AiOutlineFileImage className="w-5 h-5" />
              <span>Add cover</span>
            </div>
          )}
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .svg"
            className="hidden w-full"
            onChange={onChange}
          />
        </label>
      )}
    </div>
  )
}

export default CoverImage
