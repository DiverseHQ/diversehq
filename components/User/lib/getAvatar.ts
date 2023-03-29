import { Profile } from '../../../graphql/generated'
import { ZERO_ADDRESS } from '../../../utils/config'
import getIPFSLink from './getIPFSLink'
import getStampFyiURL from './getStampFyiURL'

const getAvatar = (profile: Profile): string => {
  if (profile?.picture?.__typename === 'NftImage') {
    return getIPFSLink(
      profile?.picture?.uri ?? getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
    )
  }
  if (profile?.picture?.__typename === 'MediaSet') {
    return getIPFSLink(
      profile?.picture?.original?.url ??
        getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
    )
  }

  return getIPFSLink(
    // @ts-ignore
    profile?.picture?.original?.url ??
      // @ts-ignore
      profile?.picture?.uri ??
      getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
  )
}

export default getAvatar
