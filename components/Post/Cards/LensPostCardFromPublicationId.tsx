import React, { useEffect } from 'react'
import { postGetCommunityInfoUsingListOfIds } from '../../../api/community'
import getSinglePublicationInfo from '../../../lib/post/get-single-publication-info'
import { postWithCommunityInfoType } from '../../../types/post'
import { appId } from '../../../utils/config'
import { getCommunityInfoFromAppId } from '../../../utils/helper'
import LensPostCard from '../LensPostCard'

const LensPostCardFromPublicationId = ({
  publicationId
}: {
  publicationId: string
}) => {
  const [post, setPost] = React.useState<postWithCommunityInfoType>(null)
  const [isLoading, setLoading] = React.useState(true)

  const getPost = async () => {
    try {
      setLoading(true)
      const { publication } = await getSinglePublicationInfo({
        publicationId: publicationId
      })

      if (publication?.__typename === 'Post') {
        const communityId = publication.metadata.tags[0]
        const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds([
          communityId
        ])

        const communityInfoForPost = communityInfoForPosts[0]

        if (
          !communityInfoForPost ||
          !communityInfoForPost._id ||
          publication.appId !== appId
        ) {
          // @ts-ignore
          publication.communityInfo = getCommunityInfoFromAppId(
            publication.appId
          )
        } else {
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!publicationId) return
    getPost()
  }, [publicationId])

  if (!publicationId) return null

  return (
    <>
      {isLoading && !post && (
        <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-s-bg dark:bg-s-bg my-3 sm:my-6">
          <div className="w-full flex flex-row items-center space-x-4 p-2 px-4 animate-pulse">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full " />
            <div className="h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
            <div className="h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
          </div>
          <div className="w-full flex flex-row items-center space-x-4 sm:p-4 sm:py-2 py-1 pr-4 my-1 animate-pulse">
            <div className="w-6 sm:w-[50px] h-4" />
            <div className="w-full rounded-xl bg-gray-300 dark:bg-p-bg h-[20px] sm:h-[20px]" />
          </div>
          <div className="w-full flex flex-row items-center space-x-4 sm:p-4 sm:pb-2 pr-4 animate-pulse">
            <div className="w-6 sm:w-[50px] h-4" />
            <div className="w-full rounded-2xl bg-gray-300 dark:bg-p-bg h-[200px] sm:h-[300px]" />
          </div>
        </div>
      )}

      {!isLoading && post && <LensPostCard post={post} />}
    </>
  )
}

export default LensPostCardFromPublicationId
