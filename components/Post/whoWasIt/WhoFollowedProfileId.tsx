import React, { useEffect, useState } from 'react'
import PopUpWrapper from '../../Common/PopUpWrapper'
import {
  LimitType,
  Profile,
  useFollowersQuery
} from '../../../graphql/generated'
import InfiniteScroll from 'react-infinite-scroll-component'
import MobileLoader from '../../Common/UI/MobileLoader'
import WhoWasItProfileCard from './WhoWasItProfileCard'
import { useProfileStore } from '../../../store/profile'

const WhoFollowedProfileId = ({
  profileId,
  totalFollowers,
  isLensCommunity = false
}: {
  profileId: string
  totalFollowers: number
  isLensCommunity?: boolean
}) => {
  const [params, setParams] = useState<{
    profiles: Profile[]
    hasMore: boolean
    cursor: string | null
    nextCursor: string | null
  }>({
    profiles: [],
    hasMore: true,
    cursor: null,
    nextCursor: null
  })
  const addProfiles = useProfileStore((state) => state.addProfiles)

  const { data } = useFollowersQuery({
    request: {
      of: profileId,
      cursor: params.cursor,
      limit: LimitType.Fifty
    }
  })

  useEffect(() => {
    if (data?.followers?.items) {
      setParams({
        ...params,
        // @ts-ignore
        profiles: data?.followers?.items.length
          ? // eslint-disable-next-line
            [...params.profiles, ...data?.followers?.items]
          : params.profiles,
        hasMore: Boolean(data?.followers?.items?.length),
        nextCursor: data?.followers?.pageInfo?.next
      })

      const newProfiles = new Map()
      // eslint-disable-next-line
      for (const profile of data?.followers?.items) {
        newProfiles.set(profile.handle.fullHandle, profile)
      }
      addProfiles(newProfiles)
    }
  }, [data])

  const getMore = () => {
    if (params?.nextCursor) {
      setParams({
        ...params,
        cursor: params.nextCursor
      })
    }
  }

  return (
    <PopUpWrapper
      title={
        isLensCommunity
          ? `Members (${totalFollowers})`
          : `Followers (${totalFollowers})`
      }
    >
      <div
        className="h-full sm:h-[calc(100vh-200px)] overflow-y-auto"
        id="whoReactedPublicattionScrollbar"
      >
        <InfiniteScroll
          dataLength={params.profiles.length}
          next={getMore}
          hasMore={params.hasMore}
          loader={<MobileLoader />}
          scrollableTarget="whoReactedPublicattionScrollbar"
        >
          {params.profiles.map((profile, idx) => {
            return <WhoWasItProfileCard profile={profile} key={idx} />
          })}
        </InfiniteScroll>
      </div>
    </PopUpWrapper>
  )
}

export default WhoFollowedProfileId
