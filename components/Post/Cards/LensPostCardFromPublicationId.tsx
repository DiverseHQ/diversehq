import React, { useEffect, memo, useCallback } from 'react'
import { postGetCommunityInfoUsingListOfIds } from '../../../apiHelper/community'
import getSinglePublicationInfo from '../../../lib/post/get-single-publication-info'
import { postWithCommunityInfoType } from '../../../types/post'
// import { appId } from '../../../utils/config'
// import { getCommunityInfoFromAppId } from '../../../utils/helper'
import LensPostCard from '../LensPostCard'
import { useLensUserContext } from '../../../lib/LensUserContext'

const LensPostCardFromPublicationId = ({
  publicationId
}: {
  publicationId: string
}) => {
  const [post, setPost] = React.useState<postWithCommunityInfoType>(null)
  const { data } = useLensUserContext()

  const getPost = useCallback(async () => {
    if (!publicationId || post) return
    try {
      const { publication } = await getSinglePublicationInfo({
        request: {
          publicationId: publicationId
        },
        profileId: data?.defaultProfile?.id ?? null,
        reactionRequest: {
          profileId: data?.defaultProfile?.id ?? null
        }
      })

      if (publication?.__typename === 'Post') {
        const communityId = publication.metadata.tags[0]
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
      }
    } catch (error) {
      console.log(error)
    }
  }, [publicationId])

  useEffect(() => {
    if (!publicationId) return
    getPost()
  }, [publicationId])

  if (!publicationId) return null

  return <>{post && <LensPostCard post={post} isAlone />}</>
}

export default memo(LensPostCardFromPublicationId)
