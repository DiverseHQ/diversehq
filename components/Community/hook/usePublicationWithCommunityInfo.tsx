import React from 'react'
import { postGetCommunityInfoUsingListOfIds } from '../../../apiHelper/community'
import {
  PublicationsQueryRequest,
  ReactionFieldResolverRequest,
  usePublicationsQuery
} from '../../../graphql/generated'
import { postWithCommunityInfoType } from '../../../types/post'

interface Props {
  request: PublicationsQueryRequest
  reactionRequest: ReactionFieldResolverRequest
  profileId: string
  enabled?: boolean
}

const usePublicationWithCommunityInfo = ({
  request,
  reactionRequest,
  profileId,
  enabled = true
}: Props): {
  publications: postWithCommunityInfoType[]
  isLoading: boolean
} => {
  const [publications, setPublications] = React.useState<
    postWithCommunityInfoType[]
  >([])
  const { data, isLoading } = usePublicationsQuery(
    { request, reactionRequest, profileId },
    {
      enabled: !!request && enabled
    }
  )

  const setNewPosts = async (posts: postWithCommunityInfoType[]) => {
    // @ts-ignore
    const communityIds = posts.map((post) => post.metadata?.tags?.[0])
    const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
      communityIds
    )
    for (let i = 0; i < posts.length; i++) {
      if (communityInfoForPosts[i]?._id) {
        posts[i].communityInfo = communityInfoForPosts[i]
        if (communityInfoForPosts[i]?.handle) {
          posts[i].isLensCommunityPost = true
        }
      }
    }
    setPublications(posts)
  }

  React.useEffect(() => {
    if (data?.publications?.items?.length > 0) {
      // @ts-ignore
      setNewPosts(data?.publications?.items)
    }
  }, [data?.publications?.items])
  return { publications, isLoading }
}

export default usePublicationWithCommunityInfo
