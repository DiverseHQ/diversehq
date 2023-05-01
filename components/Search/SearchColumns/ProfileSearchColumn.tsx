import React from 'react'
import {
  Profile,
  SearchRequestTypes,
  useSearchProfilesQuery
} from '../../../graphql/generated'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SEARCH_ITEMS_LIMIT } from '../../../utils/config'
import MobileLoader from '../../Common/UI/MobileLoader'
import ProfileSearchResult from './ProfileSearchResult'
// import { NextRequest } from 'next/server'

const ProfileSearchColumn = ({ q }: { q: string }) => {
  const [params, setParams] = React.useState<{
    q: string
    cursor: string | null
    nextCursor: string | null
    result: Profile[]
    hasMore: boolean
  }>({
    q: q,
    cursor: null,
    nextCursor: null,
    result: [],
    hasMore: true
  })
  const searchProfileQuery = useSearchProfilesQuery(
    {
      request: {
        query: params.q,
        type: SearchRequestTypes.Profile,
        limit: SEARCH_ITEMS_LIMIT,
        cursor: params.cursor
      }
    },
    {
      enabled: q.length > 0
    }
  )

  React.useEffect(() => {
    setParams({
      ...params,
      q: q,
      cursor: null,
      nextCursor: null,
      result: []
    })
  }, [q])

  React.useEffect(() => {
    if (
      searchProfileQuery?.data?.search?.__typename === 'ProfileSearchResult'
    ) {
      const newResults = searchProfileQuery?.data?.search?.items

      //@ts-ignore
      setParams({
        ...params,
        nextCursor:
          newResults?.length > 0 &&
          searchProfileQuery?.data?.search?.pageInfo?.next
            ? searchProfileQuery?.data?.search?.pageInfo?.next
            : params.nextCursor,
        // @ts-ignore
        result:
          newResults.length > 0
            ? // @ts-ignore
              [...params.result, ...newResults]
            : params.result,
        hasMore:
          searchProfileQuery?.data?.search?.items.length < SEARCH_ITEMS_LIMIT
            ? false
            : true
      })
    }
    // @ts-ignore
  }, [searchProfileQuery?.data?.search?.items])

  const getMore = () => {
    if (params?.nextCursor) {
      setParams({
        ...params,
        cursor: params.nextCursor
      })
    }
  }

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
          return <ProfileSearchResult profile={item} key={item.id} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default ProfileSearchColumn
