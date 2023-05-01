import React from 'react'
import {
  Publication,
  SearchRequestTypes,
  useSearchProfilesQuery,
  useSearchPublicationsQuery
} from '../../../graphql/generated'
import { SEARCH_ITEMS_LIMIT } from '../../../utils/config'
import InfiniteScroll from 'react-infinite-scroll-component'
import MobileLoader from '../../Common/UI/MobileLoader'
import LensPostCard from '../../Post/LensPostCard'
import { useLensUserContext } from '../../../lib/LensUserContext'

const PublicationSearchColumn = ({ q }: { q: string }) => {
  const [params, setParams] = React.useState<{
    q: string
    cursor: string | null
    nextCursor: string | null
    result: Publication[]
    hasMore: boolean
  }>({
    q: q,
    cursor: null,
    nextCursor: null,
    result: [],
    hasMore: true
  })
  const { data: defaultProfile } = useLensUserContext()
  const searchPublicationQuery = useSearchPublicationsQuery(
    {
      request: {
        query: params.q,
        type: SearchRequestTypes.Publication,
        limit: SEARCH_ITEMS_LIMIT,
        cursor: params.cursor
      },
      profileId: defaultProfile?.defaultProfile?.id ?? null,
      reactionRequest: {
        profileId: defaultProfile?.defaultProfile?.id ?? null
      }
    },
    {
      enabled: q.length > 0
    }
  )

  React.useEffect(() => {
    if (
      searchPublicationQuery?.data?.search?.__typename ===
      'PublicationSearchResult'
    ) {
      const newResults = searchPublicationQuery?.data?.search?.items

      console.log('newResults', newResults)
      console.log(
        'searchPublicationQuery?.data?.search',
        searchPublicationQuery?.data?.search
      )

      console.log(
        'searchPublicationQuery?.data?.search?.pageInfo',
        searchPublicationQuery?.data?.search?.pageInfo
      )

      //@ts-ignore
      setParams({
        ...params,
        nextCursor:
          newResults?.length > 0 &&
          searchPublicationQuery?.data?.search?.pageInfo?.next
            ? searchPublicationQuery?.data?.search?.pageInfo?.next
            : params.nextCursor,
        // @ts-ignore
        result:
          newResults.length > 0
            ? // @ts-ignore
              [...params.result, ...newResults]
            : params.result,
        hasMore:
          searchPublicationQuery?.data?.search?.items.length <
          SEARCH_ITEMS_LIMIT
            ? false
            : true
      })
    }
    // @ts-ignore
  }, [searchPublicationQuery?.data?.search?.items])

  React.useEffect(() => {
    if (q === params.q) return
    setParams({
      ...params,
      q: q,
      cursor: null,
      nextCursor: null,
      result: []
    })
  }, [q])

  const getMore = () => {
    console.log('getMore')
    if (params?.nextCursor) {
      setParams({
        ...params,
        cursor: params.nextCursor
      })
    }
  }

  console.log('params?.result', params?.result)

  return (
    <div>
      <InfiniteScroll
        dataLength={params?.result?.length || 0}
        next={getMore}
        hasMore={params.hasMore}
        loader={<MobileLoader />}
        endMessage={<></>}
      >
        {params?.result?.map((item) => {
          // @ts-ignore
          return <LensPostCard post={item} key={item.id} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default PublicationSearchColumn
