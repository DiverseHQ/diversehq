// import { sendSubscription } from './apiHelper/user'

self.addEventListener('push', (event) => {
  // Handle push notification event here
  console.log('notification received', event)

  if (event.data) {
    const pushData = event.data.json()
    const title = pushData.title
    const options = {
      body: pushData.body,
      icon: 'https://diversehq.xyz/android-chrome-192x192.png'
    }

    event.waitUntil(self.registration.showNotification(title, options))
  }
})

self.addEventListener('notificationclick', (event) => {
  // Handle notification click event here
  console.log('notification clicked', event)
})

// self.addEventListener('pushsubscriptionchange', (event) => {
//   // Handle push subscription change event here
//   event.waitUntil(
//     self.registration.pushManager
//       .getSubscription()
//       .then(async (subscription) => {
//         if (subscription) {
//           // Send the new subscription details to your server
//           //   return fetch('/update-subscription', {
//           //     method: 'POST',
//           //     headers: {
//           //       'Content-Type': 'application/json'
//           //     },
//           //     body: JSON.stringify(subscription)
//           //   })

//           await sendSubscription(subscription)
//         }
//       })
//       .catch((error) => {
//         console.error('Error during push subscription change:', error)
//       })
//   )
// })
