import { fetchData } from '../../auth-fetcher'
import { PublicationsDocument } from '../../graphql/generated'
import { PublicationsQuery } from '../../graphql/generated'
import { PublicationsQueryVariables } from '../../graphql/generated'

export default async function getExplorePublications(
  request: PublicationsQueryVariables
): Promise<PublicationsQuery> {
  return await fetchData<PublicationsQuery, PublicationsQueryVariables>(
    PublicationsDocument,
    {
      request: request
    }
  )()
}
