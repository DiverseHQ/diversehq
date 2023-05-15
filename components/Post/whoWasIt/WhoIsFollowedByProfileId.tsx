import React, { useEffect, useState } from 'react'
import PopUpWrapper from '../../Common/PopUpWrapper'
import { Following, useFollowingQuery } from '../../../graphql/generated'
import InfiniteScroll from 'react-infinite-scroll-component'
import MobileLoader from '../../Common/UI/MobileLoader'
import { WHO_WAS_IT_PROFILES_LIMIT } from '../../../utils/config'
import WhoWasItProfileCard from './WhoWasItProfileCard'

const WhoIsFollowedByProfileId = ({
  address,
  totalFollowers
}: {
  address: string
  totalFollowers: number
}) => {
  const [params, setParams] = useState<{
    profiles: Following[]
    hasMore: boolean
    cursor: string | null
    nextCursor: string | null
  }>({
    profiles: [],
    hasMore: true,
    cursor: null,
    nextCursor: null
  })

  const { data } = useFollowingQuery({
    request: {
      address: address,
      cursor: params.cursor,
      limit: WHO_WAS_IT_PROFILES_LIMIT
    }
  })

  useEffect(() => {
    if (data?.following?.items) {
      setParams({
        ...params,
        // @ts-ignore
        profiles: data?.following?.items.length
          ? // eslint-disable-next-line
            [...params.profiles, ...data?.following?.items]
          : params.profiles,
        hasMore: Boolean(data?.following?.items?.length),
        nextCursor: data?.following?.pageInfo?.next
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
    <PopUpWrapper title={`Following (${totalFollowers})`}>
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
            return <WhoWasItProfileCard profile={profile.profile} key={idx} />
          })}
        </InfiniteScroll>
      </div>
    </PopUpWrapper>
  )
}

export default WhoIsFollowedByProfileId
