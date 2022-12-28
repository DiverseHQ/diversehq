import apiEndpoint from './ApiEndpoint'
import { CommunityType } from '../utils/types'
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
    ).then((res) => res.json())
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
  sortBy: string
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

export const postCreateCommunity = async (
  token: string,
  communityData: CommunityType
) => {
  return await fetch(`${apiEndpoint}/community`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(communityData)
  }).then((res) => res)
}

export const putEditCommunity = async (
  token: string,
  communityData: CommunityType
) => {
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
  name: string
): Promise<CommunityType[]> => {
  try {
    return await fetch(
      `${apiEndpoint}/community/search?` +
        new URLSearchParams({
          name
        })
    ).then((res) => res.json())
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getJoinedCommunitiesApi = async (
  walletAddress: string
): Promise<CommunityType[]> => {
  try {
    return await fetch(
      `${apiEndpoint}/community/getJoinedCommunitiesOfUser?walletAddress=${walletAddress}`
    ).then((res) => res.json())
  } catch (error) {
    console.log(error)
    return []
  }
}
