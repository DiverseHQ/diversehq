import { fetchData } from "../../auth-fetcher";
import { ChallengeDocument, ChallengeQuery, ChallengeQueryVariables } from "../../graphql/generated";


export default async function generateChallenge(address: string) {
  return await fetchData<ChallengeQuery, ChallengeQueryVariables>(
    ChallengeDocument,
    {
      request: {
        address,
      },
    }
  )();
}
