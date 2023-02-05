import { useRouter } from 'next/router'
import React from 'react'
import useNotificationsCount from './useNotificationsCount'
import { GiBreakingChain } from 'react-icons/gi'
import { useState } from 'react'
import { useEffect } from 'react'

const NotificationFilterNav = () => {
  const router = useRouter()
  const { pathname } = router
  const [active, setActive] = useState('lens')
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
    <div className="font-bold text-sm sm:text-base flex flex-row  border-[1px] border-p-border px-3 sm:px-6 bg-white sm:mt-10 mt-4 py-1 mb-2 sm:mb-4 sm:py-3 w-full sm:rounded-xl space-x-9 items-center dark:bg-s-bg">
      <button
        className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'lens' && 'bg-p-bg'
        }  hover:bg-p-hover hover:text-p-hover-text relative`}
        onClick={() => {
          router.push('/notification/lens')
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
          active === 'offchain' && 'bg-p-bg'
        }  hover:bg-p-hover hover:text-p-hover-text relative`}
        onClick={async () => {
          await updateNotificationCount()
          router.push('/notification/offchain')
        }}
      >
        <GiBreakingChain className="h-5 w-5" />
        <div>{'Off-chain '}</div>
        {notificationsCount > 0 && active === 'lens' && (
          <div className="absolute left-0 top-0 leading-[4px] p-1 font-bold text-[8px] text-p-btn-text bg-red-500 rounded-full">
            <span>{notificationsCount}</span>
          </div>
        )}
      </button>
    </div>
  )
}

export default NotificationFilterNav
