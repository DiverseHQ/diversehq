import React, { useEffect, useState } from 'react'
import {
  LimitType,
  Profile,
  useSearchProfilesQuery
} from '../../graphql/generated'
import { stringToLength } from '../../utils/utils'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'
import { memo } from 'react'
import { useRouter } from 'next/router'
import SeeMoreResultsButton from './SeeMoreResultsButton'
/* eslint-disable */

interface Props {
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  inputRef: React.RefObject<HTMLInputElement>
  onProfileSelect: (profile: Profile) => void
  showLable?: boolean
}

const LensProfilesSearchModal = ({
  searchTerm,
  setSearchTerm,
  inputRef,
  showLable = true,
  onProfileSelect
}: Props) => {
  const router = useRouter()
  const [lensProfiles, setLensProfiles] = useState<Profile[]>([])
  const searchProfileQuery = useSearchProfilesQuery(
    {
      request: {
        query: searchTerm,
        limit: LimitType.Ten
      }
    },
    {
      enabled: searchTerm.length > 0
    }
  )

  console.log('searchProfile', searchProfileQuery?.data?.searchProfiles)

  useEffect(() => {
    searchProfileQuery.refetch()
  }, [searchTerm])

  const handleOutsideClick = (e) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target) &&
      lensProfiles.length > 0
    ) {
      setLensProfiles([])
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (searchProfileQuery?.data?.searchProfiles?.items.length > 0) {
      //@ts-ignore
      setLensProfiles(searchProfileQuery?.data?.searchProfiles?.items)
    }
    // @ts-ignore
  }, [searchProfileQuery?.data?.searchProfiles?.items])

  const gotToSearchPageToGetMoreResults = () => {
    router.push(`/search?type=profile&q=${searchTerm}`)
  }

  return (
    <>
      {lensProfiles.length > 0 && (
        <div>
          {showLable && (
            <div className="m-2 p-2 text-base font-bold">Profiles</div>
          )}
          {lensProfiles.map((profile) => (
            <div
              className="hover:bg-s-hover m-2 flex flex-row p-1  items-center rounded-full cursor-pointer"
              key={profile.id}
              onClick={() => {
                inputRef.current.value = ''
                setSearchTerm('')
                onProfileSelect(profile)
              }}
            >
              <ImageWithPulsingLoader
                src={getAvatar(profile)}
                className="w-8 h-8 mr-3 rounded-full object-cover"
              />
              <div className="flex flex-col text-sm">
                <div>{stringToLength(profile?.metadata?.displayName, 20)}</div>
                <div className="text-s-text">
                  u/{formatHandle(profile.handle)}
                </div>
              </div>
            </div>
          ))}
          {/* more search results button */}
          <SeeMoreResultsButton
            goToSearchProfilePage={gotToSearchPageToGetMoreResults}
          />
        </div>
      )}
    </>
  )
}

export default memo(LensProfilesSearchModal)
