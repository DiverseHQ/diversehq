import { Profile } from '../../../graphql/generated'
import { ZERO_ADDRESS } from '../../../utils/config'
import getIPFSLink from './getIPFSLink'
import getStampFyiURL from './getStampFyiURL'
import imageProxy from './imageProxy'

const getAvatar = (profile: Profile): string => {
  if (profile?.picture?.__typename === 'NftImage') {
    return profile?.picture?.uri
      ? imageProxy(getIPFSLink(profile?.picture?.uri), 'w-250,h-250,q-50')
      : getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
  }
  if (profile?.picture?.__typename === 'MediaSet') {
    return profile?.picture?.original?.url
      ? imageProxy(
          getIPFSLink(profile?.picture?.original?.url),
          'w-200,h-200,q-50'
        )
      : getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
  }

  // @ts-ignore
  return profile?.picture?.original?.url
    ? // @ts-ignore
      imageProxy(
        // @ts-ignore
        getIPFSLink(profile?.picture?.original?.url),
        'w-250,h-250,q-50'
      )
    : // @ts-ignore
    profile?.picture?.uri
    ? // @ts-ignore
      imageProxy(getIPFSLink(profile?.picture?.uri), 'w-250,h-250,q-50')
    : getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
}

export default getAvatar
