import React, { useEffect, useState } from 'react'
import PopUpWrapper from '../../Common/PopUpWrapper'
import {
  LimitType,
  Profile,
  useFollowingQuery
} from '../../../graphql/generated'
import InfiniteScroll from 'react-infinite-scroll-component'
import MobileLoader from '../../Common/UI/MobileLoader'
import WhoWasItProfileCard from './WhoWasItProfileCard'
import { useProfileStore } from '../../../store/profile'

const WhoIsFollowedByProfileId = ({
  address,
  totalFollowers
}: {
  address: string
  totalFollowers: number
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

  const { data } = useFollowingQuery({
    request: {
      cursor: params.cursor,
      limit: LimitType.Fifty,
      for: address
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

      const newProfiles = new Map()
      // eslint-disable-next-line
      for (const profile of data?.following?.items) {
        newProfiles.set(profile.handle?.fullHandle, profile)
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
            return <WhoWasItProfileCard profile={profile} key={idx} />
          })}
        </InfiniteScroll>
      </div>
    </PopUpWrapper>
  )
}

export default WhoIsFollowedByProfileId
