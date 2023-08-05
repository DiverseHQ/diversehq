import type { ChangeEvent, FC } from 'react'
import { useEffect, useState } from 'react'
import { BsCheckCircleFill } from 'react-icons/bs'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { useUpdateEffect } from 'usehooks-ts'
import getFileFromDataURL from '../../lib/getFileFromDataURL'
import { generateVideoThumbnails } from '../../lib/post/generateThumbnail'
import { usePublicationStore } from '../../store/publication'
import uploadToIPFS from '../../utils/uploadToIPFS'
import { useNotify } from '../Common/NotifyContext'

const DEFAULT_THUMBNAIL_INDEX = 0
export const THUMBNAIL_GENERATE_COUNT = 4

interface Thumbnail {
  blobUrl: string
  ipfsUrl: string
  mimeType: string
}

const ChooseThumbnail: FC = () => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [imageUploading, setImageUploading] = useState(false)
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1)
  const attachments = usePublicationStore((state) => state.attachments)
  const videoThumbnail = usePublicationStore((state) => state.videoThumbnail)
  const setVideoThumbnail = usePublicationStore(
    (state) => state.setVideoThumbnail
  )
  const updateAttachments = usePublicationStore(
    (state) => state.updateAttachments
  )
  const { file } = attachments[0]
  const { notifyError } = useNotify()

  useEffect(() => {
    if (videoThumbnail?.url && attachments[0]) {
      updateAttachments([
        {
          ...attachments[0],
          cover: videoThumbnail?.url
        }
      ])
    }
  }, [videoThumbnail?.url])

  const uploadThumbnailToIpfs = async (fileToUpload: File) => {
    setVideoThumbnail({ uploading: true })
    const result = await uploadToIPFS(fileToUpload)
    if (!result.url) {
      notifyError(`Failed to upload thumbnail`)
    }
    setVideoThumbnail({
      url: result.url,
      type: fileToUpload.type || 'image/jpeg',
      uploading: false
    })

    return result
  }

  const onSelectThumbnail = async (index: number) => {
    setSelectedThumbnailIndex(index)
    if (thumbnails[index]?.ipfsUrl === '') {
      setVideoThumbnail({ uploading: true })
      getFileFromDataURL(
        thumbnails[index].blobUrl,
        'thumbnail.jpeg',
        async (file: any) => {
          if (!file) {
            return notifyError(`Please upload a thumbnail`)
          }
          const ipfsResult = await uploadThumbnailToIpfs(file)
          setThumbnails(
            thumbnails.map((thumbnail, i) => {
              if (i === index) {
                thumbnail.ipfsUrl = ipfsResult.url
              }
              return thumbnail
            })
          )
        }
      )
    } else {
      setVideoThumbnail({
        url: thumbnails[index]?.ipfsUrl,
        type: thumbnails[index]?.mimeType || 'image/jpeg',
        uploading: false
      })
    }
  }

  const generateThumbnails = async (fileToGenerate: File) => {
    try {
      const thumbnailArray = await generateVideoThumbnails(
        fileToGenerate,
        THUMBNAIL_GENERATE_COUNT
      )
      const thumbnailList: Thumbnail[] = []
      for (const thumbnailBlob of thumbnailArray) {
        thumbnailList.push({
          blobUrl: thumbnailBlob,
          ipfsUrl: '',
          mimeType: 'image/jpeg'
        })
      }

      setThumbnails(thumbnailList)
      setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX)
    } catch (error) {
      console.error('Failed to generate thumbnails', error)
      notifyError('Failed to generate thumbnails')
    }
  }

  useUpdateEffect(() => {
    onSelectThumbnail(selectedThumbnailIndex)
  }, [selectedThumbnailIndex])

  useEffect(() => {
    if (file) {
      generateThumbnails(file)
    }
    return () => {
      setSelectedThumbnailIndex(-1)
      setThumbnails([])
    }
  }, [file])

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        setImageUploading(true)
        setSelectedThumbnailIndex(-1)
        const file = e.target.files[0]
        const result = await uploadThumbnailToIpfs(file)
        const preview = window.URL?.createObjectURL(file)
        setThumbnails([
          {
            blobUrl: preview,
            ipfsUrl: result.url,
            mimeType: file.type || 'image/jpeg'
          },
          ...thumbnails
        ])
        setSelectedThumbnailIndex(0)
      } catch (error) {
        console.error('Failed to upload thumbnail', error)
        notifyError(`Failed to upload thumbnail`)
      } finally {
        setImageUploading(false)
      }
    }
  }

  const isUploading = videoThumbnail.uploading

  return (
    <div className="mt-5 w-full ">
      <b>Choose Thumbnail</b>
      <div className="mt-1 py-0.5 flex flex-row gap-3 flex-wrap">
        <label
          htmlFor="chooseThumbnail"
          className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border dark:border-gray-700"
        >
          <input
            id="chooseThumbnail"
            type="file"
            accept=".png, .jpg, .jpeg"
            className="hidden w-full"
            onChange={handleUpload}
          />
          {imageUploading ? (
            <div className="spinner w-4 h-4 bg-p-btn" />
          ) : (
            <>
              <HiOutlinePhotograph className="mb-1 h-5 w-5" />
              <span className="text-sm">Upload</span>
            </>
          )}
        </label>
        {thumbnails.map(({ blobUrl, ipfsUrl }, index) => {
          const isSelected = selectedThumbnailIndex === index
          const isUploaded = ipfsUrl === videoThumbnail.url

          return (
            <button
              key={`${blobUrl}_${index}`}
              type="button"
              disabled={isUploading}
              onClick={() => onSelectThumbnail(index)}
              className="relative"
            >
              <img
                className="h-24 sm:w-full w-24..
                 rounded-xl border object-cover border-s-border"
                src={blobUrl}
                alt="thumbnail"
                draggable={false}
              />
              {ipfsUrl && isSelected && isUploaded ? (
                <div className="absolute inset-0 grid place-items-center rounded-xl bg-gray-100/10">
                  <BsCheckCircleFill className="h-6 w-6 text-p-btn" />
                </div>
              ) : null}
              {isUploading && isSelected && (
                <div className="absolute inset-0 grid place-items-center rounded-xl bg-gray-100/10 backdrop-blur-md">
                  <div className="spinner w-4 h-4 bg-p-btn" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ChooseThumbnail
