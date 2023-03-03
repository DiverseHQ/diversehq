import { useRouter } from 'next/router'
import React, { memo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { CgCommunity } from 'react-icons/cg'
import { MdOutlineExplore } from 'react-icons/md'
import { sortTypes } from '../../utils/config'
import OptionsWrapper from '../Common/OptionsWrapper'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import FilterRow from '../Common/UI/FilterRow'
import FilterButton from '../Common/UI/FilterButton'
import useSort from '../Common/Hook/useSort'
// import { track } from '../../utils/analytics'

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
    } else {
      setActive('all')
    }
  }, [pathname])

  return (
    <FilterRow
      EndButton={
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
            IconAtEnd={<AiOutlineDown className="w-3 h-3" />}
            className="item-end"
          />
        </OptionsWrapper>
      }
    >
      <FilterButton
        Icon={<MdOutlineExplore className="h-5 w-5" />}
        title="All"
        active={active === 'all'}
        onClick={() => {
          router.push('/feed/all')
        }}
        tooltipTitle="Posts from all communities"
      />
      <FilterButton
        Icon={<CgCommunity className="h-6 w-6" />}
        title="For You"
        active={active === 'foryou'}
        onClick={() => {
          // track('Clicked For You', { location: router.asPath })
          router.push('/feed/foryou')
        }}
        tooltipTitle="Posts from communities you joined"
      />
    </FilterRow>
  )
}

export default memo(NavFilterAllPosts)
