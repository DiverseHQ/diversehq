import { fetchData } from '../../auth-fetcher'
import {
  PublicationDocument,
  PublicationQuery,
  PublicationQueryVariables
} from '../../graphql/generated'

export default async function getSinglePublicationInfo(
  request: PublicationQueryVariables
): Promise<PublicationQuery> {
  return await fetchData<PublicationQuery, PublicationQueryVariables>(
    PublicationDocument,
    request
  )()
}
