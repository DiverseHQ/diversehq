import { fetchData } from '../../auth-fetcher'
import {
  PublicationDocument,
  PublicationQuery,
  PublicationQueryVariables
} from '../../graphql/generated'

export default async function getSinglePublicationInfo(
  id: String
): Promise<PublicationQuery> {
  let profileId = null
  if (typeof localStorage !== 'undefined') {
    profileId = localStorage.getItem('lensUserProfileId')
    console.log('profileId', profileId)
  }

  return await fetchData<PublicationQuery, PublicationQueryVariables>(
    PublicationDocument,
    {
      request: {
        publicationId: id
      },
      reactionRequest: {
        profileId: profileId
      }
    }
  )()
}
