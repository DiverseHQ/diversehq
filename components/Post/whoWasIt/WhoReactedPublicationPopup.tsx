import React, { useEffect, useState } from 'react'
import PopUpWrapper from '../../Common/PopUpWrapper'
import {
  WhoReactedResult,
  useWhoReactedPublicationQuery
} from '../../../graphql/generated'
import InfiniteScroll from 'react-infinite-scroll-component'
import MobileLoader from '../../Common/UI/MobileLoader'
import { WHO_WAS_IT_PROFILES_LIMIT } from '../../../utils/config'
import WhoWasItProfileCard from './WhoWasItProfileCard'

const WhoReactedPublicationPopup = ({
  publicationId
}: {
  publicationId: string
}) => {
  const [params, setParams] = useState<{
    profiles: WhoReactedResult[]
    hasMore: boolean
    cursor: string | null
    nextCursor: string | null
  }>({
    profiles: [],
    hasMore: true,
    cursor: null,
    nextCursor: null
  })

  const { data } = useWhoReactedPublicationQuery({
    request: {
      publicationId: publicationId,
      cursor: params.cursor,
      limit: WHO_WAS_IT_PROFILES_LIMIT
    }
  })

  useEffect(() => {
    if (data?.whoReactedPublication?.items) {
      setParams({
        ...params,
        // @ts-ignore
        profiles: data?.whoReactedPublication?.items.length
          ? // eslint-disable-next-line
            [...params.profiles, ...data?.whoReactedPublication?.items]
          : params.profiles,
        hasMore: Boolean(data?.whoReactedPublication?.items?.length),
        nextCursor: data?.whoReactedPublication?.pageInfo?.next
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
    <PopUpWrapper title="Upvoted by">
      <div
        className="h-full sm:h-[700px] overflow-y-auto"
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

export default WhoReactedPublicationPopup