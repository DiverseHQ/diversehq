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
    <div className="font-bold text-sm sm:text-base flex flex-row  border px-3 sm:px-6 bg-white mt-4 sm:mt-0 mb-4 py-1 sm:py-3 w-full   sm:rounded-xl space-x-4 sm:space-x-9 items-center">
      <div
        className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'top' && 'bg-p-bg'
        }  hover:bg-p-btn-hover`}
        onClick={() => {
          router.push('/explore/top')
        }}
      >
        <MdLeaderboard />
        <button>Top</button>
      </div>
      <div
        className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'new' && 'bg-p-bg'
        }  hover:bg-p-btn-hover`}
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
