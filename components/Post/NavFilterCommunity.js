import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { memo } from 'react'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'

const NavFilterCommunity = ({ name }) => {
  const router = useRouter()
  const { pathname } = router
  const [active, setActive] = useState('new')

  useEffect(() => {
    console.log('pathname', pathname)
    if (pathname.endsWith('/new')) {
      setActive('new')
    } else if (pathname.endsWith('/top')) {
      setActive('top')
    } else if (pathname.endsWith('/hot')) {
      setActive('hot')
    } else if (pathname.endsWith('/lens')) {
      setActive('lens')
    }
  }, [pathname])

  return (
    <div className="font-bold text-sm sm:text-base flex flex-row  border px-3 sm:px-6 bg-white mb-1 py-1 sm:py-3 w-full sm:rounded-xl justify-between sm:justify-start sm:space-x-9 items-center">
      <button
        className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'new' && 'bg-p-bg'
        }  hover:bg-p-btn-hover`}
        onClick={() => {
          router.push(`/c/${name}/feed/new`)
        }}
      >
        <HiSparkles />
        <div>New</div>
      </button>
      <button
        className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'top' && 'bg-p-bg'
        }  hover:bg-p-btn-hover`}
        onClick={() => {
          router.push(`/c/${name}/feed/top`)
        }}
      >
        <MdLeaderboard />
        <div>Top</div>
      </button>
      <button
        className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'lens' && 'bg-p-bg'
        }  hover:bg-p-btn-hover`}
        onClick={() => {
          router.push(`/c/${name}/feed/lens`)
        }}
      >
        <img src="/lensLogo.svg" className="h-5 w-5" alt="lens logo icon" />
        <div>Lens</div>
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
