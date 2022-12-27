import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'
// import { SiHotjar } from 'react-icons/si'

const ExploreFeedNav = () => {
  //get current page path
  const router = useRouter()
  const { pathname } = router
  const [active, setActive] = useState('top')

  useEffect(() => {
    console.log('pathname', pathname)
    if (pathname.endsWith('new')) {
      setActive('new')
    } else if (pathname.endsWith('top')) {
      setActive('top')
    } else if (pathname.endsWith('hot')) {
      setActive('hot')
    }
  }, [pathname])

  return (
    <div className="flex flex-row items-center p-2 gap-4">
      <div
        className={`flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full ${
          active === 'new' && 'bg-white'
        }  hover:bg-[#eee]`}
      >
        <HiSparkles />
        <button
          onClick={() => {
            router.push('/explore/new')
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
          router.push('/explore/top')
        }}
      >
        <MdLeaderboard />
        <button>Top</button>
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

export default ExploreFeedNav
