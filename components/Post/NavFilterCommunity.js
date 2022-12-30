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
    <div className="flex flex-row items-center p-2 gap-4 pl-6 bg-white mt-2 py-3 rounded-xl space-x-9 sm:min-w-[650px]">
      <div
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-xl ${
          active === 'new' && 'bg-p-bg'
        }  hover:bg-[#eee]`}
      >
        <HiSparkles />
        <button
          onClick={() => {
            router.push(`/c/${name}/feed/new`)
          }}
        >
          New
        </button>
      </div>
      <div
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-xl ${
          active === 'top' && 'bg-p-bg'
        }  hover:bg-[#eee]`}
        onClick={() => {
          router.push(`/c/${name}/feed/top`)
        }}
      >
        <MdLeaderboard />
        <button>Top</button>
      </div>
      <div
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-xl ${
          active === 'lens' && 'bg-p-bg'
        }  hover:bg-[#eee]`}
        onClick={() => {
          router.push(`/c/${name}/feed/lens`)
        }}
      >
        <img src="/lensLogo.svg" className="h-5 w-5" alt="lens logo icon" />
        <button>Lens</button>
      </div>
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
