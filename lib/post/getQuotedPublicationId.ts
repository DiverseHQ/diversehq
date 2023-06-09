import { Post } from '../../graphql/generated'

export const getQuotedPublicationId = (post: Post): string | null => {
  const quotePublicationId = post?.metadata?.attributes?.find(
    (attribute) => attribute.traitType === 'quotedPublicationId'
  )?.value

  return quotePublicationId ?? null
}
