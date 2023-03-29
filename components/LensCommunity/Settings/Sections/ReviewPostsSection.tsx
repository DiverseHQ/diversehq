import clsx from 'clsx'
import React, { useEffect } from 'react'
import { getAllUnResolvedLensCommunityPostsForReview } from '../../../../api/reviewLensCommunityPost'
import getProfiles from '../../../../lib/profile/get-profiles'
import { LensCommunity } from '../../../../types/community'
import { ReviewPostType } from '../../../../types/reviewPost'
import { useNotify } from '../../../Common/NotifyContext'
import { getAllMentionsHandlFromContent } from '../../../Post/PostPageMentionsColumn'
import getIPFSLink from '../../../User/lib/getIPFSLink'
import ReviewLensCommunityPostCard from './ReviewLensCommunityPostCard'

const ReviewPostsSection = ({ community }: { community: LensCommunity }) => {
  const [rawReviewPosts, setRawReviewPosts] = React.useState<ReviewPostType[]>(
    []
  )
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { notifyError } = useNotify()

  const fetchAndSetUnResolvedReviewPosts = async () => {
    if (!community || !community?._id) return
    try {
      setIsLoading(true)
      const res = await getAllUnResolvedLensCommunityPostsForReview(
        community._id
      )
      if (res.status === 200) {
        const resData: ReviewPostType[] = await res.json()

        if (!resData.length) return
        // loops over the posts and fetch the post data from post.contentUri
        const _rawPosts = await Promise.all(
          resData.map(async (post) => {
            const postRes = await fetch(getIPFSLink(post.contentUri)).then(
              (res) => res.json()
            )
            post.contentData = postRes
            return post
          })
        )

        // fetching the author profile data
        const { profiles } = await getProfiles({
          handles: resData.map(
            (post) =>
              getAllMentionsHandlFromContent(post.contentData?.content)[0]
          )
        })
        _rawPosts.forEach((post) => {
          //@ts-ignore
          post.authorProfile = profiles.items.find(
            (profile) =>
              profile.handle ===
              getAllMentionsHandlFromContent(post.contentData?.content)[0]
          )
        })
        setRawReviewPosts(_rawPosts)
      } else {
        const resData = await res.json()
        notifyError(resData.msg)
      }
    } catch (err) {
      notifyError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAndSetUnResolvedReviewPosts()
  }, [])

  return (
    <div className="p-2 w-full sm:p-3 space-y-2 min-h-[500px]">
      <div className="font-medium leading-3">Review Submitted Posts</div>
      <div className="text-xs text-s-text leading-4">
        Allow : Approve the post and make it visible to the community through
        your lens handle <br />
        Reject : Author will be notified that the post has been rejected
      </div>
      {isLoading && (
        <div className="flex flex-row items-center justify-center space-x-2">
          <div className="w-4 h-4 border-t-2 border-p-btn rounded-full animate-spin" />
          <div className="text-sm text-s-text">Loading...</div>
        </div>
      )}
      <div
        className={clsx(
          'sm:rounded-2xl bg-s-bg border-s-border overflow-hidden',
          rawReviewPosts.length > 0 && 'sm:border-[1px]'
        )}
      >
        {rawReviewPosts.length > 0 &&
          rawReviewPosts.map((post) => (
            <ReviewLensCommunityPostCard
              key={post._id}
              fetchAndSetUnResolvedReviewPosts={
                fetchAndSetUnResolvedReviewPosts
              }
              post={post}
            />
          ))}
      </div>
    </div>
  )
}

export default ReviewPostsSection
