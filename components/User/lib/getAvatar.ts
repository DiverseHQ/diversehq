import { Profile } from '../../../graphql/generated'
import { ZERO_ADDRESS } from '../../../utils/config'
import getIPFSLink from './getIPFSLink'
import getStampFyiURL from './getStampFyiURL'
import imageProxy from './imageProxy'

const getAvatar = (profile: Profile, imageProxyTr?: string): string => {
  // @ts-ignore
  if (profile?.metadata?.picture?.optimized?.uri) {
    // @ts-ignore
    return profile?.metadata?.picture?.optimized?.uri
  }
  if (!profile?.metadata?.picture) {
    return getStampFyiURL(profile?.ownedBy?.address ?? ZERO_ADDRESS)
  }
  if (profile?.metadata.picture?.__typename === 'NftImage') {
    return profile?.metadata.picture?.image?.optimized?.uri
      ? imageProxy(
          getIPFSLink(profile?.metadata.picture?.image?.optimized?.uri),
          imageProxyTr ?? 'w-150,h-150,q-30'
        )
      : getStampFyiURL(profile?.ownedBy?.address ?? ZERO_ADDRESS)
  }
  if (profile?.metadata.picture?.__typename === 'ImageSet') {
    return profile?.metadata.picture?.optimized?.uri
      ? imageProxy(
          getIPFSLink(profile?.metadata.picture?.optimized?.uri),
          imageProxyTr ?? 'w-150,h-150,q-30'
        )
      : getStampFyiURL(profile?.ownedBy?.address ?? ZERO_ADDRESS)
  }
}

export default getAvatar
