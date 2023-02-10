import { fetchData } from '../../auth-fetcher'
import {
  ProfileQueryRequest,
  ProfilesDocument,
  ProfilesQuery,
  ProfilesQueryVariables
} from '../../graphql/generated'

export default async function getProfiles(
  request: ProfileQueryRequest
): Promise<ProfilesQuery> {
  return await fetchData<ProfilesQuery, ProfilesQueryVariables>(
    ProfilesDocument,
    {
      request: request
    }
  )()
}
