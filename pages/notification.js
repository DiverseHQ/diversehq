import React, { useState } from 'react'
import LensNotificationColumn from '../components/Notification/LensNotificationColumn'
import NotificationColumn from '../components/Notification/NotificationColumn'
import NotificationSeo from '../components/Notification/NotificationSeo'
import useNotificationsCount from '../components/Notification/useNotificationsCount'
import { GiBreakingChain } from 'react-icons/gi'
const notification = () => {
  const [showLensNotifications, setShowLensNotifications] = useState(true)
  const { notificationsCount, setNotificationsCount } = useNotificationsCount()
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
              }  hover:bg-p-btn-hover relative`}
              onClick={() => {
                setShowLensNotifications(true)
              }}
            >
              <img
                src="/lensLogoWithoutText.svg"
                className="h-5 w-5 "
                alt="lens logo icon"
              />
              <div>Lens</div>
            </button>

            <button
              className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                !showLensNotifications && 'bg-p-bg'
              }  hover:bg-p-btn-hover relative`}
              onClick={() => {
                setShowLensNotifications(false)
                setNotificationsCount(0)
              }}
            >
              <GiBreakingChain className="h-5 w-5" />
              <div>{'Off-chain '}</div>
              {notificationsCount > 0 && showLensNotifications && (
                <div className="absolute left-0 top-0 leading-[4px] p-1text-[8px] text-p-btn-text bg-p-btn rounded-full">
                  <span>{notificationsCount}</span>
                </div>
              )}
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
