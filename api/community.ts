import apiEndpoint from './ApiEndpoint'
import { CommunityType } from '../types/community'
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

export const postGetCommunityInfoUsingListOfIds = async (
  communityIds: string[]
) => {
  try {
    return await fetch(
      `${apiEndpoint}/community/community-info-using-list-of-ids`,
      {
        method: 'POST',
        headers: getHeaders(),
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
    headers: getHeaders()
  }).then((res) => res.json())
}

export const putLeaveCommunity = async (communityId: string) => {
  return await fetch(`${apiEndpoint}/community/leave/${communityId}`, {
    method: 'PUT',
    headers: getHeaders()
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
        headers: getHeaders()
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
    headers: getHeaders(),
    body: JSON.stringify(communityData)
  }).then((res) => res)
}

export const putEditCommunity = async (communityData: CommunityType) => {
  return await fetch(
    `${apiEndpoint}/community/edit/${communityData.communityId}`,
    {
      method: 'PUT',
      headers: getHeaders(),
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
      headers: getHeaders()
    }).then((res) => res.json())
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getCreatedCommunitiesApi = async (): Promise<CommunityType[]> => {
  try {
    return await fetch(`${apiEndpoint}/community/getCreatedCommunitiesOfUser`, {
      headers: getHeaders()
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
        headers: getHeaders()
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
      headers: getHeaders(),
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
      headers: getHeaders(),
      body: JSON.stringify({
        moderator
      })
    })
  } catch (error) {
    console.log(error)
  }
}
