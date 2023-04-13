import { Publication } from '../../../graphql/generated'
import getIPFSLink from './getIPFSLink'

export const getThumbnailUrl = (publication: Publication): string => {
  if (!publication) return ''

  const url =
    publication.metadata?.cover?.original.url || publication.metadata?.image

  return getIPFSLink(url)
}
