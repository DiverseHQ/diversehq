import apiEndpoint from './ApiEndpoint'
import { getHeaders } from './apiHelper'

export const reportPublicationToCommunityMods = async (data) => {
  return await fetch(`${apiEndpoint}/report/report-publication`, {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(data)
  })
}

export const getUnresolvedPublicationReportsOfCommunity = async (
  communityId: string
) => {
  return await fetch(
    `${apiEndpoint}/report/unresolved-publication-reports/${communityId}`,
    {
      headers: await getHeaders()
    }
  )
}

export const resolvePublicationReport = async (
  publicationId: string,
  communityId: string,
  resolveAction: string
) => {
  return await fetch(
    `${apiEndpoint}/report/resolve-publication-report/${publicationId}/${communityId}`,
    {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({
        resolveAction
      })
    }
  )
}
