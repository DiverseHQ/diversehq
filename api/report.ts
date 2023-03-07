import apiEndpoint from './ApiEndpoint'
import { getHeaders } from './apiHelper'

export const reportPublicationToCommunityMods = async (
  publicationId: string,
  communityId: string,
  reason: string,
  subReason: string,
  additionalComments?: string
) => {
  return await fetch(`${apiEndpoint}/report/report-publication`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      publicationId,
      communityId,
      reason,
      subReason,
      additionalComments
    })
  })
}

export const getUnresolvedPublicationReportsOfCommunity = async (
  communityId: string
) => {
  return await fetch(
    `${apiEndpoint}/report/unresolved-publication-reports/${communityId}`,
    {
      headers: getHeaders()
    }
  )
}

export const resolvePublicationReport = async (
  publicationId: string,
  communityId: string
) => {
  return await fetch(
    `${apiEndpoint}/report/resolve-publication-report/${publicationId}/${communityId}`,
    {
      method: 'PUT',
      headers: getHeaders()
    }
  )
}
