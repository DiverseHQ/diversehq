import { create } from 'zustand'
import { postWithCommunityInfoType } from '../types/post'

export interface AttachmentType {
  id?: string
  type: string
  altTag?: string
  item?: string
  cover?: string
  previewItem?: string
  file?: File
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
  commnetAttachments: AttachmentType[]
  setAttachments: (attachments: AttachmentType[]) => void
  setCoomentAttachments: (attachments: AttachmentType[]) => void
  addAttachments: (attachments: AttachmentType[]) => void
  addCommentAttachments: (attachments: AttachmentType[]) => void
  updateAttachments: (attachments: AttachmentType[]) => void
  updateCommentAttachments: (attachments: AttachmentType[]) => void
  removeAttachments: (ids: string[]) => void
  removeCommentAttachments: (ids: string[]) => void
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
  resetCommentAttachments: () => void
  setIsUploading: (isUploading: boolean) => void
  reset: () => void
  videoDurationInSeconds: string;
  setVideoDurationInSeconds: (videoDurationInSeconds: string) => void;
  videoThumbnail: {
    url?: string;
    type?: string;
    uploading?: boolean;
  };
  setVideoThumbnail: (videoThumbnail: {
    url?: string;
    type?: string;
    uploading?: boolean;
  }) => void;
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
  commnetAttachments: [],
  setAttachments: (attachments) => set(() => ({ attachments })),
  setCoomentAttachments: (attachments) =>
    set(() => ({ commnetAttachments: attachments })),
  addAttachments: (attachments) => {
    set((state) => {
      const newAttachments = [...state.attachments, ...attachments]
      return { attachments: newAttachments }
    })
  },
  addCommentAttachments: (attachments) => {
    set((state) => {
      const newAttachments = [...state.commnetAttachments, ...attachments]
      return { commnetAttachments: newAttachments }
    })
  },
  videoThumbnail: { url: '', type: '', uploading: false },
  setVideoThumbnail: (videoThumbnail) => set(() => ({ videoThumbnail })),
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
  updateCommentAttachments: (attachments) => {
    set((state) => {
      const newAttachments = state.commnetAttachments.map((attachment) => {
        const newAttachment = attachments.find(
          (newAttachment) => newAttachment.id === attachment.id
        )
        return newAttachment || attachment
      })
      return { commnetAttachments: newAttachments }
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
  removeCommentAttachments: (ids) => {
    set((state) => {
      const newAttachments = state.commnetAttachments.filter(
        (attachment) => !ids.includes(attachment.id)
      )
      return { commnetAttachments: newAttachments }
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
  resetCommentAttachments: () =>
    set(() => ({
      commnetAttachments: []
    })),
  setIsUploading: (isUploading) => set(() => ({ isUploading })),
  reset: () => set(() => ({ publications: new Map() })),
  videoDurationInSeconds: '',
  setVideoDurationInSeconds: (videoDurationInSeconds) =>
    set(() => ({ videoDurationInSeconds })),
}))
