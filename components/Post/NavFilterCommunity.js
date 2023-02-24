import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { memo } from 'react'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'
import FilterRow from '../Common/UI/FilterRow'
import FilterButton from '../Common/UI/FilterButton'
import { sortTypes } from '../../utils/config'
import { AiOutlineDown } from 'react-icons/ai'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import OptionsWrapper from '../Common/OptionsWrapper'
import { useSortHook } from '../Common/SortWrapper'
import { useEffect } from 'react'
const NavFilterCommunity = () => {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const { sortType, isTop } = useSortHook()

  const addQueryParam = (key, value) => {
    // @ts-ignore
    const query = new URLSearchParams(router.query)
    query.set(key, value)
    setIsDrawerOpen(false)
    setShowOptionsModal(false)
    router.push({ query: query.toString() })
  }

  useEffect(() => {
    console.log('sortType', sortType)
    console.log('isTop', isTop)
  }, [sortType, isTop])

  return (
    <FilterRow>
      <FilterButton
        title="New"
        Icon={<HiSparkles />}
        active={!isTop}
        onClick={() => {
          addQueryParam('sort', sortTypes.LATEST)
        }}
      />
      <FilterButton
        title="Top"
        Icon={<MdLeaderboard />}
        active={isTop}
        onClick={() => {
          addQueryParam('sort', sortTypes.TOP_TODAY)
        }}
      />
      {isTop && (
        <OptionsWrapper
          OptionPopUpModal={() => (
            <MoreOptionsModal
              className="z-50"
              list={[
                {
                  label: sortTypes.TOP_TODAY,
                  onClick: () => {
                    addQueryParam('sort', sortTypes.TOP_TODAY)
                  }
                },
                {
                  label: sortTypes.TOP_WEEK,
                  onClick: () => {
                    addQueryParam('sort', sortTypes.TOP_WEEK)
                  }
                },
                {
                  label: sortTypes.TOP_MONTH,
                  onClick: () => {
                    addQueryParam('sort', sortTypes.TOP_MONTH)
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
            title={sortType}
            active={true}
            IconAtEnd={<AiOutlineDown className="h-3 w-3" />}
          />
        </OptionsWrapper>
      )}
    </FilterRow>
  )
}

export default memo(NavFilterCommunity)
