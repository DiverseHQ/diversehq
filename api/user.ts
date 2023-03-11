import { URLSearchParams } from 'next/dist/compiled/@edge-runtime/primitives/url'
import apiEndpoint from './ApiEndpoint'
import { getHeaders } from './apiHelper'

export const getUserInfo = async (walletAddress: string) => {
  return await fetch(`${apiEndpoint}/user/walletaddress/${walletAddress}`).then(
    (res) => res.json()
  )
}

export const getUserFromAddressOrName = async (addressOrName: string) => {
  return await fetch(`${apiEndpoint}/user/nameoraddress/${addressOrName}`).then(
    (res) => res
  )
}

export const getWhitelistStatus = async (walletAddress: string) => {
  return await fetch(
    `${apiEndpoint}/user/checkWhitelist/${walletAddress}`
  ).then((res) => res)
}

export const postUser = async () => {
  return await fetch(`${apiEndpoint}/user`, {
    method: 'POST',
    headers: await getHeaders()
  })
    .then((r) => r.json())
    .then((res) => {
      console.log(res)
    })
}

export const getUserPosts = async (
  walletAddress: string,
  limit: number,
  skips: number,
  sortBy: string
) => {
  return await fetch(
    `${apiEndpoint}/post/getPostsOfUser/${walletAddress}?` +
      new URLSearchParams({
        limit: String(limit),
        skips: String(skips),
        sortBy
      })
  ).then((res) => res.json())
}

export const putUpdateUser = async (profileData: any) => {
  return await fetch(`${apiEndpoint}/user`, {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(profileData)
  }).then((r) => r)
}

export const getUnReadNotificationsCount = async () => {
  return await fetch(`${apiEndpoint}/user/unread-notification-count`, {
    method: 'GET',
    headers: await getHeaders()
  }).then((res) => res.json())
}

export const getAllNotifications = async (limit: number, skips: number) => {
  return await fetch(
    `${apiEndpoint}/user/get-all-notifications?` +
      new URLSearchParams({
        limit: String(limit),
        skips: String(skips)
      }),
    {
      method: 'GET',
      headers: await getHeaders()
    }
  ).then((res) => res.json())
}

export const putUpdateLensNotificationDate = async () => {
  return await fetch(`${apiEndpoint}/user/update-lens-notif-time`, {
    method: 'PUT',
    headers: await getHeaders()
  }).then((res) => res.json())
}

export const getAllNotificationBetweenTimes = async (
  from: string,
  to: string
) => {
  return await fetch(
    `${apiEndpoint}/user/get-all-notifications-between-time?` +
      new URLSearchParams({
        from,
        to
      }),
    {
      method: 'GET',
      headers: await getHeaders()
    }
  )
}
