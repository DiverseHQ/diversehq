import apiEndpoint from './ApiEndpoint'
import { BannedUser, CommunityType, Rule } from '../types/community'
import { getHeaders } from './apiHelper'

export const getPostOfCommunity = async (
  communityName: string,
  limit: number,
  skips: number,
  sortBy: string
) => {
  return await fetch(
    `${apiEndpoint}/post/getPostsOfCommunity/${communityName}?` +
      new URLSearchParams({
        limit: limit.toString(),
        skips: skips.toString(),
        sortBy
      })
  ).then((res) => res.json())
}

export const getCommunityInfo = async (name: string) => {
  try {
    return await fetch(
      `${apiEndpoint}/community/communityInfoUsingName/${name}`
    ).then((res) => res)
  } catch (error) {
    console.log(error)
  }
}

export const getCommunityInfoUsingId = async (communityId: string) => {
  try {
    return await fetch(
      `${apiEndpoint}/community/communityinfo/${communityId}`
    ).then((res) => res.json())
  } catch (error) {
    console.log(error)
  }
}

export const postGetCommunityExistStatus = async (name: string) => {
  try {
    return await fetch(`${apiEndpoint}/community/community-exist-status`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({
        name: name
      })
    }).then((res) => res.json())
  } catch (error) {
    console.log(error)
  }
}

export const postGetCommunityInfoUsingListOfIds = async (
  communityIds: string[]
) => {
  try {
    return await fetch(
      `${apiEndpoint}/community/community-info-using-list-of-ids`,
      {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({
          communityIds: communityIds
        })
      }
    ).then((res) => res.json())
  } catch (error) {
    console.log(error)
  }
}

export const putJoinCommunity = async (communityId: string) => {
  return await fetch(`${apiEndpoint}/community/join/${communityId}`, {
    method: 'PUT',
    headers: await getHeaders()
  })
}

export const putLeaveCommunity = async (communityId: string) => {
  return await fetch(`${apiEndpoint}/community/leave/${communityId}`, {
    method: 'PUT',
    headers: await getHeaders()
  }).then((res) => res.json())
}

export const getAllCommunities = async (
  limit: number,
  skips: number,
  sortBy?: string
) => {
  try {
    return await fetch(
      `${apiEndpoint}/community/getAllCommunities?` +
        new URLSearchParams({
          limit: limit.toString(),
          skips: skips.toString(),
          sortBy
        })
    ).then((res) => res.json())
  } catch (error) {
    console.log(error)
  }
}

export const getNotJoinedCommunities = async (
  limit: number,
  skips: number,
  sortBy?: string
) => {
  try {
    return await fetch(
      `${apiEndpoint}/community/getNotJoinedCommunitiesOfUser?` +
        new URLSearchParams({
          limit: limit.toString(),
          skips: skips.toString(),
          sortBy
        }),
      {
        headers: await getHeaders()
      }
    ).then((res) => res.json())
  } catch (error) {
    console.log(error)
  }
}

export const getAllCommunitiesIds = async () => {
  try {
    return await fetch(`${apiEndpoint}/community/getAllCommunitiesIds`).then(
      (res) => res.json()
    )
  } catch (error) {
    console.log(error)
  }
}

export const postCreateCommunity = async (communityData: CommunityType) => {
  return await fetch(`${apiEndpoint}/community`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(communityData)
  }).then((res) => res)
}

export const putEditCommunity = async (communityData: CommunityType) => {
  return await fetch(
    `${apiEndpoint}/community/edit/${communityData.communityId}`,
    {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(communityData)
    }
  ).then((res) => res)
}

export const searchCommunityFromName = async (
  name: string,
  limit: number
): Promise<CommunityType[]> => {
  try {
    return await fetch(
      `${apiEndpoint}/community/search?` +
        new URLSearchParams({
          name,
          limit: limit.toString()
        })
    ).then((res) => res.json())
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getJoinedCommunitiesApi = async (): Promise<CommunityType[]> => {
  try {
    return await fetch(`${apiEndpoint}/community/getJoinedCommunitiesOfUser`, {
      headers: await getHeaders()
    }).then((res) => res.json())
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getCreatedCommunitiesApi = async (): Promise<CommunityType[]> => {
  try {
    return await fetch(`${apiEndpoint}/community/getCreatedCommunitiesOfUser`, {
      headers: await getHeaders()
    }).then((res) => res.json())
  } catch (error) {
    console.log(error)
    return []
  }
}

export const isCreatorOrModeratorOfCommunity = async (name: string) => {
  try {
    return await fetch(
      `${apiEndpoint}/community/${name}/isCreatorOrModeratorOfCommunity`,
      {
        headers: await getHeaders()
      }
    )
  } catch (error) {
    console.log(error)
  }
}

export const addModeratorsToCommunity = async (
  name: string,
  moderators: string[]
) => {
  try {
    return await fetch(`${apiEndpoint}/community/${name}/add-moderators`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({
        moderators
      })
    })
  } catch (error) {
    console.log(error)
  }
}

export const removeModeratorFromCommunity = async (
  name: string,
  moderator: string
) => {
  try {
    return await fetch(`${apiEndpoint}/community/${name}/remove-moderator`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({
        moderator
      })
    })
  } catch (error) {
    console.log(error)
  }
}

export const setRulesOfCommunity = async (name: string, rules: Rule[]) => {
  try {
    return await fetch(`${apiEndpoint}/community/${name}/set-rules`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({
        rules
      })
    })
  } catch (error) {
    console.log(error)
  }
}

export const addBannedUserToCommunity = async (
  name: string,
  bannedUser: BannedUser
) => {
  try {
    return await fetch(`${apiEndpoint}/community/${name}/add-banned-user`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({
        bannedUser
      })
    })
  } catch (error) {
    console.log(error)
  }
}

export const removeBannedUserFromCommunity = async (
  name: string,
  bannedUserAddress: string
) => {
  try {
    return await fetch(`${apiEndpoint}/community/${name}/remove-banned-user`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({
        bannedUserAddress
      })
    })
  } catch (error) {
    console.log(error)
  }
}

export const getLensCommunity = async (handle: string) => {
  return await fetch(
    `${apiEndpoint}/lensCommunity/communityInfoUsingHandle/${handle}`
  )
}
