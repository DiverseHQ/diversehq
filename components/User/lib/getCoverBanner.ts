import { Profile } from '../../../graphql/generated'
import getIPFSLink from './getIPFSLink'
import imageProxy from './imageProxy'

const getCoverBanner = (profile: Profile): string => {
  if (profile?.coverPicture?.__typename === 'NftImage') {
    return getIPFSLink(profile?.coverPicture?.uri ?? '/gradient.jpg')
  }

  if (profile?.coverPicture?.__typename === 'MediaSet') {
    return imageProxy(
      getIPFSLink(profile?.coverPicture?.original?.url ?? '/gradient.jpg')
    )
  }

  return imageProxy(
    getIPFSLink(
      // @ts-ignore
      profile?.coverPicture?.original?.url ??
        // @ts-ignore
        profile?.coverPicture?.uri ??
        '/gradient.jpg'
    )
  )
}

export default getCoverBanner
