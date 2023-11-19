import { Profile } from '../../../graphql/generated'
// import getIPFSLink from './getIPFSLink'
// import imageProxy from './imageProxy'

const getCoverBanner = (profile: Profile): string => {
  return profile?.metadata?.coverPicture?.optimized?.uri ?? '/defaultBanner.png'
  // if (profile?.metadata?.coverPicture.optimized.uri) {
  //   return profile?.coverPicture?.uri
  //     ? imageProxy(getIPFSLink(profile?.coverPicture?.uri))
  //     : '/defaultBanner.png'
  // }

  // if (profile?.coverPicture?.__typename === 'MediaSet') {
  //   return profile?.coverPicture?.original?.url
  //     ? imageProxy(getIPFSLink(profile?.coverPicture?.original?.url))
  //     : '/defaultBanner.png'
  // }

  // // @ts-ignore
  // return profile?.coverPicture?.original?.url || profile?.coverPicture?.uri
  //   ? imageProxy(
  //       getIPFSLink(
  //         // @ts-ignore
  //         profile?.coverPicture?.original?.url ??
  //           // @ts-ignore
  //           profile?.coverPicture?.uri
  //       )
  //     )
  //   : '/defaultBanner.png'
}

export default getCoverBanner
