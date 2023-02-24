import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { HiCollection, HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'
import { Profile } from '../../graphql/generated'
import { sortTypes } from '../../utils/config'
import useSort from '../Common/Hook/useSort'
import OptionsWrapper from '../Common/OptionsWrapper'
import FilterButton from '../Common/UI/FilterButton'
import FilterRow from '../Common/UI/FilterRow'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'

interface Props {
  _lensProfile: Profile
}

const ProfileNavFilter = ({ _lensProfile }: Props) => {
  const router = useRouter()
  const { pathname } = router
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const { isTop, sortType } = useSort()

  const addQueryParam = (key, value) => {
    // @ts-ignore
    const query = new URLSearchParams(router.query)
    query.set(key, value)
    router.push({ query: query.toString() })
  }

  return (
    <FilterRow>
      <FilterButton
        title="Posts"
        active={!pathname.endsWith('/collected')}
        onClick={() => {
          router.push(`/u/${_lensProfile?.handle.split('.')[0]}`)
        }}
        Icon={<HiSparkles className="h-5 w-5" />}
      />
      <FilterButton
        title="Collected"
        active={pathname.endsWith('/collected')}
        onClick={() => {
          router.push(`/u/${_lensProfile?.handle.split('.')[0]}/feed/collected`)
        }}
        Icon={<HiCollection className="h-5 w-5" />}
      />
      {!pathname.endsWith('/collected') && (
        <FilterButton
          title="Top"
          active={isTop}
          onClick={() => {
            if (isTop) {
              addQueryParam('sort', sortTypes.LATEST)
              setIsDrawerOpen(false)
              setShowOptionsModal(false)
              return
            }
            if (sortType !== sortTypes.LATEST) return
            addQueryParam('sort', sortTypes.TOP_TODAY)
            setIsDrawerOpen(false)
            setShowOptionsModal(false)
          }}
          Icon={<MdLeaderboard className="h-5 w-5" />}
        />
      )}

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
            title={sortType}
            active={true}
            IconAtEnd={<AiOutlineDown className="h-3 w-3" />}
          />
        </OptionsWrapper>
      )}
    </FilterRow>
  )
}

export default ProfileNavFilter
