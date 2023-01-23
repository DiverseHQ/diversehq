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

const LensProfilesSearchModal = ({
  searchTerm,
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
    router.push(`/u/${handle}`)
  }

  return (
    <>
      {lensProfiles.length > 0 && (
        <div>
          <div className="m-2 p-2 text-base font-bold">Profiles</div>
          {lensProfiles.map((profile) => (
            <div
              className="hover:underline hover:bg-p-hover hover:text-p-hover-text m-2 flex flex-row p-2  items-center rounded-[25px] cursor-pointer"
              key={profile.id}
              onClick={() => {
                inputRef.current.value = ''
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
                    : '/gradient.jpg'
                }
                className="w-10 h-10 mr-5 rounded-full object-cover"
              />
              <div className="flex flex-col text-sm">
                <div>{stringToLength(profile.name, 20)}</div>
                <div className="underline-offset-4 ">u/{profile.handle}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default LensProfilesSearchModal
