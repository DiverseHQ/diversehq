import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import {
  SearchRequestTypes,
  useSearchProfilesQuery
} from '../../graphql/generated'
import {
  LensInfuraEndpoint,
  LENS_SEARCH_PROFILE_LIMIT
} from '../../utils/config'
import { stringToLength } from '../../utils/utils'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import formatHandle from '../User/lib/formatHandle'
import getStampFyiURL from '../User/lib/getStampFyiURL'

const LensProfilesSearchModal = ({
  searchTerm,
  setSearchTerm,
  inputRef,
  lensProfiles,
  setLensProfiles
}) => {
  const router = useRouter()
  const searchProfileQuery = useSearchProfilesQuery({
    request: {
      query: searchTerm,
      type: SearchRequestTypes.Profile,
      limit: LENS_SEARCH_PROFILE_LIMIT
    }
  })
  useEffect(() => {
    searchProfileQuery.refetch()
  }, [searchTerm])

  useEffect(() => {
    if (searchProfileQuery?.data?.search?.items) {
      setLensProfiles(searchProfileQuery?.data?.search?.items)
    }
  }, [searchProfileQuery?.data?.search?.items])

  const handleProfileClicked = (handle) => {
    router.push(`/u/${formatHandle(handle)}`)
  }

  return (
    <>
      {lensProfiles.length > 0 && (
        <div>
          <div className="m-2 p-2 text-base font-bold">Profiles</div>
          {lensProfiles.map((profile) => (
            <div
              className="hover:bg-p-btn-hover m-2 flex flex-row p-1  items-center rounded-full cursor-pointer"
              key={profile.id}
              onClick={() => {
                inputRef.current.value = ''
                setSearchTerm('')
                handleProfileClicked(profile.handle)
              }}
            >
              <ImageWithPulsingLoader
                src={
                  profile?.picture?.original?.url
                    ? profile?.picture?.original?.url.startsWith('ipfs://')
                      ? `${LensInfuraEndpoint}${profile?.picture?.original?.url?.replace(
                          'ipfs://',
                          ''
                        )}`
                      : profile?.picture?.original?.url
                    : getStampFyiURL(profile?.ownedBy)
                }
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

export default LensProfilesSearchModal
