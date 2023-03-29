import { fetchData } from '../../auth-fetcher'
import {
  BulkIsFollowedByMeDocument,
  BulkIsFollowedByMeQuery,
  BulkIsFollowedByMeQueryVariables,
  ProfileQueryRequest
} from '../../graphql/generated'

export const getBulkIsFollowedByMe = async (
  request: ProfileQueryRequest
): Promise<BulkIsFollowedByMeQuery> => {
  return await fetchData<
    BulkIsFollowedByMeQuery,
    BulkIsFollowedByMeQueryVariables
  >(BulkIsFollowedByMeDocument, {
    request: request
  })()
}
