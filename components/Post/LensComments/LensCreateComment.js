import { uuidv4 } from '@firebase/util'
import React, { useEffect, useRef, useState } from 'react'
import {
  PublicationMainFocus,
  ReactionTypes,
  useAddReactionMutation,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation
} from '../../../graphql/generated'
import { pollUntilIndexed } from '../../../lib/indexer/has-transaction-been-indexed'
import { useLensUserContext } from '../../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../../lib/useSignTypedDataAndBroadcast'
import {
  commentIdFromIndexedResult,
  uploadToIpfsInfuraAndGetPath
} from '../../../utils/utils'
import { useNotify } from '../../Common/NotifyContext'
import { useProfile } from '../../Common/WalletContext'
import useDevice from '../../Common/useDevice'

const LensCreateComment = ({ postId, addComment }) => {
  const { error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()
  const { mutateAsync: addReaction } = useAddReactionMutation()

  const { mutateAsync: createCommentWithSign } =
    useCreateCommentTypedDataMutation()
  const { mutateAsync: createCommentViaDispatcher } =
    useCreateCommentViaDispatcherMutation()

  const { notifyError } = useNotify()

  const commentRef = useRef()
  const [loading, setLoading] = useState(false)

  // todo: add appreciate amoount using contract

  const { hasProfile, isSignedIn, data: lensProfile } = useLensUserContext()
  const { user } = useProfile()
  const { isMobile } = useDevice()

  const onSuccessCreateComment = async (result) => {
    const commentId = commentIdFromIndexedResult(
      lensProfile?.defaultProfile?.id,
      result
    )
    await addReaction({
      request: {
        profileId: lensProfile?.defaultProfile?.id,
        publicationId: commentId,
        reaction: ReactionTypes.Upvote
      }
    })
    setLoading(false)
    commentRef.current.value = ''
    //sending comment to feed without waiting for transaction to be indexed
    addComment({
      id: commentId,
      profile: {
        picture: {
          original: {
            url: lensProfile?.defaultProfile?.picture?.original?.url
          }
        },
        id: lensProfile?.defaultProfile?.id,
        handle: lensProfile?.defaultProfile?.handle
      },
      createdAt: new Date().toISOString(),
      metadata: {
        content: commentRef.current.value
      },
      stats: {
        totalUpvotes: 1,
        totalDownvotes: 0
      },
      reaction: ReactionTypes.Upvote
    })
  }

  const createComment = async () => {
    if (!lensProfile?.defaultProfile?.id) return
    const content = commentRef.current.value
    if (!content || content === '') return
    setLoading(true)
    try {
      const ipfsHash = await uploadToIpfsInfuraAndGetPath({
        version: '2.0.0',
        mainContentFocus: PublicationMainFocus.TextOnly,
        metadata_id: uuidv4(),
        description: content,
        locale: 'en-US',
        content: content,
        external_url: 'https://diversehq.xyz',
        image: null,
        imageMimeType: null,
        name: 'Create with DiverseHQ',
        attributes: [],
        tags: [],
        appId: 'DiverseHQ'
      })

      console.log('ipfsHash', ipfsHash)

      const createCommentRequest = {
        profileId: lensProfile?.defaultProfile?.id,
        publicationId: postId,
        contentURI: `ipfs://${ipfsHash}`,
        collectModule: { revertCollectModule: true },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      }

      await comment(createCommentRequest)
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  const comment = async (createCommentRequest) => {
    try {
      if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
        const dispatcherResult = (
          await createCommentViaDispatcher({
            request: createCommentRequest
          })
        ).createCommentViaDispatcher

        console.log('dispatcherResult', dispatcherResult)
        console.log(dispatcherResult)
        console.log('index started ....')
        const indexResult = await pollUntilIndexed({
          txId: dispatcherResult.txId
        })
        console.log('index result', indexResult)
        console.log('index ended ....')

        //invalidate query to update feed
        if (indexResult.indexed === true) {
          onSuccessCreateComment(indexResult)
          console.log('comment created successfully')
        }
      } else {
        const commentTypedResult = (
          await createCommentWithSign({
            request: createCommentRequest
          })
        ).createCommentTypedData
        console.log('commentTypedResult', commentTypedResult)
        signTypedDataAndBroadcast(commentTypedResult.typedData, {
          id: commentTypedResult.id,
          type: 'createComment'
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (result && type === 'createComment') {
      onSuccessCreateComment(result)
    }
  }, [result, type])

  useEffect(() => {
    if (error) {
      setLoading(false)
      notifyError(error)
    }
  }, [error])

  useEffect(() => {
    if (error) {
      notifyError(error)
    }
  }, [error])

  return (
    <div>
      {hasProfile &&
        isSignedIn &&
        lensProfile?.defaultProfile?.id &&
        (!isMobile ? (
          <div className="px-3 sm:px-5 items-center w-full bg-s-bg py-2 sm:rounded-2xl ">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row items-center">
                <img
                  src={
                    user?.profileImageUrl
                      ? user?.profileImageUrl
                      : '/gradient.jpg'
                  }
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
                <div className="ml-2 font-bold text-base">
                  {lensProfile?.defaultProfile?.handle}
                </div>
              </div>
            </div>
            <div className="pl-8 sm:pl-10">
              <input
                type="text"
                ref={commentRef}
                className={`border-none outline-none w-full mt-1   text-base bg-s-bg ${
                  loading ? 'text-s-text' : 'text-p-text'
                }`}
                placeholder="Say it.."
                onKeyUp={(e) => {
                  if (e.key === 'Enter') createComment()
                }}
                disabled={loading}
              />
              <div className="w-full flex flex-row justify-end">
                <button
                  disabled={loading}
                  onClick={createComment}
                  className="text-p-btn-text font-bold bg-p-btn px-3 py-0.5 rounded-full text-sm mr-2"
                >
                  {loading ? 'Commenting...' : 'Comment'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-3 sm:px-5 w-full bg-s-bg py-3 fixed z-10 top-[calc(100vh-110px)]">
            <div className="flex flex-row justify-between items-center w-full gap-2 sm:gap-4">
              <div className="flex flex-row gap-2 sm:gap-4 items-center w-full">
                <div className="flex flex-row items-center">
                  <img
                    src={
                      user?.profileImageUrl
                        ? user?.profileImageUrl
                        : '/gradient.jpg'
                    }
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    ref={commentRef}
                    className={`border-none outline-none w-full text-base sm:text-[18px] py-1 px-4 sm:py-2 rounded-[18px] bg-p-bg font-medium ${
                      loading ? 'text-s-text' : 'text-p-text'
                    }`}
                    placeholder="What do you think?"
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') createComment()
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex flex-row items-center justify-center">
                <button
                  disabled={loading}
                  onClick={createComment}
                  className="text-p-btn-text font-bold bg-p-btn px-3 py-0.5 rounded-full text-sm mr-2"
                >
                  {loading ? 'Commenting...' : 'Comment'}
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default LensCreateComment
