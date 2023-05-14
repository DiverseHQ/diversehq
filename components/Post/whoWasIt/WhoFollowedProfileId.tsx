import React, { useEffect, useState } from 'react'
import PopUpWrapper from '../../Common/PopUpWrapper'
import { Follower, useFollowersQuery } from '../../../graphql/generated'
import InfiniteScroll from 'react-infinite-scroll-component'
import MobileLoader from '../../Common/UI/MobileLoader'
import { WHO_WAS_IT_PROFILES_LIMIT } from '../../../utils/config'
import WhoWasItProfileCard from './WhoWasItProfileCard'

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
    profiles: Follower[]
    hasMore: boolean
    cursor: string | null
    nextCursor: string | null
  }>({
    profiles: [],
    hasMore: true,
    cursor: null,
    nextCursor: null
  })

  const { data } = useFollowersQuery({
    request: {
      profileId: profileId,
      cursor: params.cursor,
      limit: WHO_WAS_IT_PROFILES_LIMIT
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
        className="h-full overflow-y-auto"
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
            return (
              <WhoWasItProfileCard
                profile={profile.wallet.defaultProfile}
                key={idx}
              />
            )
          })}
        </InfiniteScroll>
      </div>
    </PopUpWrapper>
  )
}

export default WhoFollowedProfileId
