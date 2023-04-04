import { create } from 'zustand'
import { postWithCommunityInfoType } from '../types/post'

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
  reset: () => set(() => ({ publications: new Map() }))
}))
