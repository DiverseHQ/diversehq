import { Profile } from '../../../graphql/generated'

// returns an object with website link, twitter link and instagram link from the profile object
export const getWebsiteLinksFromProfile = (
  profile: Profile
): {
  websiteLink: string | null
  twitterLink: string | null
  instagramLink: string | null
} => {
  if (!profile)
    return { websiteLink: null, twitterLink: null, instagramLink: null }
  const attributes = profile.attributes
  const websiteLink = attributes.find(
    (attribute) => attribute.key === 'website'
  )
  const twitterHandle = attributes.find(
    (attribute) => attribute.key === 'twitter'
  )
  const instagramHandle = attributes.find(
    (attribute) => attribute.key === 'instagram'
  )
  const twitterLink = twitterHandle
    ? `https://twitter.com/${twitterHandle.value}`
    : null
  const instagramLink = instagramHandle
    ? `https://instagram.com/${instagramHandle.value}`
    : null
  return {
    websiteLink: websiteLink ? websiteLink.value : null,
    twitterLink,
    instagramLink
  }
}
