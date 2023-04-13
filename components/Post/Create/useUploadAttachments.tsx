import React from 'react'
import { AttachmentType, usePublicationStore } from '../../../store/publication'
import { uuid } from 'uuidv4'
import { useNotify } from '../../Common/NotifyContext'
import { uploadFilesToIpfsAndGetAttachments } from '../../../utils/utils'

const useUploadAttachments = () => {
  const addAttachments = usePublicationStore((state) => state.addAttachments)
  const updateAttachments = usePublicationStore(
    (state) => state.updateAttachments
  )
  const removeAttachments = usePublicationStore(
    (state) => state.removeAttachments
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
          previewItem: URL.createObjectURL(file)
        }
      })

      const hasLargeAttachment = files.map((file: any) => {
        const isImage = file.type.includes('image')
        const isVideo = file.type.includes('video')
        const isAudio = file.type.includes('audio')

        if (isImage && file.size > 10000000) {
          notifyInfo('Image size should be less than 10MB')
          return false
        }

        if (isVideo && file.size > 50000000) {
          notifyInfo('Video size should be less than 50MB')
          return false
        }

        if (isAudio && file.size > 20000000) {
          notifyInfo('Audio size should be less than 20MB')
          return false
        }

        return true
      })

      addAttachments(previewAttachments)
      let attachmentsIPFS: AttachmentType[] = []
      try {
        if (hasLargeAttachment.includes(false)) {
          setIsUploading(false)
          removeAttachments(attachmentIds)
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
          updateAttachments(attachmentsIPFS)
        }
      } catch {
        removeAttachments(attachmentIds)
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
