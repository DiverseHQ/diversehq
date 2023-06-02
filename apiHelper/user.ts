import { URLSearchParams } from 'next/dist/compiled/@edge-runtime/primitives/url'
import apiEndpoint from './ApiEndpoint'
import { getHeaders } from './apiHelper'

export const getUserInfo = async (walletAddress) => {
  return await fetch(`${apiEndpoint}/user/walletaddress/${walletAddress}`).then(
    (res) => res.json()
  )
}

export const getUserFromAddressOrName = async (addressOrName) => {
  return await fetch(`${apiEndpoint}/user/nameoraddress/${addressOrName}`).then(
    (res) => res
  )
}

export const getWhitelistStatus = async (walletAddress) => {
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

export const getUserPosts = async (walletAddress, limit, skips, sortBy) => {
  return await fetch(
    `${apiEndpoint}/post/getPostsOfUser/${walletAddress}?` +
      new URLSearchParams({
        limit: String(limit),
        skips: String(skips),
        sortBy
      })
  ).then((res) => res.json())
}

export const putUpdateUser = async (profileData) => {
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

export const getAllNotifications = async (limit, skips) => {
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

export const getAllNotificationBetweenTimes = async (from, to) => {
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

export const toggleHighSignalNotifsPreference = async () => {
  return await fetch(
    `
  ${apiEndpoint}/user/toggle-high-signal-notification-preference`,
    {
      method: 'PUT',
      headers: await getHeaders()
    }
  )
}

export const toggleAppendHastagPreference = async () => {
  return await fetch(`${apiEndpoint}/user/toggle-append-hashtags-preference`, {
    method: 'PUT',
    headers: await getHeaders()
  })
}

export const toggleAppendLinkPreference = async () => {
  return await fetch(`${apiEndpoint}/user/toggle-append-link-preference`, {
    method: 'PUT',
    headers: await getHeaders()
  })
}

export const sendSubscription = async (subscription) => {
  return await fetch(`${apiEndpoint}/user/subscribe`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(subscription)
  })
}

export const removeSubscription = async (subscription) => {
  return await fetch(`${apiEndpoint}/user/unsubscribe`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(subscription)
  })
}

export const isSubscribed = async (subscription) => {
  return await fetch(`${apiEndpoint}/user/is-subscribed`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(subscription)
  })
}
