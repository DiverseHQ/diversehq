import { ZERO_ADDRESS } from '../../../utils/config'
import getIPFSLink from './getIPFSLink'
import getStampFyiURL from './getStampFyiURL'

const getAvatar = (profile: any): string => {
  return getIPFSLink(
    profile?.picture?.original?.url ??
      profile?.picture?.uri ??
      getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
  )
}

export default getAvatar
