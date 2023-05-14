import React, { useId } from 'react'
import { usePublicationStore } from '../../../store/publication'
import useUploadAttachments from './useUploadAttachments'
import {
  SUPPORTED_AUDIO_TYPE,
  SUPPORTED_VIDEO_TYPE
} from '../../../utils/config'
import { supportedMimeTypes } from '../../../utils/config'
import { SUPPORTED_IMAGE_TYPE } from '../../../utils/config'
import type { ChangeEvent } from 'react'
import { useNotify } from '../../Common/NotifyContext'
import OptionsWrapper from '../../Common/OptionsWrapper'
import { Tooltip } from '@mui/material'
import { AiOutlineFileImage } from 'react-icons/ai'
import { HiOutlineVideoCamera } from 'react-icons/hi'
import { BsFileEarmarkMusic } from 'react-icons/bs'

const AttachmentRow = ({
  hideUploadAudio = false,
  isComment = false
}: {
  hideUploadAudio?: boolean
  isComment?: boolean
}) => {
  const attachments = usePublicationStore((state) => state.attachments)
  const commnetAttachments = usePublicationStore(
    (state) => state.commnetAttachments
  )
  const isUploading = usePublicationStore((state) => state.isUploading)
  const { handleUploadAttachments } = useUploadAttachments(isComment)
  const id = useId()
  const { notifyInfo, notifyError } = useNotify()
  const [showOptionsModal, setShowOptionsModal] = React.useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const hasVideos = (files: any) => {
    let videos = 0
    let images = 0

    for (const file of files) {
      if (SUPPORTED_VIDEO_TYPE.includes(file.type)) {
        videos = videos + 1
      } else {
        images = images + 1
      }
    }

    if (videos > 0) {
      if (videos > 1) {
        return true
      }

      return images > 0 ? true : false
    }

    return false
  }

  const isTypeAllowed = (files: any) => {
    for (const file of files) {
      if (supportedMimeTypes.includes(file.type)) {
        return true
      }
    }

    return false
  }

  const isImageType = (files: any) => {
    for (const file of files) {
      if (!SUPPORTED_IMAGE_TYPE.includes(file.type)) {
        return false
      }
    }
    return true
  }

  const handleAttachment = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()

    try {
      const { files } = evt.target
      // Count check
      if (
        files &&
        (hasVideos(files) ||
          (isImageType(files) &&
            ((!isComment && files.length + attachments.length > 10) ||
              (isComment && files.length + commnetAttachments.length > 10))))
      ) {
        notifyInfo(`You can only upload 10 images or 1 video.`)
      }

      // Type check
      if (isTypeAllowed(files)) {
        setShowOptionsModal(false)
        setIsDrawerOpen(false)
        await handleUploadAttachments(files)
        evt.target.value = ''
      } else {
        notifyInfo(`File format not allowed.`)
      }
    } catch {
      notifyError(`Something went wrong while uploading!`)
    }
  }

  return (
    <OptionsWrapper
      disabled={isUploading}
      OptionPopUpModal={() => (
        <div className="flex flex-col w-full bg-s-bg sm:rounded-xl p-1 sm:shadow-md min-w-[180px] sm:border-[1px] border-s-border w-fit">
          <label
            htmlFor={`image_${id}`}
            className="flex shrink-0 w-full space-x-2 items-center px-5 sm:pl-2 sm:pr-5 py-1 text-xl sm:text-lg rounded-md sm:rounded-lg my-1 hover:bg-s-hover hover:cursor-pointer text-p-text"
          >
            <AiOutlineFileImage className="w-4 h-4" />
            <span>Upload image(s)</span>
            <input
              id={`image_${id}`}
              type="file"
              multiple
              accept={SUPPORTED_IMAGE_TYPE.join(',')}
              className="hidden"
              onChange={handleAttachment}
              disabled={
                isComment
                  ? commnetAttachments.length >= 4
                  : attachments.length >= 4
              }
            />
          </label>
          <label
            htmlFor={`video_${id}`}
            className="flex shrink-0 w-full space-x-2 items-center px-5 sm:pl-2 sm:pr-5 py-1 text-xl sm:text-lg rounded-md sm:rounded-lg my-1 hover:bg-s-hover hover:cursor-pointer text-p-text"
          >
            <HiOutlineVideoCamera className="w-4 h-4" />
            <span>Upload video</span>
            <input
              id={`video_${id}`}
              type="file"
              multiple
              accept={SUPPORTED_VIDEO_TYPE.join(',')}
              className="hidden"
              onChange={handleAttachment}
              disabled={
                isComment
                  ? commnetAttachments.length >= 4
                  : attachments.length >= 4
              }
            />
          </label>

          {!hideUploadAudio && (
            <label
              htmlFor={`audio_${id}`}
              className="flex shrink-0 w-full space-x-2 items-center px-5 sm:pl-2 sm:pr-5 py-1 text-xl sm:text-lg rounded-md sm:rounded-lg my-1 hover:bg-s-hover hover:cursor-pointer text-p-text"
            >
              <BsFileEarmarkMusic className="w-4 h-4" />
              <span>Upload audio</span>
              <input
                id={`audio_${id}`}
                type="file"
                multiple
                accept={SUPPORTED_AUDIO_TYPE.join(',')}
                className="hidden"
                onChange={handleAttachment}
                disabled={
                  isComment
                    ? commnetAttachments.push.length >= 4
                    : attachments.length >= 4
                }
              />
            </label>
          )}
        </div>
      )}
      position="top-right"
      showOptionsModal={showOptionsModal}
      setShowOptionsModal={setShowOptionsModal}
      isDrawerOpen={isDrawerOpen}
      setIsDrawerOpen={setIsDrawerOpen}
    >
      <Tooltip
        enterDelay={1000}
        leaveDelay={200}
        title="Media"
        content="Media"
        arrow
      >
        {isUploading ? (
          <div className="spinner border-p-text w-4 h-4" />
        ) : (
          <div className="rounded-full hover:bg-s-hover active:bg-s-hover p-2 cursor-pointer">
            <AiOutlineFileImage className="w-5 h-5" />
          </div>
        )}
      </Tooltip>
    </OptionsWrapper>
  )
}

export default AttachmentRow
