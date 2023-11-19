import { fetchData } from '../../auth-fetcher'
import {
  ProfileDocument,
  ProfileQuery,
  ProfileQueryVariables,
  ProfileRequest
} from '../../graphql/generated'

export default async function getLensProfileInfo(
  _request: ProfileRequest
): Promise<ProfileQuery> {
  return await fetchData<ProfileQuery, ProfileQueryVariables>(ProfileDocument, {
    request: _request
  })()
}
