import React from 'react'
import { Profile, useMirrorsQuery } from '../../../graphql/generated'
import { WHO_WAS_IT_PROFILES_LIMIT } from '../../../utils/config'
import PopUpWrapper from '../../Common/PopUpWrapper'
import InfiniteScroll from 'react-infinite-scroll-component'
import MobileLoader from '../../Common/UI/MobileLoader'
import WhoWasItProfileCard from './WhoWasItProfileCard'

const WhoMirroredPublicatitonPopUp = ({
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

  const { data } = useMirrorsQuery({
    request: {
      whoMirroredPublicationId: publicationId,
      cursor: params.cursor,
      limit: WHO_WAS_IT_PROFILES_LIMIT
    }
  })

  React.useEffect(() => {
    if (data?.profiles?.items) {
      setParams({
        ...params,
        // @ts-ignore
        profiles: data?.profiles?.items.length
          ? // eslint-disable-next-line
            [...params.profiles, ...data?.profiles?.items]
          : params.profiles,
        hasMore: Boolean(data?.profiles?.items?.length),
        nextCursor: data?.profiles?.pageInfo?.next
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
    <PopUpWrapper title="Mirrored by">
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
            return <WhoWasItProfileCard profile={profile} key={idx} />
          })}
        </InfiniteScroll>
      </div>
    </PopUpWrapper>
  )
}

export default WhoMirroredPublicatitonPopUp