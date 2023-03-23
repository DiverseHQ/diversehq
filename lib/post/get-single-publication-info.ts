import { fetchData } from '../../auth-fetcher'
import {
  PublicationDocument,
  PublicationQuery,
  PublicationQueryRequest,
  PublicationQueryVariables
} from '../../graphql/generated'

export default async function getSinglePublicationInfo(
  request: PublicationQueryRequest
): Promise<PublicationQuery> {
  return await fetchData<PublicationQuery, PublicationQueryVariables>(
    PublicationDocument,
    {
      request: {
        publicationId: request.publicationId
      },
      reactionRequest: {
        profileId: null
      }
    }
  )()
}
