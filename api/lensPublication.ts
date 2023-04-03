import apiEndpoint from './ApiEndpoint'
import { getHeaders } from './apiHelper'

export const getJoinedLensPublication = async (
  limit: number,
  skips: number,
  JoinedLensCommunityIds: string[]
) => {
  return await fetch(
    `${apiEndpoint}/lensPublication/get-all-lens-publications?` +
      new URLSearchParams({
        limit: limit.toString(),
        skips: skips.toString()
      }),
    {
      headers: await getHeaders(),
      method: 'POST',
      body: JSON.stringify({
        JoinedLensCommunityIds
      })
    }
  )
}

export const putAddLensPublication = async (
  communityId: string,
  publicationId: string
) => {
  return await fetch(`${apiEndpoint}/lensPublication/add-lens-publication`, {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify({
      communityId,
      publicationId
    })
  })
}
