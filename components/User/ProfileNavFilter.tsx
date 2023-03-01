import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { HiCollection, HiSparkles } from 'react-icons/hi'
import { Profile } from '../../graphql/generated'
import { sortTypes } from '../../utils/config'
import useSort from '../Common/Hook/useSort'
import OptionsWrapper from '../Common/OptionsWrapper'
import FilterButton from '../Common/UI/FilterButton'
import FilterRow from '../Common/UI/FilterRow'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import formatHandle from './lib/formatHandle'

interface Props {
  _lensProfile: Profile
}

const ProfileNavFilter = ({ _lensProfile }: Props) => {
  const router = useRouter()
  const { pathname } = router
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const { sortType } = useSort()

  const addQueryParam = (key, value) => {
    // @ts-ignore
    const query = new URLSearchParams(router.query)
    query.set(key, value)
    router.push({ query: query.toString() })
  }

  return (
    <FilterRow
      EndButton={
        <>
          {!pathname.endsWith('/collected') && (
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
                IconAtEnd={<AiOutlineDown className="h-3 w-3" />}
              />
            </OptionsWrapper>
          )}
        </>
      }
    >
      <FilterButton
        title="Posts"
        active={!pathname.endsWith('/collected')}
        onClick={() => {
          router.push(`/u/${formatHandle(_lensProfile?.handle)}`)
        }}
        Icon={<HiSparkles className="h-5 w-5" />}
      />
      <FilterButton
        title="Collected"
        active={pathname.endsWith('/collected')}
        onClick={() => {
          router.push(`/u/${formatHandle(_lensProfile?.handle)}/feed/collected`)
        }}
        Icon={<HiCollection className="h-5 w-5" />}
      />
    </FilterRow>
  )
}

export default ProfileNavFilter
