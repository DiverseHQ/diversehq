import React, { memo, useCallback, useEffect } from 'react'
import { postGetCommunityInfoUsingListOfIds } from '../../../apiHelper/community'
import getSinglePublicationInfo from '../../../lib/post/get-single-publication-info'
import { postWithCommunityInfoType } from '../../../types/post'
import LensPostCard from '../LensPostCard'

const LensPostCardFromPublicationId = ({
  publicationId,
  publication
}: {
  publicationId: string
  publication?: postWithCommunityInfoType
}) => {
  const [post, setPost] = React.useState<postWithCommunityInfoType>(null)

  const getPost = useCallback(async () => {
    if (!publicationId || post) return
    try {
      const { publication } = await getSinglePublicationInfo({
        request: {
          forId: publicationId
        }
      })
      if (publication?.__typename === 'Post') {
        // @ts-ignore
        const communityId = publication.metadata?.tags?.[0]
        const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds([
          communityId
        ])

        const communityInfoForPost = communityInfoForPosts[0]

        if (communityInfoForPost) {
          // if (
          //   !communityInfoForPost ||
          //   !communityInfoForPost._id ||
          //   publication.appId !== appId
          // ) {
          //   // @ts-ignore
          //   publication.communityInfo = getCommunityInfoFromAppId(
          //     publication.appId
          //   )
          // } else {
          // @ts-ignore
          publication.communityInfo = communityInfoForPost
          if (communityInfoForPost?.handle) {
            // @ts-ignore
            publication.isLensCommunityPost = true
          }
        }

        // @ts-ignore
        setPost(publication)
      } else {
        // @ts-ignore
        setPost(publication)
      }
    } catch (error) {
      console.log(error)
    }
  }, [publicationId])

  useEffect(() => {
    if (publication) {
      setPost(publication)
      return
    }
    if (!publicationId) return
    getPost()
  }, [publicationId])

  if (!publicationId && !publication) return null

  return <>{post && <LensPostCard post={post} isAlone />}</>
}

export default memo(LensPostCardFromPublicationId)
