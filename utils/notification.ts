// notification.js

import { sendSubscription } from '../apiHelper/user'

const base64ToUint8Array = (base64) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(b64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

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
        // await sendSubscription(exisitingSubscription)
      } else {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_KEY
          )
        })
        await sendSubscription(subscription)
      }
    }
    return null
  } catch (error) {
    console.log(error)
  }
}
