import React from 'react'
import { v4 as uuid } from 'uuid'
import { AttachmentType, usePublicationStore } from '../../../store/publication'
import { uploadFilesToIpfsAndGetAttachments } from '../../../utils/utils'
import { useNotify } from '../../Common/NotifyContext'

const useUploadAttachments = (isComment?: boolean) => {
  const addAttachments = usePublicationStore((state) => state.addAttachments)
  const updateAttachments = usePublicationStore(
    (state) => state.updateAttachments
  )
  const removeAttachments = usePublicationStore(
    (state) => state.removeAttachments
  )
  const addCommentAttachments = usePublicationStore(
    (state) => state.addCommentAttachments
  )
  const updateCommentAttachments = usePublicationStore(
    (state) => state.updateCommentAttachments
  )
  const removeCommentAttachments = usePublicationStore(
    (state) => state.removeCommentAttachments
  )
  const setIsUploading = usePublicationStore((state) => state.setIsUploading)
  const { notifyInfo } = useNotify()

  const handleUploadAttachments = React.useCallback(
    async (attachments: any): Promise<AttachmentType[]> => {
      setIsUploading(true)
      const files = Array.from(attachments)
      const attachmentIds: string[] = []

      const previewAttachments: AttachmentType[] = files.map((file: any) => {
        const attachmentId = uuid()
        attachmentIds.push(attachmentId)

        return {
          id: attachmentId,
          type: file.type,
          altTag: '',
          previewItem: URL.createObjectURL(file),
          file: file
        }
      })

      const hasLargeAttachment = files.map((file: any) => {
        const isImage = file.type.includes('image')
        const isVideo = file.type.includes('video')
        const isAudio = file.type.includes('audio')

        if (isImage && file.size > 15000000) {
          notifyInfo('Image size should be less than 15MB')
          return false
        }

        if (isVideo && file.size > 100000000) {
          notifyInfo('Video size should be less than 100MB')
          return false
        }

        if (isAudio && file.size > 20000000) {
          notifyInfo('Audio size should be less than 20MB')
          return false
        }

        return true
      })

      if (isComment) {
        addCommentAttachments(previewAttachments)
      } else {
        addAttachments(previewAttachments)
      }
      let attachmentsIPFS: AttachmentType[] = []
      try {
        if (hasLargeAttachment.includes(false)) {
          setIsUploading(false)
          if (isComment) {
            removeCommentAttachments(attachmentIds)
          } else {
            removeAttachments(attachmentIds)
          }
          return []
        }

        const attachmentsUploaded = await uploadFilesToIpfsAndGetAttachments(
          attachments
        )

        if (attachmentsUploaded) {
          attachmentsIPFS = previewAttachments.map(
            (attachment: AttachmentType, index: number) => ({
              ...attachment,
              item: attachmentsUploaded[index].item
            })
          )
          if (isComment) {
            updateCommentAttachments(attachmentsIPFS)
          } else {
            updateAttachments(attachmentsIPFS)
          }
        }
      } catch {
        if (isComment) {
          removeCommentAttachments(attachmentIds)
        } else {
          removeAttachments(attachmentIds)
        }
        notifyInfo('Something went wrong while uploading!')
      }
      setIsUploading(false)
      return attachmentsIPFS
    },
    [addAttachments, removeAttachments, updateAttachments, setIsUploading]
  )

  return { handleUploadAttachments }
}

export default useUploadAttachments
