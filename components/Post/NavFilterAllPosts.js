import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'

const NavFilterAllPosts = () => {
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
    <div className="flex flex-row items-center p-2 gap-4 pt-10">
      <div
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full ${
          active === 'new' && 'bg-white'
        }  hover:bg-[#eee]`}
      >
        <HiSparkles />
        <button
          onClick={() => {
            router.push('/feed/new')
          }}
        >
          New
        </button>
      </div>
      <div
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full ${
          active === 'top' && 'bg-white'
        }  hover:bg-[#eee]`}
        onClick={() => {
          router.push('/feed/top')
        }}
      >
        <MdLeaderboard />
        <button>Top</button>
      </div>
      <div
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full ${
          active === 'lens' && 'bg-white'
        }  hover:bg-[#eee]`}
        onClick={() => {
          router.push('/feed/lens')
        }}
      >
        <img src="/lensLogo.svg" className="h-5 w-5" alt="lens logo icon" />
        <button>Lens</button>
      </div>
      {/* <div
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full ${
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

export default NavFilterAllPosts
