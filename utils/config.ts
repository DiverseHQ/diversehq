export const POST_LIMIT: number = 10
export const COMMENT_LIMIT: number = 10
export const LENS_POST_LIMIT: number = 10
export const LENS_COMMENT_LIMIT: number = 10
export const LENS_NOTIFICATION_LIMIT: number = 10
export const NOTIFICATION_LIMIT: number = 10
export const COMMUNITY_LIMIT: number = 5
export const MAX_CONTENT_LINES: number = 4
export const MAX_CONTENT_LINES_FOR_POST: number = 6
export const LENS_SEARCH_PROFILE_LIMIT: number = 6
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
/* eslint-disable */

// XP and Level configs
export const baseXP = 200
export const xpMultiplier = 4
export const xpPerMember = 10
export const apiMode: string = 'dev'
export const isMainnet: boolean = apiMode === 'mainnet'
export const HANDLE_SUFFIX: string = isMainnet ? '.lens' : '.test'

// Named transforms
export const AVATAR = 'avatar'
export const COVER = 'cover'
export const ATTACHMENT = 'attachment'

// lens appId and its information
export const infoFromLensAppId = {
  lenster: {
    appId: 'lenster',
    logoLink: 'https://lenster.xyz/logo.svg',
    name: 'Lenster',
    description:
      'Lenster is a decentralized, and permissionless social media app built with Lens Protocol 🌿',
    link: 'https://lenster.xyz'
  },
  orb: {
    appId: 'orb',
    logoLink:
      'https://pbs.twimg.com/profile_images/1554199747560230912/uthjq-0D_400x400.jpg',
    name: 'Orb',
    description: 'Super App for Social Media.',
    link: 'https://orb.ac'
  },
  lenstube: {
    appId: 'lenstube',
    logoLink: 'https://static.lenstube.xyz/images/brand/lenstube.svg',
    name: 'Lenstube',
    description:
      'Decentralized, open-source video-sharing social media platform, built on Lens Protocol.',
    link: 'https://lenstube.xyz'
  },
  phaver: {
    appId: 'phaver',
    logoLink:
      'https://pbs.twimg.com/profile_images/1610386741931741184/JYAM_Y7T_400x400.jpg',
    name: 'Phaver',
    description: 'The Gateway to Web3 Social',
    link: 'https://phaver.com'
  },
  wav3s: {
    appId: 'wav3s',
    logoLink:
      'https://pbs.twimg.com/profile_images/1608995874255912961/d2peMxs__400x400.jpg',
    name: 'Wav3s',
    description: 'Your content promoted through web3 social media.',
    link: 'https://wav3s.app/'
  },
  lensport: {
    appId: 'lensport',
    logoLink: 'https://lensport.io/static/media/lensport_icon.e4bdb518.png',
    name: 'Lensport',
    description: 'Discover, collect, and sell amazing posts.',
    link: 'https://lensport.io'
  }
}

export const appId = 'diversehq'
