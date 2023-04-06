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
import {
  stringToLength,
  uploadToIpfsInfuraAndGetPath
} from '../../../utils/utils'
import { useNotify } from '../../Common/NotifyContext'
import { FiSend } from 'react-icons/fi'
import getAvatar from '../../User/lib/getAvatar'
import { useCommentStore } from '../../../store/comment'
import ReplyMobileInfo from './ReplyMobileInfo'
import Giphy from '../Giphy'
import { AiOutlineClose } from 'react-icons/ai'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import formatHandle from '../../User/lib/formatHandle'
import clsx from 'clsx'
import { useDevice } from '../../Common/DeviceWrapper'
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
  const [gifAttachment, setGifAttachment] = useState(null)

  // todo: add appreciate amoount using contract

  const { hasProfile, isSignedIn, data: lensProfile } = useLensUserContext()
  const { isMobile } = useDevice()

  const onSuccessCreateComment = async (tx, tempId) => {
    const comment = {
      tempId: tempId,
      profile: {
        picture: {
          original: {
            // @ts-ignore
            url: lensProfile?.defaultProfile?.picture?.original?.url
          }
        },
        id: lensProfile?.defaultProfile?.id,
        handle: lensProfile?.defaultProfile?.handle,
        name: lensProfile?.defaultProfile?.name
      },
      createdAt: new Date().toISOString(),
      metadata: {
        // @ts-ignore
        content: commentRef.current.value
      },
      stats: {
        totalUpvotes: 1,
        totalDownvotes: 0
      },
      reaction: ReactionTypes.Upvote
    }
    setLoading(false)
    if (commentRef?.current) {
      // @ts-ignore
      commentRef.current.value = ''
      // @ts-ignore
      commentRef.current.style.height = 'auto'
      // @ts-ignore
      commentRef.current.style.height = commentRef.current.scrollHeight + 'px'
    }
    addComment(tx, comment)
    setCurrentReplyComment(null)
    setGifAttachment(null)
  }

  const createComment = async () => {
    if (!lensProfile?.defaultProfile?.id) return
    // @ts-ignore
    const content = commentRef.current.value
    if (!gifAttachment && (content.trim() === '' || !content)) return
    setLoading(true)
    let mainContentFocus = null

    if (gifAttachment) {
      mainContentFocus = PublicationMainFocus.Image
      console.log('gifAttachment while posting', gifAttachment)
    } else {
      mainContentFocus = PublicationMainFocus.TextOnly
      console.log('textOnly')
    }

    try {
      const metadata_id = uuidv4()
      setTempId(tempId)
      const ipfsHash = await uploadToIpfsInfuraAndGetPath({
        version: '2.0.0',
        mainContentFocus: mainContentFocus,
        metadata_id: metadata_id,
        description: content,
        locale: 'en-US',
        content: content,
        external_url: 'https://diversehq.xyz',
        image: gifAttachment ? gifAttachment?.images?.original.url : null,
        imageMimeType: gifAttachment ? 'image/gif' : null,
        animation_url: gifAttachment
          ? gifAttachment?.images?.original.url
          : null,
        name: 'Create with DiverseHQ',
        attributes: [],
        tags: [],
        appId: 'DiverseHQ',
        media: gifAttachment
          ? [
              {
                item: gifAttachment?.images?.original.url,
                type: 'image/gif'
              }
            ]
          : null
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
          if (dispatcherResult.__typename === 'RelayError') {
            setLoading(false)
            notifyError(dispatcherResult.reason)
            return
          } else {
            onSuccessCreateComment({ txId: dispatcherResult.txId }, metadata_id)
          }
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
      onSuccessCreateComment({ txId: result.txId }, tempId)
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
    // @ts-ignore
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
          <div className="px-3 sm:px-5 items-center w-full bg-s-bg pt-3 pb-3 sm:rounded-t-2xl">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row items-center space-x-2">
                <ImageWithPulsingLoader
                  // @ts-ignore
                  src={getAvatar(lensProfile?.defaultProfile)}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
                {lensProfile?.defaultProfile?.name && (
                  <div className="font-bold text-base">
                    {stringToLength(lensProfile?.defaultProfile?.name, 20)}
                  </div>
                )}
                <div className="text-sm font-medium text-s-text">
                  <span>
                    u/{formatHandle(lensProfile?.defaultProfile?.handle)}
                  </span>
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
                disabled={loading || !postInfo?.canComment?.result}
                rows={1}
                style={{ resize: 'none' }}
                onInput={(e) => {
                  // @ts-ignore
                  e.target.style.height = 'auto'
                  // @ts-ignore
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
              />
              {gifAttachment && (
                <div className="flex items-center mt-2">
                  <div className="relative w-fit">
                    <img
                      src={gifAttachment.images.original.url}
                      className="max-h-80 rounded-2xl object-cover"
                      alt={gifAttachment.title}
                      // @ts-ignore
                      type="image/gif"
                    />

                    <AiOutlineClose
                      onClick={() => setGifAttachment(null)}
                      className="text-s-text w-7 h-7 bg-p-bg rounded-full p-1 absolute z-10 top-2 right-2"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="w-full flex flex-row justify-end space-x-2 items-center">
              {postInfo?.canComment?.result && (
                <Giphy setGifAttachment={setGifAttachment} />
              )}
              <button
                disabled={loading || !postInfo?.canComment?.result}
                onClick={createComment}
                className={clsx(
                  'text-p-btn-text font-bold px-3 py-0.5 rounded-full text-sm mr-2',
                  postInfo?.canComment?.result
                    ? 'bg-p-btn'
                    : 'bg-p-btn-disabled'
                )}
              >
                {loading
                  ? 'Sending...'
                  : postInfo?.canComment?.result
                  ? 'Send'
                  : 'Only followers can comment'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={clsx(
              'w-full bg-s-bg fixed z-30 border-t border-s-border bottom-0 left-0 right-0 flex flex-col items-center',
              focused && 'pt-2'
            )}
          >
            {!postInfo && currentReplyComment && focused && (
              <ReplyMobileInfo
                // @ts-ignore
                fromAvatarUrl={getAvatar(lensProfile?.defaultProfile)}
                toAvatarUrl={getAvatar(currentReplyComment?.profile)}
                toContent={currentReplyComment?.metadata?.content}
                toHandle={currentReplyComment?.profile?.handle}
              />
            )}
            {postInfo && focused && (
              <ReplyMobileInfo
                // @ts-ignore
                fromAvatarUrl={getAvatar(lensProfile?.defaultProfile)}
                toAvatarUrl={getAvatar(postInfo?.profile)}
                toContent={postInfo?.metadata?.content}
                toHandle={postInfo?.profile?.handle}
              />
            )}
            {gifAttachment && isMobile && (
              <div className="flex items-center mt-2 mb-2">
                <div className="relative w-fit">
                  <img
                    src={gifAttachment.images.original.url}
                    className="max-h-80 rounded-2xl object-cover"
                    alt={gifAttachment.title}
                  />

                  <AiOutlineClose
                    onClick={() => setGifAttachment(null)}
                    className="text-s-text w-7 h-7 bg-p-bg rounded-full p-1 absolute z-10 top-2 right-2"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-row items-center w-full rounded-xl">
              <div className="flex-1  relative mr-2">
                <textarea
                  ref={commentRef}
                  className={`flex flex-row items-center w-full no-scrollbar outline-none text-base sm:text-[18px] py-2 px-4 rounded-xl bg-s-bg font-medium ${
                    loading ? 'text-s-text' : 'text-p-text'
                  }`}
                  placeholder="What do you think?"
                  onInput={(e) => {
                    // @ts-ignore
                    if (e.target.value.trim() === '') {
                      setFocused(false)
                    }
                    // @ts-ignore
                    e.target.style.height = 'auto'
                    // @ts-ignore
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                  disabled={loading}
                  rows={1}
                  style={{ resize: 'none' }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </div>
              <div className="self-end p-2 flex flex-row items-center space-x-1">
                <Giphy setGifAttachment={setGifAttachment} />
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
