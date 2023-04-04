import { create } from 'zustand'
import { Profile } from '../graphql/generated'

/* eslint-disable */

// profiles is a map of handle to profile
interface ProfileState {
  profiles: Map<string, Profile>
  setProfiles: (profiles: Map<string, Profile>) => void
  addProfile: (key: string, profile: Profile) => void
  addProfiles: (profiles: Map<string, Profile>) => void
  reset: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: new Map(),
  setProfiles: (profiles) => set(() => ({ profiles })),
  addProfile: (key: string, profile: Profile) => {
    set((state) => {
      const profiles = new Map(state.profiles)
      profiles.set(key, profile)
      return { profiles }
    })
  },
  addProfiles: (profiles) => {
    set((state) => {
      const newProfiles = new Map(state.profiles)
      profiles.forEach((profile, key) => {
        newProfiles.set(key, profile)
      })
      return { profiles: newProfiles }
    })
  },
  reset: () => set(() => ({ profiles: new Map() }))
}))
