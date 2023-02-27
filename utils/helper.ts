import { infoFromLensAppId } from './config'

export const isValidEthereumAddress = (address: string) => {
  if (typeof address !== 'string') {
    return false
  }

  if (address.length !== 42) {
    return false
  }

  if (!address.startsWith('0x')) {
    return false
  }

  if (!/^[0-9a-f]+$/i.test(address.slice(2))) {
    return false
  }

  return true
}

export const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export const getCommunityInfoFromAppId = (appId: string) => {
  if (infoFromLensAppId[appId]) {
    let communityInfo = {
      logoImageUrl: infoFromLensAppId[appId].logoLink,
      name: infoFromLensAppId[appId].name,
      description: infoFromLensAppId[appId].description,
      bannerImageUrl: infoFromLensAppId[appId].logoLink,
      link: infoFromLensAppId[appId].link
    }
    return communityInfo
  } else {
    return null
  }
}
