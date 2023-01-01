import React, { useEffect, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Link from 'next/link'
import {
  ReactionTypes,
  useAddReactionMutation
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { useNotify } from '../../Common/NotifyContext'
TimeAgo.addDefaultLocale(en)
const LensCommentCard = ({ comment }) => {
  const { notifyInfo } = useNotify()
  const [reaction, setReaction] = useState(comment?.reaction)
  const [upvoteCount, setUpvoteCount] = useState(comment?.stats?.totalUpvotes)
  const [downvoteCount, setDownvoteCount] = useState(
    comment?.stats.totalDownvotes
  )
  const [voteCount, setVoteCount] = useState(
    comment?.stats?.totalUpvotes - comment?.stats?.totalDownvotes
  )
  const { mutateAsync: addReaction } = useAddReactionMutation()
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()

  useEffect(() => {
    setVoteCount(upvoteCount - downvoteCount)
  }, [upvoteCount, downvoteCount])

  const handleUpvote = async () => {
    if (reaction === ReactionTypes.Upvote) return
    try {
      if (!isSignedIn || !hasProfile) {
        notifyInfo('How about loging in lens, first?')
        return
      }

      setReaction(ReactionTypes.Upvote)
      if (reaction === ReactionTypes.Downvote) {
        setDownvoteCount(downvoteCount - 1)
        setUpvoteCount(upvoteCount + 1)
      } else {
        setUpvoteCount(upvoteCount + 1)
      }
      await addReaction({
        request: {
          profileId: lensProfile.defaultProfile.id,
          publicationId: comment.id,
          reaction: ReactionTypes.Upvote
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDownvote = async () => {
    if (reaction === ReactionTypes.Downvote) return
    try {
      if (!isSignedIn || !hasProfile) {
        notifyInfo('How about loging in lens, first?')
        return
      }
      setReaction(ReactionTypes.Downvote)
      if (reaction === ReactionTypes.Upvote) {
        setUpvoteCount(upvoteCount - 1)
        setDownvoteCount(downvoteCount + 1)
      } else {
        setDownvoteCount(downvoteCount + 1)
      }
      await addReaction({
        request: {
          profileId: lensProfile.defaultProfile.id,
          publicationId: comment.id,
          reaction: ReactionTypes.Downvote
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      {comment && (
        <div className="px-3 sm:px-5 w-full bg-s-bg my-6 sm:rounded-3xl py-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <img
                src={
                  //   !comment?.profile?.original?.url.startsWith(
                  //     'https://pbs.twimg.com'
                  //   )
                  //     ? comment?.profile?.original?.url
                  //     : '/gradient.jpg'
                  !comment?.profile?.picture?.original?.url.startsWith(
                    'https://pbs.twimg.com'
                  )
                    ? comment?.profile?.picture?.original?.url
                    : '/gradient.jpg'
                }
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2"
              />
              <Link href={`/u/${comment?.profile?.handle}`}>
                <div className="hover:underline ml-2 font-bold text-xs sm:text-xl">
                  u/{comment?.profile?.handle}
                </div>
              </Link>
            </div>
            <div className="flex flex-row items-center">
              <div className="text-xs sm:text-base">
                <ReactTimeAgo
                  date={new Date(comment.createdAt)}
                  locale="en-US"
                />
              </div>
            </div>
          </div>

          <div className="pl-12">
            <div className="mt-3">{comment?.metadata?.content}</div>

            <div className="flex flex-row items-center gap-x-2 pt-2">
              {/* upvote and downvote */}
              <img
                //  onClick={liked ? handleUnLike : handleLike}
                src={
                  reaction === ReactionTypes.Upvote
                    ? '/UpvoteFilled.svg'
                    : '/Upvote.svg'
                }
                onClick={handleUpvote}
                className="w-5 h-5 cursor-pointer"
              />
              <div className="font-bold">{voteCount}</div>
              <img
                src={
                  reaction === ReactionTypes.Downvote
                    ? '/DownvoteFilled.svg'
                    : '/Downvote.svg'
                }
                className="w-5 h-5 cursor-pointer"
                onClick={handleDownvote}
              />
            </div>
          </div>
        </div>
      )}
      {!comment && <></>}
    </>
  )
}

export default LensCommentCard
