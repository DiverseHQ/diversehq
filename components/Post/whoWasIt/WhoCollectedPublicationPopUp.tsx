import React from 'react'
import {
  LimitType,
  Profile,
  useWhoActedOnPublicationQuery
} from '../../../graphql/generated'
import PopUpWrapper from '../../Common/PopUpWrapper'
import InfiniteScroll from 'react-infinite-scroll-component'
import MobileLoader from '../../Common/UI/MobileLoader'
import WhoWasItProfileCard from './WhoWasItProfileCard'
import { useProfileStore } from '../../../store/profile'

const WhoCollectedPublicationPopUp = ({
  publicationId
}: {
  publicationId: string
}) => {
  const [params, setParams] = React.useState<{
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

  const { data } = useWhoActedOnPublicationQuery({
    request: {
      on: publicationId,
      cursor: params.cursor,
      limit: LimitType.Fifty
    }
  })

  React.useEffect(() => {
    if (data?.whoActedOnPublication?.items) {
      setParams({
        ...params,
        // @ts-ignore
        profiles: data?.whoActedOnPublication?.items.length
          ? // eslint-disable-next-line
            [...params.profiles, ...data?.whoActedOnPublication?.items]
          : params.profiles,
        hasMore: Boolean(data?.whoActedOnPublication?.items?.length),
        nextCursor: data?.whoActedOnPublication?.pageInfo?.next
      })

      const newProfiles = new Map()
      // eslint-disable-next-line
      for (const profile of data?.whoActedOnPublication?.items) {
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
    <PopUpWrapper title="Collected by">
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

export default WhoCollectedPublicationPopUp
