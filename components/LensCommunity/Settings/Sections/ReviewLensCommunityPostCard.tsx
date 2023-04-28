import Link from 'next/link'
import React, { useEffect } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { putResolveLensCommunityPost } from '../../../../api/reviewLensCommunityPost'
import {
  useCreateDataAvailabilityPostTypedDataMutation,
  useCreateDataAvailabilityPostViaDispatcherMutation
  // useCreatePostTypedDataMutation,
  // useCreatePostViaDispatcherMutation
} from '../../../../graphql/generated'
// import { pollUntilIndexed } from '../../../../lib/indexer/has-transaction-been-indexed'
import { useLensUserContext } from '../../../../lib/LensUserContext'
// import useSignTypedDataAndBroadcast from '../../../../lib/useSignTypedDataAndBroadcast'
// import { LensCommunity } from '../../../../types/community'
import { ReviewPostType } from '../../../../types/reviewPost'
import { lensCommunityPostsResolveActions } from '../../../../utils/config'
// import { postIdFromIndexedResult } from '../../../../utils/utils'
import { useNotify } from '../../../Common/NotifyContext'
import ImageWithPulsingLoader from '../../../Common/UI/ImageWithPulsingLoader'
import Markup from '../../../Lexical/Markup'
// import AudioPlayer from '../../../Post/AudioPlayer'
import formatHandle from '../../../User/lib/formatHandle'
import getAvatar from '../../../User/lib/getAvatar'
import { putAddLensPublication } from '../../../../api/lensPublication'
import Attachment from '../../../Post/Attachment'
import useDASignTypedDataAndBroadcast from '../../../../lib/useDASignTypedDataAndBroadcast'

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

  // const { mutateAsync: createPostViaDispatcher } =
  //   useCreatePostViaDispatcherMutation()
  // const { mutateAsync: createPostViaSignedTx } =
  //   useCreatePostTypedDataMutation()
  const { mutateAsync: createDAPostViaDispatcher } =
    useCreateDataAvailabilityPostViaDispatcherMutation()
  const { mutateAsync: createDAPostTypedData } =
    useCreateDataAvailabilityPostTypedDataMutation()
  const {
    error: daError,
    result: daResult,
    type: daType,
    signDATypedDataAndBroadcast
  } = useDASignTypedDataAndBroadcast()
  // const {
  //   error,
  //   result,
  //   isSignedTx,
  //   type: signType,
  //   signTypedDataAndBroadcast
  // } = useSignTypedDataAndBroadcast(true)

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
        notifySuccess('Post has been Published')
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
      try {
        setLoadingStatus('posting...')
        // create post with data availability

        if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
          const dispatcherResult = (
            await createDAPostViaDispatcher({
              request: {
                contentURI: post?.contentUri,
                from: lensProfile?.defaultProfile?.id
              }
            })
          ).createDataAvailabilityPostViaDispatcher

          if (
            dispatcherResult.__typename === 'RelayError' ||
            !dispatcherResult.id
          ) {
            setLoadingStatus(null)
            // @ts-ignore
            notifyError(dispatcherResult?.reason || 'Something went wrong')
            return
          } else {
            await acceptedPost(dispatcherResult.id)
          }
        } else {
          const typedData = (
            await createDAPostTypedData({
              request: {
                contentURI: post?.contentUri,
                from: lensProfile?.defaultProfile?.id
              }
            })
          ).createDataAvailabilityPostTypedData

          signDATypedDataAndBroadcast(typedData.typedData, {
            id: typedData.id,
            type: 'createDAPost'
          })
        }

        // const createPostRequest = {
        //   profileId: lensProfile?.defaultProfile?.id,
        //   contentURI: post?.contentUri,
        //   collectModule: {
        //     freeCollectModule: {
        //       followerOnly: true
        //     }
        //   },
        //   referenceModule: {
        //     followerOnlyReferenceModule: false
        //   }
        // }
        // dispatch or broadcast
        //
        //   setLoadingStatus('posting...')
        //   if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
        //     //gasless using dispatcher
        //     const dispatcherResult = (
        //       await createPostViaDispatcher({
        //         request: createPostRequest
        //       })
        //     ).createPostViaDispatcher
        //     if (dispatcherResult.__typename === 'RelayError') {
        //       setLoadingStatus(null)
        //       notifyError(dispatcherResult.reason)
        //       return
        //     }
        //     setLoadingStatus('indexing...')
        //     const indexedResult = await pollUntilIndexed({
        //       txId: dispatcherResult.txId
        //     })
        //     const publicationId = postIdFromIndexedResult(
        //       lensProfile?.defaultProfile?.id,
        //       indexedResult
        //     )
        //     await acceptedPost(publicationId)
        //   } else {
        //     //gasless using signed broadcast
        //     const postTypedResult = (
        //       await createPostViaSignedTx({
        //         request: createPostRequest
        //       })
        //     ).createPostTypedData
        //     signTypedDataAndBroadcast(postTypedResult.typedData, {
        //       id: postTypedResult.id,
        //       type: 'createPost'
        //     })
        //   }
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

  // useEffect(() => {
  //   if (result && signType === 'createPost') {
  //     const publicationId = postIdFromIndexedResult(
  //       lensProfile?.defaultProfile?.id,
  //       result
  //     )
  //     acceptedPost(publicationId)
  //   }
  // }, [result, signType])

  // useEffect(() => {
  //   if (isSignedTx && signType === 'createPost') {
  //     setLoadingStatus('indexing...')
  //   }
  // }, [isSignedTx, signType])

  // useEffect(() => {
  //   if (error) {
  //     setLoadingStatus(null)
  //     notifyError(error)
  //   }
  // }, [error])

  useEffect(() => {
    if (daResult && daType === 'createDAPost') {
      acceptedPost(daResult.id)
    }
  }, [daResult, daType])

  useEffect(() => {
    if (daError) {
      setLoadingStatus(null)
      notifyError(daError)
    }
  }, [daError])

  const contentAfterRemovingName = post?.contentData?.content
    ?.split('\n')
    .slice(2)
    .join('\n')

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

      <Attachment
        publication={post?.contentData}
        attachments={post?.contentData?.media}
        isNew
        hideDelete
      />

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
              <div className="spinner border-p-btn-text" />{' '}
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
