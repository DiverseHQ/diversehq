import { fetchData } from '../../auth-fetcher'
import {
  ProfileDocument,
  ProfileQuery,
  ProfileQueryVariables,
  SingleProfileQueryRequest
} from '../../graphql/generated'

export default async function getLensProfileInfo(
  _request: SingleProfileQueryRequest
): Promise<ProfileQuery> {
  return await fetchData<ProfileQuery, ProfileQueryVariables>(ProfileDocument, {
    request: _request
  })()
}
