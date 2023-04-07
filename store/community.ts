import { create } from 'zustand'
import { CommunityType } from '../types/community'

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
