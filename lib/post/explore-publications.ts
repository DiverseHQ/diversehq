import { fetchData } from '../../auth-fetcher'
import {
  ExplorePublicationsDocument,
  ExplorePublicationsQuery,
  ExplorePublicationsQueryVariables
} from '../../graphql/generated'

export default async function getExplorePublications(
  request: ExplorePublicationsQueryVariables
): Promise<ExplorePublicationsQuery> {
  return await fetchData<
    ExplorePublicationsQuery,
    ExplorePublicationsQueryVariables
  >(ExplorePublicationsDocument, {
    request: request.request,
    profileId: request.profileId,
    reactionRequest: request.reactionRequest
  })()
}
