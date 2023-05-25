// notification.js

import { sendSubscription } from '../apiHelper/user'

export async function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.register(
        '/service-worker.js',
        {
          scope: '/'
        }
      )
      return registration
    }
  }
  return null
}

export async function subscribeUserToPush() {
  try {
    const registration = await requestNotificationPermission()
    if (registration) {
      const exisitingSubscription =
        await registration.pushManager.getSubscription()
      if (exisitingSubscription) {
        return
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY
      })
      await sendSubscription(subscription)
    }
    return null
  } catch (error) {
    console.log(error)
  }
}
