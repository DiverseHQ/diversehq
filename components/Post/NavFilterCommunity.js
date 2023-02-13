import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { memo } from 'react'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'
import useDevice from '../Common/useDevice'

const NavFilterCommunity = ({ name }) => {
  const router = useRouter()
  const { pathname } = router
  const [active, setActive] = useState('lens')
  const { isMobile } = useDevice()

  useEffect(() => {
    if (pathname.endsWith('/new')) {
      setActive('new')
    } else if (pathname.endsWith('/top')) {
      setActive('top')
    } else if (pathname.endsWith('/hot')) {
      setActive('hot')
    } else if (pathname.endsWith('/lens')) {
      setActive('lens')
    } else {
      setActive('lens')
    }
  }, [pathname])

  return (
    <div
      className={`font-bold text-sm sm:text-base flex flex-row px-3 sm:px-6 md:mt-10 py-2 md:py-3 w-full sm:rounded-xl justify-start space-x-5 md:space-x-9 items-center ${
        isMobile
          ? 'mb-4 rounded-[10px]'
          : 'bg-white dark:bg-s-bg border-[1px] border-p-border'
      }`}
    >
      <button
        className={`flex p-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'lens'
            ? `${isMobile ? 'bg-s-bg' : 'bg-p-bg'}`
            : `${
                isMobile
                  ? 'bg-p-hover text-p-hover-text'
                  : 'hover:bg-p-hover hover:text-p-hover-text'
              }`
        }`}
        onClick={() => {
          router.push(`/c/${name}/feed/lens`)
        }}
      >
        <img src="/lensLogo.svg" className="h-5 w-5" alt="lens logo icon" />
        <div>Lens</div>
      </button>
      <button
        className={`flex p-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl
        ${
          active === 'new'
            ? `${isMobile ? 'bg-s-bg' : 'bg-p-bg'}`
            : `${
                isMobile
                  ? 'bg-p-hover text-p-hover-text'
                  : 'hover:bg-p-hover hover:text-p-hover-text'
              }`
        }`}
        onClick={() => {
          router.push(`/c/${name}/feed/new`)
        }}
      >
        <HiSparkles />
        <div>New</div>
      </button>
      <button
        className={`flex p-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'top'
            ? `${isMobile ? 'bg-s-bg' : 'bg-p-bg'}`
            : `${
                isMobile
                  ? 'bg-p-hover text-p-hover-text'
                  : 'hover:bg-p-hover hover:text-p-hover-text'
              }`
        }`}
        onClick={() => {
          router.push(`/c/${name}/feed/top`)
        }}
      >
        <MdLeaderboard />
        <div>Top</div>
      </button>
      {/* <div
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-xl ${
          active === 'hot' && 'bg-white'
        }  hover:bg-[#eee]`}
        onClick={() => {
          router.push('/explore/hot')
        }}
      >
        <SiHotjar />
        <button>Hot</button>
      </div> */}
    </div>
  )
}

export default memo(NavFilterCommunity)
