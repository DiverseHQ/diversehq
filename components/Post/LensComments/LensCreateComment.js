import { uuidv4 } from '@firebase/util'
import React, { useEffect, useRef, useState } from 'react'
import {
  PublicationMainFocus,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation
} from '../../../graphql/generated'
import { pollUntilIndexed } from '../../../lib/indexer/has-transaction-been-indexed'
import { useLensUserContext } from '../../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../../lib/useSignTypedDataAndBroadcast'
import { uploadToIpfsInfuraAndGetPath } from '../../../utils/utils'
import { useNotify } from '../../Common/NotifyContext'
import { useProfile } from '../../Common/WalletContext'

const LensCreateComment = ({ postId, addComment }) => {
  const { error, signTypedDataAndBroadcast } = useSignTypedDataAndBroadcast()

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

        //sending comment to feed without waiting for transaction to be indexed
        addComment({
          profile: {
            picture: {
              original: {
                url: lensProfile?.defaultProfile?.picture?.original?.url
              }
            },
            handle: lensProfile?.defaultProfile?.handle
          },
          createdAt: new Date().toISOString(),
          metadata: {
            content: commentRef.current.value
          }
        })

        // setComments((prev) => [
        //   {
        //     profile: {
        //       picture: {
        //         original: {
        //           url: user?.profileImageUrl
        //         }
        //       },
        //       handle: lensProfile?.defaultProfile?.handle
        //     },
        //     createdAt: new Date().toISOString(),
        //     metadata: {
        //       content: commentRef.current.value
        //     }
        //   },
        //   ...prev
        // ])

        setLoading(false)
        commentRef.current.value = ''

        console.log(dispatcherResult)
        console.log('index started ....')
        const indexResult = await pollUntilIndexed({
          txId: dispatcherResult.txId
        })
        console.log('index result', indexResult)
        console.log('index ended ....')

        //invalidate query to update feed
        if (indexResult.indexed === true) {
          console.log('comment created successfully')
        }
      } else {
        const commentTypedResult = (
          await createCommentWithSign({
            request: createCommentRequest
          })
        ).createCommentTypedData
        console.log('commentTypedResult', commentTypedResult)

        //sending comment to feed without waiting for transaction to be indexed

        addComment({
          profile: {
            picture: {
              original: {
                url: lensProfile?.defaultProfile?.picture?.original?.url
              }
            },
            handle: lensProfile?.defaultProfile?.handle
          },
          createdAt: new Date().toISOString(),
          metadata: {
            content: commentRef.current.value
          },
          stats: {
            totalUpvotes: 0,
            totalDownvotes: 0
          }
        })
        // setComments((prev) => [
        //   {
        //     profile: {
        //       picture: {
        //         original: {
        //           url: user?.profileImageUrl
        //         }
        //       },
        //       handle: lensProfile?.defaultProfile?.handle
        //     },
        //     createdAt: new Date().toISOString(),
        //     metadata: {
        //       content: commentRef.current.value
        //     },
        //     stats: {
        //       totalUpvotes: 0,
        //       totalDownvotes: 0
        //     }
        //   },
        //   ...prev
        // ])
        setLoading(false)
        commentRef.current.value = ''

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
    if (error) {
      notifyError(error)
    }
  }, [error])

  return (
    <div>
      {hasProfile && isSignedIn && lensProfile?.defaultProfile?.id && (
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
            {/* <div className="flex flex-row items-center justify-center">
              {!loading && (
                <FiSend
                  onClick={createComment}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-p-text"
                />
              )}
              {loading && (
                <img
                  src="/loading.svg"
                  alt="loading"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              )}
            </div> */}
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
              {/* {!loading && (
                <FiSend
                  onClick={createComment}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-p-text"
                />
              )}
              {loading && (
                <img
                  src="/loading.svg"
                  alt="loading"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              )} */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LensCreateComment
