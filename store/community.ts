import { create } from 'zustand'
import { CommunityType, LensCommunity } from '../types/community'

/* eslint-disable */

interface CommunityState {
  communities: Map<string, CommunityType>
  setCommunities: (communities: Map<string, CommunityType>) => void
  addCommunity: (key: string, community: CommunityType) => void
  addCommunities: (communities: Map<string, CommunityType>) => void
  reset: () => void
  selectCommunityForPost: (community: CommunityType) => void
  selectedCommunity: CommunityType | null
}

interface LensCommunityState {
  communities: Map<string, LensCommunity>
  setCommunities: (communities: Map<string, LensCommunity>) => void
  addCommunity: (key: string, community: LensCommunity) => void
  addCommunities: (communities: Map<string, LensCommunity>) => void
  reset: () => void
}

interface AuthCommunityState {
  isCreator: Map<string, boolean>
  isModerator: Map<string, boolean>
  setIsCreator: (isCreator: Map<string, boolean>) => void
  setIsModerator: (isModerator: Map<string, boolean>) => void
  addIsCreator: (key: string, isCreator: boolean) => void
  addIsModerator: (key: string, isModerator: boolean) => void
  reset: () => void
}

// Map<> key is community name & value is community object
export const useCommunityStore = create<CommunityState>((set) => ({
  communities: new Map(),
  setCommunities: (communities) => set(() => ({ communities })),
  addCommunity: (key, community) => {
    set((state) => {
      const communities = new Map(state.communities)
      communities.set(key, community)
      return { communities }
    })
  },
  addCommunities: (communities) => {
    set((state) => {
      const newCommunities = new Map(state.communities)
      communities.forEach((community, key) => {
        newCommunities.set(key, community)
      })
      return { communities: newCommunities }
    })
  },
  reset: () => set(() => ({ communities: new Map() })),
  selectCommunityForPost: (community) =>
    set(() => {
      if (community?.handle || community?.isLensCommunity) {
        community.isLensCommunity = true
      } else {
        community.isLensCommunity = false
      }
      return { selectedCommunity: community }
    }),
  selectedCommunity: null
}))

export const useLensCommunityStore = create<LensCommunityState>((set) => ({
  communities: new Map(),
  setCommunities: (communities) => set(() => ({ communities })),
  addCommunity: (key, community) => {
    set((state) => {
      const communities = new Map(state.communities)
      communities.set(key, community)
      return { communities }
    })
  },
  addCommunities: (communities) => {
    set((state) => {
      const newCommunities = new Map(state.communities)
      communities.forEach((community, key) => {
        newCommunities.set(key, community)
      })
      return { communities: newCommunities }
    })
  },
  reset: () => set(() => ({ communities: new Map() }))
}))

// map of community and clearance for example
// Map of community name to isCreator
// Map of community name to isModerator or isCreator
export const useAuthCommunityStore = create<AuthCommunityState>((set) => ({
  isCreator: new Map(),
  isModerator: new Map(),
  setIsCreator: (isCreator) => set(() => ({ isCreator })),
  setIsModerator: (isModerator) => set(() => ({ isModerator })),
  addIsCreator: (key, isCreator) => {
    set((state) => {
      const isCreatorMap = new Map(state.isCreator)
      isCreatorMap.set(key, isCreator)

      const isModeratorMap = new Map(state.isModerator)
      if (isCreator) {
        isModeratorMap.set(key, isCreator)
      }
      return { isCreator: isCreatorMap, isModerator: isModeratorMap }
    })
  },
  addIsModerator: (key, isModerator) => {
    set((state) => {
      const isModeratorMap = new Map(state.isModerator)
      isModeratorMap.set(key, isModerator)
      return { isModerator: isModeratorMap }
    })
  },
  reset: () => set(() => ({ isCreator: new Map(), isModerator: new Map() }))
}))
