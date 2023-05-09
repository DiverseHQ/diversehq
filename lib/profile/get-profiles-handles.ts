import { fetchData } from '../../auth-fetcher'
import {
  ProfileQueryRequest,
  ProfilesHandlesDocument,
  ProfilesHandlesQuery,
  ProfilesHandlesQueryVariables
} from '../../graphql/generated'

export default async function getProfilesHandles(
  request: ProfileQueryRequest
): Promise<ProfilesHandlesQuery> {
  return await fetchData<ProfilesHandlesQuery, ProfilesHandlesQueryVariables>(
    ProfilesHandlesDocument,
    {
      request: request
    }
  )()
}
