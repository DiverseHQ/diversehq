import { fetchData } from '../../auth-fetcher'
import {
  DefaultProfileDocument,
  DefaultProfileQuery,
  DefaultProfileQueryVariables,
  DefaultProfileRequest
} from '../../graphql/generated'

export default async function getDefaultProfileInfo(
  request: DefaultProfileRequest
): Promise<DefaultProfileQuery> {
  return await fetchData<DefaultProfileQuery, DefaultProfileQueryVariables>(
    DefaultProfileDocument,
    {
      request: request
    }
  )()
}
