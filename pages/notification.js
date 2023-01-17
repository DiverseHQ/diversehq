import React, { useState } from 'react'
import LensNotificationColumn from '../components/Notification/LensNotificationColumn'
import NotificationColumn from '../components/Notification/NotificationColumn'
import NotificationSeo from '../components/Notification/NotificationSeo'
const notification = () => {
  const [showLensNotifications, setShowLensNotifications] = useState(true)

  return (
    <>
      <NotificationSeo />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {/* filter nav */}
          <div className="font-bold text-sm sm:text-base flex flex-row  border px-3 sm:px-6 bg-white sm:mt-10 mt-4 py-1 mb-2 sm:mb-4 sm:py-3 w-full sm:rounded-xl space-x-9 items-center">
            <button
              className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                showLensNotifications && 'bg-p-bg'
              }  hover:bg-p-btn-hover`}
              onClick={() => {
                setShowLensNotifications(!showLensNotifications)
              }}
            >
              <img
                src="/lensLogoWithoutText.svg"
                className="h-5 w-5 "
                alt="lens logo icon"
              />
              <div>Lens</div>
            </button>
          </div>

          {/* notifications */}
          {showLensNotifications && <LensNotificationColumn />}
          {!showLensNotifications && <NotificationColumn />}
        </div>
      </div>
    </>
  )
}

export default notification
