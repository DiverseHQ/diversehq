// eslint-disable-next-line
// import { CommunityType } from './community'

// eslint-disable-next-line
enum userRole {
  // eslint-disable-next-line
  ADMIN_USER = 0,
  // eslint-disable-next-line
  WHITELISTED_USER = 1,
  // eslint-disable-next-line
  NORMAL_USER = 2
}

export type userPreferences = {
  theme: 'light' | 'dark'
  language: string
  highSignalNotifications: boolean
}

export type UserType = {
  _id?: string
  walletAddress: string
  name?: string
  profileImageUrl?: string
  bannerImageUrl?: string
  bannerFilePath?: string
  profileFilePath?: string
  bio?: string
  communities?: string[]
  createdCommunities?: string[]
  role: userRole.ADMIN_USER | userRole.WHITELISTED_USER | userRole.NORMAL_USER
  communityCreationSpells?: number
  createdAt?: string
  updatedAt?: string
  lastFetchedNotificationsTime?: string
  preferences?: userPreferences
  [key: string]: any
}
