import { BannedUser } from '../types/community'
import apiEndpoint from './ApiEndpoint'
import { getHeaders } from './apiHelper'

// handle with suffix
export const getLensCommunity = async (handle: string) => {
  return await fetch(
    `${apiEndpoint}/lensCommunity/communityInfoUsingHandle/${handle}`
  )
}

export const postCreateLensCommunity = async (handle: string) => {
  return await fetch(`${apiEndpoint}/lensCommunity/create`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({
      handle
    })
  })
}

export const getAllLensCommunitiesHandle = async (): Promise<
  {
    _id: string
    handle: string
  }[]
> => {
  return await fetch(`${apiEndpoint}/lensCommunity/get-all-lens-communities`, {
    headers: await getHeaders()
  }).then((res) => res.json())
}

export const addBannedUserToLensCommunity = async (
  communityId: string,
  bannedUser: BannedUser
) => {
  return await fetch(
    `${apiEndpoint}/lensCommunity/add-banned-user/${communityId}`,
    {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({
        bannedUser
      })
    }
  )
}

export const removeBannedUserFromLensCommunity = async (
  communityId: string,
  bannedUserAddress: string
) => {
  return await fetch(
    `${apiEndpoint}/lensCommunity/remove-banned-user/${communityId}`,
    {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({
        bannedUserAddress
      })
    }
  )
}
