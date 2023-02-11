import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { GiBreakingChain } from 'react-icons/gi'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import useNotificationsCount from './useNotificationsCount'

const NotificationFilterDrawerButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()
  const { pathname } = router
  const [active, setActive] = useState('top')
  const { notificationsCount, updateNotificationCount } =
    useNotificationsCount()

  useEffect(() => {
    if (pathname.endsWith('/lens')) {
      setActive('lens')
    } else if (pathname.endsWith('offchain')) {
      setActive('offchain')
    } else {
      setActive('lens')
    }
  }, [pathname])
  return (
    <div className="relative">
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="flex flex-row items-center justify-center bg-p-btn-hover p-1 rounded-md"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.381 6.28567H7.85724M5.762 6.28567H2.61914M19.381 16.7619H7.85724M5.762 16.7619H2.61914M14.143 11.5238H2.61914M19.381 11.5238H16.2382M6.80962 4.19043C7.08746 4.19043 7.35393 4.3008 7.5504 4.49727C7.74686 4.69374 7.85724 4.9602 7.85724 5.23805V7.33329C7.85724 7.61113 7.74686 7.8776 7.5504 8.07407C7.35393 8.27053 7.08746 8.38091 6.80962 8.38091C6.53177 8.38091 6.26531 8.27053 6.06884 8.07407C5.87237 7.8776 5.762 7.61113 5.762 7.33329V5.23805C5.762 4.9602 5.87237 4.69374 6.06884 4.49727C6.26531 4.3008 6.53177 4.19043 6.80962 4.19043V4.19043ZM6.80962 14.6666C7.08746 14.6666 7.35393 14.777 7.5504 14.9735C7.74686 15.1699 7.85724 15.4364 7.85724 15.7142V17.8095C7.85724 18.0873 7.74686 18.3538 7.5504 18.5503C7.35393 18.7467 7.08746 18.8571 6.80962 18.8571C6.53177 18.8571 6.26531 18.7467 6.06884 18.5503C5.87237 18.3538 5.762 18.0873 5.762 17.8095V15.7142C5.762 15.4364 5.87237 15.1699 6.06884 14.9735C6.26531 14.777 6.53177 14.6666 6.80962 14.6666ZM15.1906 9.42853C15.4684 9.42853 15.7349 9.5389 15.9313 9.73537C16.1278 9.93183 16.2382 10.1983 16.2382 10.4761V12.5714C16.2382 12.8492 16.1278 13.1157 15.9313 13.3122C15.7349 13.5086 15.4684 13.619 15.1906 13.619C14.9127 13.619 14.6463 13.5086 14.4498 13.3122C14.2533 13.1157 14.143 12.8492 14.143 12.5714V10.4761C14.143 10.1983 14.2533 9.93183 14.4498 9.73537C14.6463 9.5389 14.9127 9.42853 15.1906 9.42853V9.42853Z"
            stroke="#E600EB"
            stroke-linecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="pl-2">{active}</span>
        {notificationsCount > 0 && active === 'lens' && (
          <div className="absolute right-0 top-0 leading-[4px] p-1 font-bold text-[8px] text-p-btn-text bg-red-500 rounded-full">
            <span>{notificationsCount}</span>
          </div>
        )}
      </button>
      <BottomDrawerWrapper
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        showClose={true}
        position="bottom"
      >
        <MoreOptionsModal
          list={[
            {
              label: 'Lens',
              onClick: () => {
                router.push('/notification/lens')
                setIsDrawerOpen(false)
              },
              icon: () => (
                <img
                  src="/lensLogoWithoutText.svg"
                  className="h-6 w-6 mr-1.5"
                />
              ),
              className: active === 'lens' ? 'bg-p-bg' : ''
            },
            {
              label: 'Offchain',
              onClick: async () => {
                await updateNotificationCount()
                router.push('/notification/offchain')
                setIsDrawerOpen(false)
              },
              icon: () => (
                <div className="relative">
                  <GiBreakingChain className="mr-1.5 w-6 h-6" />
                  {notificationsCount > 0 && active === 'lens' && (
                    <div className="absolute left-0 top-0 leading-[4px] p-1 font-bold text-[8px] text-p-btn-text bg-red-500 rounded-full">
                      <span>{notificationsCount}</span>
                    </div>
                  )}
                </div>
              )
            }
          ]}
        />
      </BottomDrawerWrapper>
    </div>
  )
}

export default NotificationFilterDrawerButton
