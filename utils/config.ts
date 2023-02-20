export const POST_LIMIT: number = 10
export const COMMENT_LIMIT: number = 10
export const LENS_POST_LIMIT: number = 10
export const LENS_COMMENT_LIMIT: number = 10
export const LENS_NOTIFICATION_LIMIT: number = 10
export const NOTIFICATION_LIMIT: number = 10
export const COMMUNITY_LIMIT: number = 5
export const MAX_CONTENT_LINES: number = 4
export const MAX_CONTENT_LINES_FOR_POST: number = 6
export const LENS_SEARCH_PROFILE_LIMIT: number = 4
export const LensInfuraEndpoint: string = 'https://lens.infura-ipfs.io/ipfs/'
export const LENS_INFINITE_SCROLL_THRESHOLD: number = 0.5

export const userRoles = {
  ADMIN_USER: 0,
  WHITELISTED_USER: 1,
  NORMAL_USER: 2
}

export const notificationTypes = {
  POST: 0,
  COMMENT: 1,
  UPVOTE_POST: 2,
  UPVOTE_COMMENT: 3
}

export const sortTypes = {
  LATEST: 'Latest',
  TOP_TODAY: 'Top Today',
  TOP_WEEK: 'Top Week',
  TOP_MONTH: 'Top Month'
}

export const recommendedCommunitiesIds = [
  '63b068ca07a65dd65e5c6687', // Diverse HQ
  '63b1c8298bce8b3e7b295915', // Crypto
  '63b1c9ae675d8d93aaf53f6c', // airdrops
  '63b1bb1318b63498449c1b13', // dank memes
  '63b1c91218b63498449c1b93', // gaming
  '63b1ccdb18b63498449c1bb0' // anime
]

export const DISCORD_INVITE_LINK = 'https://discord.gg/x7jByQKpYF'
export const IMAGE_KIT_ENDPOINT = 'https://ik.imagekit.io/kopveel8c'

export const XMTP_PREFIX = 'lens.dev/dm'
export const XMTP_ENV = 'dev'
export const MAX_PROFILES_PER_REQUEST = 50
export const MESSAGE_PAGE_LIMIT = 30
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/** For Publication */

export const supportedMimeTypes: string[] = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/x-ms-bmp',
  'image/svg+xml',
  'image/webp',
  'video/webm',
  'video/mp4',
  'video/x-m4v',
  'video/ogv',
  'video/ogg',
  'audio/wav',
  'audio/mpeg',
  'audio/ogg'
]

export const SUPPORTED_IMAGE_TYPE: string[] = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/x-ms-bmp',
  'image/svg+xml',
  'image/webp'
]

export const SUPPORTED_VIDEO_TYPE: string[] = [
  'video/webm',
  'video/mp4',
  'video/x-m4v',
  'video/ogv',
  'video/ogg'
]

export const SUPPORTED_AUDIO_TYPE: string[] = [
  'audio/wav',
  'audio/mpeg',
  'audio/ogg'
]

// XP and Level configs
export const baseXP = 200
export const xpMultiplier = 4
export const xpPerMember = 10
