import { useRouter } from 'next/router'
import React, { memo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { CgCommunity } from 'react-icons/cg'
import { MdOutlineExplore } from 'react-icons/md'
import { sortTypes } from '../../utils/config'
import OptionsWrapper from '../Common/OptionsWrapper'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import FilterRow from '../Common/UI/FilterRow'
import FilterButton from '../Common/UI/FilterButton'
import useSort from '../Common/Hook/useSort'
import { BsChevronDown, BsPerson } from 'react-icons/bs'

const NavFilterAllPosts = () => {
  const router = useRouter()
  const { pathname } = router
  const [active, setActive] = useState('all')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const { sortType } = useSort()

  const addQueryParam = (key: string, value: string) => {
    // @ts-ignore
    const query = new URLSearchParams(router.query)
    query.set(key, value)
    router.push({ query: query.toString() })
  }

  useEffect(() => {
    if (pathname.endsWith('/all')) {
      setActive('all')
    } else if (pathname.endsWith('/foryou')) {
      setActive('foryou')
    } else if (pathname.endsWith('/timeline')) {
      setActive('timeline')
    } else {
      setActive('timeline')
    }
  }, [pathname])

  return (
    <FilterRow
      EndButton={
        !(active === 'foryou' || active === 'timeline') && (
          <OptionsWrapper
            OptionPopUpModal={() => (
              <MoreOptionsModal
                className="z-50"
                list={[
                  {
                    label: sortTypes.LATEST,
                    onClick: () => {
                      addQueryParam('sort', sortTypes.LATEST)
                      setIsDrawerOpen(false)
                      setShowOptionsModal(false)
                    }
                  },
                  {
                    label: sortTypes.TOP_TODAY,
                    onClick: () => {
                      addQueryParam('sort', sortTypes.TOP_TODAY)
                      setIsDrawerOpen(false)
                      setShowOptionsModal(false)
                    }
                  },
                  {
                    label: sortTypes.TOP_WEEK,
                    onClick: () => {
                      addQueryParam('sort', sortTypes.TOP_WEEK)
                      setIsDrawerOpen(false)
                      setShowOptionsModal(false)
                    }
                  },
                  {
                    label: sortTypes.TOP_MONTH,
                    onClick: () => {
                      addQueryParam('sort', sortTypes.TOP_MONTH)
                      setIsDrawerOpen(false)
                      setShowOptionsModal(false)
                    }
                  },
                  {
                    label: sortTypes.TOP_YEAR,
                    onClick: () => {
                      addQueryParam('sort', sortTypes.TOP_YEAR)
                      setIsDrawerOpen(false)
                      setShowOptionsModal(false)
                    }
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
            <FilterButton
              title={String(sortType)}
              active={true}
              IconAtEnd={<BsChevronDown className="w-3 h-3" />}
              className="item-end"
            />
          </OptionsWrapper>
        )
      }
    >
      <FilterButton
        Icon={<BsPerson className="h-5 w-5" />}
        title="Timeline"
        active={active === 'timeline'}
        onClick={() => {
          router.push('/')
        }}
        tooltipTitle="Timeline feed from all lens apps"
      />

      <FilterButton
        Icon={<CgCommunity className="h-5 w-5" />}
        title="For You"
        active={active === 'foryou'}
        onClick={() => {
          router.push('/feed/foryou')
        }}
        tooltipTitle="Posts from communities you joined"
      />
      <FilterButton
        Icon={<MdOutlineExplore className="h-4 w-4" />}
        title="All"
        active={active === 'all'}
        onClick={() => {
          router.push('/feed/all')
        }}
        tooltipTitle="Posts from all communities"
      />
    </FilterRow>
  )
}

export default memo(NavFilterAllPosts)
