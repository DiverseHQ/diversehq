import React, { useEffect, useState } from 'react'
import {
  Profile,
  SearchRequestTypes,
  useSearchProfilesQuery
} from '../../graphql/generated'
import { LENS_SEARCH_PROFILE_LIMIT } from '../../utils/config'
import { stringToLength } from '../../utils/utils'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'
import { memo } from 'react'
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
  const [lensProfiles, setLensProfiles] = useState<Profile[]>([])
  const searchProfileQuery = useSearchProfilesQuery(
    {
      request: {
        query: searchTerm,
        type: SearchRequestTypes.Profile,
        limit: LENS_SEARCH_PROFILE_LIMIT
      }
    },
    {
      enabled: searchTerm.length > 0
    }
  )

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
    if (
      searchProfileQuery?.data?.search?.__typename === 'ProfileSearchResult' &&
      searchProfileQuery?.data?.search?.items
    ) {
      //@ts-ignore
      setLensProfiles(searchProfileQuery?.data?.search?.items)
    }
    // @ts-ignore
  }, [searchProfileQuery?.data?.search?.items])

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
                <div>{stringToLength(profile.name, 20)}</div>
                <div className="text-s-text">
                  u/{formatHandle(profile.handle)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default memo(LensProfilesSearchModal)
