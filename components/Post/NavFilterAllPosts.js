import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { AiOutlineDown, AiOutlineFire } from 'react-icons/ai'
import { CgCommunity } from 'react-icons/cg'
import { GiBreakingChain } from 'react-icons/gi'
import { HiOutlineSparkles } from 'react-icons/hi'
import { MdOutlineExplore } from 'react-icons/md'
import { sortTypes } from '../../utils/config'
import OptionsWrapper from '../Common/OptionsWrapper'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'

const NavFilterAllPosts = () => {
  const router = useRouter()
  const { pathname } = router
  const [active, setActive] = useState('all')
  const [sortType, setSortType] = useState(sortTypes.LATEST)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)

  useEffect(() => {
    if (router.query.sort && sortType !== router.query.sort) {
      setSortType(router.query.sort)
    }
    if (!router.query.sort) {
      setSortType(sortTypes.LATEST)
    }
  }, [router.query])

  const addQueryParam = (key, value) => {
    const query = new URLSearchParams(router.query)
    query.set(key, value)
    router.push({ query: query.toString() })
  }

  useEffect(() => {
    if (pathname.endsWith('/offchain')) {
      setActive('offchain')
    } else if (pathname.endsWith('/all')) {
      setActive('all')
    } else if (pathname.endsWith('/foryou')) {
      setActive('foryou')
    } else {
      setActive('all')
    }
  }, [pathname])

  return (
    <div className="font-bold text-sm sm:text-base flex flex-row border-[1px]  border-p-border px-3 sm:px-6 bg-white dark:bg-s-bg py-1 sm:py-3 w-full sm:rounded-xl justify-between sm:justify-start sm:space-x-8 items-center dark:text-p-text">
      <button
        className={` flex items-center hover:cursor-pointer gap-2 p-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl ${
          active === 'all' && 'bg-p-bg'
        }  hover:bg-p-hover hover:text-p-hover-text`}
        onClick={() => {
          router.push('/feed/all')
        }}
      >
        <MdOutlineExplore className="h-5 w-5" />
        <div>All</div>
      </button>
      <button
        className={`flex items-center hover:cursor-pointer gap-1 p-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl ${
          active === 'foryou' && 'bg-p-bg'
        }  hover:bg-p-hover hover:text-p-hover-text`}
        onClick={() => {
          router.push('/feed/foryou')
        }}
      >
        <CgCommunity className="h-6 w-6" />
        <div>For You</div>
      </button>
      <button
        className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
          active === 'offchain' && 'bg-p-bg'
        }  hover:bg-p-hover hover:text-p-hover-text`}
        onClick={() => {
          router.push('/feed/offchain')
        }}
      >
        <GiBreakingChain className="h-5 w-5" />
        <div>Off-chain</div>
      </button>
      {!pathname.startsWith('/feed/offchain') && (
        <OptionsWrapper
          OptionPopUpModal={() => (
            <MoreOptionsModal
              className="z-50"
              list={[
                {
                  label: sortTypes.LATEST,
                  onClick: () => {
                    addQueryParam('sort', sortTypes.LATEST)
                    setSortType(sortTypes.LATEST)
                    setIsDrawerOpen(false)
                    setShowOptionsModal(false)
                  },
                  icon: () => <HiOutlineSparkles className="h-5 w-5" />
                },
                {
                  label: sortTypes.TOP_TODAY,
                  onClick: () => {
                    addQueryParam('sort', sortTypes.TOP_TODAY)
                    setSortType(sortTypes.TOP_TODAY)
                    setIsDrawerOpen(false)
                    setShowOptionsModal(false)
                  },
                  icon: () => <AiOutlineFire className="h-5 w-5" />
                },
                {
                  label: sortTypes.TOP_WEEK,
                  onClick: () => {
                    addQueryParam('sort', sortTypes.TOP_WEEK)
                    setSortType(sortTypes.TOP_WEEK)
                    setIsDrawerOpen(false)
                    setShowOptionsModal(false)
                  },
                  icon: () => <AiOutlineFire className="h-5 w-5" />
                },
                {
                  label: sortTypes.TOP_MONTH,
                  onClick: () => {
                    addQueryParam('sort', sortTypes.TOP_MONTH)
                    setSortType(sortTypes.TOP_MONTH)
                    setIsDrawerOpen(false)
                    setShowOptionsModal(false)
                  },
                  icon: () => <AiOutlineFire className="h-5 w-5" />
                }
              ]}
            />
          )}
          position="right"
          showOptionsModal={showOptionsModal}
          setShowOptionsModal={setShowOptionsModal}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        >
          <button
            className={` flex items-center hover:cursor-pointer gap-2 p-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl bg-p-bg  hover:bg-p-hover hover:text-p-hover-text`}
          >
            <div className="flex flex-row items-center justify-center space-x-1">
              {sortType === sortTypes.LATEST ? (
                <HiOutlineSparkles className="h-5 w-5" />
              ) : (
                <AiOutlineFire className="h-5 w-5" />
              )}
              <div>{sortType}</div>
            </div>
            <AiOutlineDown className="w-3 h-3" />
          </button>
        </OptionsWrapper>
      )}
    </div>
  )
}

export default NavFilterAllPosts
