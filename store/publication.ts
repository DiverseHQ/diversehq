import { create } from 'zustand'
import { postWithCommunityInfoType } from '../types/post'

export interface AttachmentType {
  id?: string
  type: string
  altTag?: string
  item?: string
  previewItem?: string
}

/* eslint-disable */

// publications is a map of publicationId to publication
interface PublicationState {
  publications: Map<string, postWithCommunityInfoType>
  setPublications: (
    publications: Map<string, postWithCommunityInfoType>
  ) => void
  addPublication: (key: string, publication: postWithCommunityInfoType) => void
  addPublications: (
    publications: Map<string, postWithCommunityInfoType>
  ) => void
  attachments: AttachmentType[]
  setAttachments: (attachments: AttachmentType[]) => void
  addAttachments: (attachments: AttachmentType[]) => void
  updateAttachments: (attachments: AttachmentType[]) => void
  removeAttachments: (ids: string[]) => void
  audioPublication: {
    title: string
    author: string
    cover: string
    coverMimeType: string
  }
  setAudioPublication: (audioPublication: {
    title: string
    author: string
    cover: string
    coverMimeType: string
  }) => void
  isUploading: boolean
  resetAttachments: () => void
  setIsUploading: (isUploading: boolean) => void
  reset: () => void
}

export const usePublicationStore = create<PublicationState>((set) => ({
  publications: new Map(),
  setPublications: (publications) => set(() => ({ publications })),
  addPublication: (key: string, publication: postWithCommunityInfoType) => {
    set((state) => {
      const publications = new Map(state.publications)
      publications.set(key, publication)
      return { publications }
    })
  },
  addPublications: (publications) => {
    set((state) => {
      const newPublications = new Map(state.publications)
      publications.forEach((publication, key) => {
        newPublications.set(key, publication)
      })
      return { publications: newPublications }
    })
  },
  attachments: [],
  setAttachments: (attachments) => set(() => ({ attachments })),
  addAttachments: (attachments) => {
    set((state) => {
      const newAttachments = [...state.attachments, ...attachments]
      return { attachments: newAttachments }
    })
  },
  updateAttachments: (attachments) => {
    set((state) => {
      const newAttachments = state.attachments.map((attachment) => {
        const newAttachment = attachments.find(
          (newAttachment) => newAttachment.id === attachment.id
        )
        return newAttachment || attachment
      })
      return { attachments: newAttachments }
    })
  },
  removeAttachments: (ids) => {
    set((state) => {
      const newAttachments = state.attachments.filter(
        (attachment) => !ids.includes(attachment.id)
      )
      return { attachments: newAttachments }
    })
  },
  audioPublication: {
    title: '',
    author: '',
    cover: '',
    coverMimeType: ''
  },
  setAudioPublication: (audioPublication) => set(() => ({ audioPublication })),
  isUploading: false,
  resetAttachments: () =>
    set(() => ({
      attachments: [],
      audioPublication: {
        title: '',
        author: '',
        cover: '',
        coverMimeType: ''
      }
    })),
  setIsUploading: (isUploading) => set(() => ({ isUploading })),
  reset: () => set(() => ({ publications: new Map() }))
}))
