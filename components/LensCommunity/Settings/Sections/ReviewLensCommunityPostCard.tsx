import Link from 'next/link'
import React, { useEffect } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { putResolveLensCommunityPost } from '../../../../api/reviewLensCommunityPost'
import {
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation
} from '../../../../graphql/generated'
import { pollUntilIndexed } from '../../../../lib/indexer/has-transaction-been-indexed'
import { useLensUserContext } from '../../../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../../../lib/useSignTypedDataAndBroadcast'
// import { LensCommunity } from '../../../../types/community'
import { ReviewPostType } from '../../../../types/reviewPost'
import {
  lensCommunityPostsResolveActions,
  SUPPORTED_AUDIO_TYPE,
  SUPPORTED_IMAGE_TYPE,
  SUPPORTED_VIDEO_TYPE
} from '../../../../utils/config'
import { postIdFromIndexedResult } from '../../../../utils/utils'
import { useNotify } from '../../../Common/NotifyContext'
import ImageWithFullScreenZoom from '../../../Common/UI/ImageWithFullScreenZoom'
import ImageWithPulsingLoader from '../../../Common/UI/ImageWithPulsingLoader'
import LivePeerVideoPlayback from '../../../Common/UI/LivePeerVideoPlayback'
import VideoWithAutoPause from '../../../Common/UI/VideoWithAutoPause'
import Markup from '../../../Lexical/Markup'
// import AudioPlayer from '../../../Post/AudioPlayer'
import formatHandle from '../../../User/lib/formatHandle'
import getAvatar from '../../../User/lib/getAvatar'
import imageProxy from '../../../User/lib/imageProxy'
import { putAddLensPublication } from '../../../../api/lensPublication'

interface Props {
  fetchAndSetUnResolvedReviewPosts: () => Promise<void>
  post: ReviewPostType
}

const ReviewLensCommunityPostCard = ({
  fetchAndSetUnResolvedReviewPosts,
  post
}: Props) => {
  const { notifyError, notifySuccess } = useNotify()
  const { data: lensProfile } = useLensUserContext()
  const [loadingStatus, setLoadingStatus] = React.useState<
    'posting...' | 'indexing...' | 'confirming...' | null
  >(null)

  const { mutateAsync: createPostViaDispatcher } =
    useCreatePostViaDispatcherMutation()
  const { mutateAsync: createPostViaSignedTx } =
    useCreatePostTypedDataMutation()
  const {
    error,
    result,
    isSignedTx,
    type: signType,
    signTypedDataAndBroadcast
  } = useSignTypedDataAndBroadcast(true)

  const onRejectClick = async () => {
    try {
      const res = await putResolveLensCommunityPost(
        post._id,
        lensCommunityPostsResolveActions.IGNORE
      )
      if (res.status === 200) {
        await fetchAndSetUnResolvedReviewPosts()
      } else {
        const { msg } = await res.json()
        notifyError(msg)
      }
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong while rejecting the post request')
    }
  }

  const acceptedPost = async (publicationId: string) => {
    try {
      const res = await putResolveLensCommunityPost(
        post._id,
        lensCommunityPostsResolveActions.ALLOW,
        publicationId
      )
      await putAddLensPublication(post.lensCommunityId, publicationId)
      if (res.status === 200) {
        await fetchAndSetUnResolvedReviewPosts()
        notifySuccess('Post has been accepted')
      } else {
        const { msg } = await res.json()
        notifyError(msg)
      }
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong while accepting the post request')
    } finally {
      setLoadingStatus(null)
    }
  }

  const onAcceptClick = async () => {
    try {
      const createPostRequest = {
        profileId: lensProfile?.defaultProfile?.id,
        contentURI: post?.contentUri,
        collectModule: {
          freeCollectModule: {
            followerOnly: true
          }
        },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      }

      // dispatch or broadcast

      try {
        setLoadingStatus('posting...')
        if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
          //gasless using dispatcher
          const dispatcherResult = (
            await createPostViaDispatcher({
              request: createPostRequest
            })
          ).createPostViaDispatcher

          if (dispatcherResult.__typename === 'RelayError') {
            setLoadingStatus(null)
            notifyError(dispatcherResult.reason)
            return
          }

          setLoadingStatus('indexing...')
          const indexedResult = await pollUntilIndexed({
            txId: dispatcherResult.txId
          })
          const publicationId = postIdFromIndexedResult(
            lensProfile?.defaultProfile?.id,
            indexedResult
          )
          await acceptedPost(publicationId)
        } else {
          //gasless using signed broadcast
          const postTypedResult = (
            await createPostViaSignedTx({
              request: createPostRequest
            })
          ).createPostTypedData
          signTypedDataAndBroadcast(postTypedResult.typedData, {
            id: postTypedResult.id,
            type: 'createPost'
          })
        }
      } catch (e) {
        setLoadingStatus(null)
        console.log('error', e)
        notifyError('Error creating post, report to support')
        return
      }
    } catch (err) {
      notifyError('Something went wrong while accepting the post request')
    }
  }

  useEffect(() => {
    if (result && signType === 'createPost') {
      const publicationId = postIdFromIndexedResult(
        lensProfile?.defaultProfile?.id,
        result
      )
      acceptedPost(publicationId)
    }
  }, [result, signType])

  useEffect(() => {
    if (isSignedTx && signType === 'createPost') {
      setLoadingStatus('indexing...')
    }
  }, [isSignedTx, signType])

  useEffect(() => {
    if (error) {
      setLoadingStatus(null)
      notifyError(error)
    }
  }, [error])

  const contentAfterRemovingName = post?.contentData?.content
    ?.split('\n')
    .slice(2)
    .join('\n')

  // todo allow multiple media
  const type = post?.contentData?.media?.[0]?.type
  const url = post?.contentData?.media?.[0]?.item
  const coverUrl = imageProxy(post?.contentData?.image)

  return (
    <div className="p-2 sm:p-4 border-b border-s-border">
      {/* author profile and name row */}
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row items-center space-x-2">
          <ImageWithPulsingLoader
            src={getAvatar(post?.authorProfile)}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <div className="text-p-text font-medium">
              {post?.authorProfile?.name}
            </div>
            <Link href={`/u/${formatHandle(post?.authorProfile?.handle)}`}>
              <div className="text-xs text-s-text hover:underline cursor-pointer">
                u/{formatHandle(post?.authorProfile?.handle)}
              </div>
            </Link>
          </div>
        </div>
        <div className="text-s-text text-sm">
          <ReactTimeAgo
            timeStyle="twitter"
            date={new Date(post?.createdAt)}
            locale="en-US"
          />
        </div>
      </div>

      {/* post title */}
      <div className="text-p-text font-semibold text-lg mt-2">
        {post?.contentData?.name}
      </div>
      {/* post content */}
      <div className="text-sm">
        <Markup>{contentAfterRemovingName}</Markup>{' '}
      </div>
      {/* image or video or audio it any media */}
      {post?.contentData?.media?.length > 0 && (
        <>
          {type === 'image/svg+xml' ? (
            <button onClick={() => window.open(url, '_blank')}>
              Open Image in new tab
            </button>
          ) : SUPPORTED_VIDEO_TYPE.includes(type) ? (
            url.startsWith('https://firebasestorage.googleapis.com') ? (
              <VideoWithAutoPause
                src={imageProxy(url)}
                className={`image-unselectable object-contain sm:rounded-lg w-full `}
                controls
                muted
                autoPlay={false}
                poster={coverUrl}
              />
            ) : (
              <div
                className={`image-unselectable object-contain sm:rounded-lg w-full overflow-hidden  flex items-center`}
              >
                <LivePeerVideoPlayback
                  posterUrl={coverUrl}
                  // title={stringToLength(publication?.metadata?.content, 30)}
                  url={url}
                />
              </div>
            )
          ) : SUPPORTED_AUDIO_TYPE.includes(type) ? (
            // todo add audio player according to data desing
            // <AudioPlayer src={url} coverImage={coverUrl} />
            <></>
          ) : SUPPORTED_IMAGE_TYPE.includes(type) ? (
            <ImageWithFullScreenZoom
              src={imageProxy(url)}
              className={`image-unselectable object-cover sm:rounded-lg w-full `}
            />
          ) : (
            <></>
          )}
        </>
      )}

      {/* post actions */}
      <div className="flex flex-row items-center space-x-4 py-2">
        <button
          onClick={onRejectClick}
          className="text-p-text border-2 border-red-500 font-medium rounded-xl px-3 py-1"
        >
          Reject
        </button>
        <button
          onClick={onAcceptClick}
          disabled={loadingStatus !== null}
          className="bg-p-btn text-p-btn-text font-medium rounded-xl px-3 py-1"
        >
          {loadingStatus ? (
            <div className="flex flex-row items-center space-x-2">
              <div className="animate-spin text-p-btn-text" />{' '}
              <div>{loadingStatus}</div>{' '}
            </div>
          ) : (
            'Accept'
          )}
        </button>
      </div>
    </div>
  )
}

export default ReviewLensCommunityPostCard
