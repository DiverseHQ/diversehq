import React from 'react'
import { Profile, useProfilesQuery } from '../../../graphql/generated'
import PopUpWrapper from '../../Common/PopUpWrapper'
import { WHO_WAS_IT_PROFILES_LIMIT } from '../../../utils/config'
import InfiniteScroll from 'react-infinite-scroll-component'
import MobileLoader from '../../Common/UI/MobileLoader'
import WhoWasItProfileCard from './WhoWasItProfileCard'
import { getCommunityMembers } from '../../../apiHelper/community'

const WhoIsMemeberOfCommunity = ({
  communityId,
  totalMembers
}: {
  communityId: string
  totalMembers: number
}) => {
  const [allMembersAddressList, setAllMembersAddressList] = React.useState<
    string[]
  >([])
  const [params, setParams] = React.useState<{
    profiles: Profile[]
    hasMore: boolean
    currentProfileAddress: string[]
  }>({
    profiles: [],
    hasMore: true,
    currentProfileAddress: []
  })

  const { data } = useProfilesQuery(
    {
      request: {
        ownedBy: params.currentProfileAddress
      }
    },
    {
      enabled:
        allMembersAddressList.length > 0 &&
        params.currentProfileAddress?.length > 0
    }
  )

  const getMembersAddressOfCommunity = async () => {
    try {
      const res = await getCommunityMembers(communityId)
      if (res.status !== 200) {
        throw new Error('Error while fetching members of community')
      }
      const { members } = await res.json()

      setAllMembersAddressList(members)
      setParams({
        ...params,
        currentProfileAddress: members.slice(0, WHO_WAS_IT_PROFILES_LIMIT)
      })
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getMembersAddressOfCommunity()
  }, [communityId])

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
    console.log('getMore')
    // find the index of last profile address from currentProfileAddress on list of allMembersAddressList
    const lastProfileAddressIndex = allMembersAddressList.findIndex(
      (address) => address === params.currentProfileAddress.slice(-1)[0]
    )
    // slice the allMembersAddressList from lastProfileAddressIndex + 1 to lastProfileAddressIndex + 1 + WHO_WAS_IT_PROFILES_LIMIT
    const nextProfileAddress = allMembersAddressList.slice(
      lastProfileAddressIndex + 1,
      lastProfileAddressIndex + 1 + WHO_WAS_IT_PROFILES_LIMIT
    )
    if (nextProfileAddress.length === 0) {
      setParams({
        ...params,
        hasMore: false
      })
      return
    }
    setParams({
      ...params,
      currentProfileAddress: nextProfileAddress
    })
  }

  return (
    <PopUpWrapper title={`Members (${totalMembers})`}>
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

export default WhoIsMemeberOfCommunity
