import { uuidv4 } from '@firebase/util'
import React, { useEffect, useRef, useState } from 'react'
import {
  PublicationMainFocus,
  ReactionTypes,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../../lib/useSignTypedDataAndBroadcast'
import { uploadToIpfsInfuraAndGetPath } from '../../../utils/utils'
import { useNotify } from '../../Common/NotifyContext'
import useDevice from '../../Common/useDevice'
import { FiSend } from 'react-icons/fi'
import getAvatar from '../../../components/User/lib/getAvatar'
import { useCommentStore } from '../../../store/comment'
import ReplyMobileInfo from './ReplyMobileInfo'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
const LensCreateComment = ({ postId, addComment, postInfo }) => {
  const [focused, setFocused] = useState(false)
  const { error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast(false)
  const currentReplyComment = useCommentStore(
    (state) => state.currentReplyComment
  )
  const setCurrentReplyComment = useCommentStore(
    (state) => state.setCurrentReplyComment
  )

  const { mutateAsync: createCommentWithSign } =
    useCreateCommentTypedDataMutation()
  const { mutateAsync: createCommentViaDispatcher } =
    useCreateCommentViaDispatcherMutation()
  const [tempId, setTempId] = useState('')

  const { notifyError } = useNotify()

  const commentRef = useRef()
  const [loading, setLoading] = useState(false)

  // todo: add appreciate amoount using contract

  const { hasProfile, isSignedIn, data: lensProfile } = useLensUserContext()
  const { isMobile } = useDevice()

  const onSuccessCreateComment = async (tx, tempId) => {
    const comment = {
      tempId: tempId,
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
    }
    setLoading(false)
    addComment(tx, comment)
    setCurrentReplyComment(null)
    commentRef.current.value = ''
    commentRef.current.style.height = 'auto'
    commentRef.current.style.height = commentRef.current.scrollHeight + 'px'
  }

  const createComment = async () => {
    if (!lensProfile?.defaultProfile?.id) return
    const content = commentRef.current.value
    if (!content || content === '') return
    setLoading(true)
    try {
      const metadata_id = uuidv4()
      setTempId(tempId)
      const ipfsHash = await uploadToIpfsInfuraAndGetPath({
        version: '2.0.0',
        mainContentFocus: PublicationMainFocus.TextOnly,
        metadata_id: metadata_id,
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
      const createCommentRequest = {
        profileId: lensProfile?.defaultProfile?.id,
        publicationId: postId,
        contentURI: `ipfs://${ipfsHash}`,
        collectModule: { revertCollectModule: true },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      }

      // await comment(createCommentRequest)
      try {
        if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
          const dispatcherResult = (
            await createCommentViaDispatcher({
              request: createCommentRequest
            })
          ).createCommentViaDispatcher
          onSuccessCreateComment({ txId: dispatcherResult.txId }, metadata_id)
        } else {
          const commentTypedResult = (
            await createCommentWithSign({
              request: createCommentRequest
            })
          ).createCommentTypedData
          signTypedDataAndBroadcast(commentTypedResult.typedData, {
            id: commentTypedResult.id,
            type: 'createComment'
          })
        }
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (result && type === 'createComment') {
      onSuccessCreateComment({ txHash: result.txHash }, tempId)
    }
  }, [result, type])

  useEffect(() => {
    if (error) {
      setLoading(false)
      notifyError(error)
    }
  }, [error])

  useEffect(() => {
    if (postInfo) return
    setFocused(!!currentReplyComment)
    if (currentReplyComment) commentRef?.current?.focus()
  }, [currentReplyComment])

  if (!hasProfile || !isSignedIn || !lensProfile?.defaultProfile?.id) {
    return <></>
  }

  return (
    <div>
      {!isMobile ? (
        <>
          {/* Desktop create comment */}
          <div className="px-3 sm:px-5 items-center w-full bg-s-bg py-2 sm:rounded-2xl ">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row items-center">
                <ImageWithPulsingLoader
                  src={getAvatar(lensProfile?.defaultProfile)}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
                <div className="ml-2 font-bold text-base">
                  {lensProfile?.defaultProfile?.name
                    ? lensProfile?.defaultProfile?.name
                    : lensProfile?.defaultProfile?.handle.split('.')[0]}
                </div>
              </div>
            </div>
            <div className="px-10">
              <textarea
                ref={commentRef}
                className={`border-none outline-none w-full mt-1 text-base bg-s-bg ${
                  loading ? 'text-s-text' : 'text-p-text'
                }`}
                placeholder="Say it..."
                onKeyUp={(e) => {
                  if (e.key === 'Enter') createComment()
                }}
                disabled={loading}
                rows={1}
                style={{ resize: 'none' }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
              />
            </div>
            <div className="w-full flex flex-row justify-end">
              <button
                disabled={loading}
                onClick={createComment}
                className="text-p-btn-text font-bold bg-p-btn px-3 py-0.5 rounded-full text-sm mr-2"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="px-2 sm:px-5 w-full bg-s-bg pt-2 pb-1.5 fixed z-30 border-t border-s-border  bottom-0 left-0 right-0 flex flex-col items-center">
            {!postInfo && currentReplyComment && focused && (
              <ReplyMobileInfo
                fromAvatarUrl={getAvatar(lensProfile?.defaultProfile)}
                toAvatarUrl={getAvatar(currentReplyComment?.profile)}
                toContent={currentReplyComment?.metadata?.content}
                toHandle={currentReplyComment?.profile?.handle}
              />
            )}
            {postInfo && focused && (
              <ReplyMobileInfo
                fromAvatarUrl={getAvatar(lensProfile?.defaultProfile)}
                toAvatarUrl={getAvatar(postInfo?.profile)}
                toContent={postInfo?.metadata?.content}
                toHandle={postInfo?.profile?.handle}
              />
            )}
            <div className="flex flex-row items-center w-full rounded-xl border-2 border-p-border">
              <div className="flex-1  relative mr-2">
                <textarea
                  type="text"
                  ref={commentRef}
                  className={`flex flex-row items-center w-full no-scrollbar outline-none text-base sm:text-[18px] py-2 px-4 rounded-xl bg-s-bg font-medium ${
                    loading ? 'text-s-text' : 'text-p-text'
                  }`}
                  placeholder="What do you think?"
                  onInput={(e) => {
                    if (e.target.value.trim() === '') {
                      setFocused(false)
                    }
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                  disabled={loading}
                  rows={1}
                  style={{ resize: 'none' }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </div>
              <div className="self-end p-2">
                {!loading && (
                  <FiSend
                    onClick={createComment}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-p-text cursor-pointer"
                  />
                )}
                {loading && (
                  <img
                    src="/loading.svg"
                    alt="loading"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                )}
              </div>
            </div>
            {/* </div> */}
          </div>
        </>
      )}
    </div>
  )
}

export default LensCreateComment
