import { uuidv4 } from '@firebase/util'
import React, { useEffect, useRef, useState } from 'react'
import {
  PublicationMainFocus,
  ReactionTypes,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation,
  useCreateDataAvailabilityCommentTypedDataMutation,
  useCreateDataAvailabilityCommentViaDispatcherMutation
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../../lib/useSignTypedDataAndBroadcast'
import {
  stringToLength,
  uploadToIpfsInfuraAndGetPath
} from '../../../utils/utils'
import { useNotify } from '../../Common/NotifyContext'
import getAvatar from '../../User/lib/getAvatar'
import { useCommentStore } from '../../../store/comment'
import ReplyMobileInfo from './ReplyMobileInfo'
import Giphy from '../Giphy'
// import { AiOutlineClose } from 'react-icons/ai'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import formatHandle from '../../User/lib/formatHandle'
import clsx from 'clsx'
import { useDevice } from '../../Common/DeviceWrapper'
import useDASignTypedDataAndBroadcast from '../../../lib/useDASignTypedDataAndBroadcast'
// import useUploadAttachments from '../Create/useUploadAttachments'
import { AttachmentType, usePublicationStore } from '../../../store/publication'
import { uuid } from 'uuidv4'
import Attachment from '../Attachment'
import {
  SUPPORTED_IMAGE_TYPE,
  SUPPORTED_VIDEO_TYPE
} from '../../../utils/config'
import { appId } from '../../../utils/config'
import AttachmentRow from '../Create/AttachmentRow'
const LensCreateComment = ({
  postId,
  addComment,
  postInfo,
  canCommnet,
  isMainPost = false
}: {
  postId: string
  // eslint-disable-next-line no-unused-vars
  addComment: (tx: string | null, comment: any) => void
  postInfo?: any
  canCommnet?: boolean
  isMainPost?: boolean
}) => {
  const [focused, setFocused] = useState(false)
  // const content = useCommentStore((state) => state.content)
  // const setContent = useCommentStore((state) => state.setContent)
  const { error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast(false)
  const {
    error: daError,
    result: daResult,
    type: daType,
    signDATypedDataAndBroadcast
  } = useDASignTypedDataAndBroadcast()
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
  const { mutateAsync: createDACommentViaDispatcher } =
    useCreateDataAvailabilityCommentViaDispatcherMutation()
  const { mutateAsync: createDACommentTypedData } =
    useCreateDataAvailabilityCommentTypedDataMutation()

  const [tempId, setTempId] = useState('')

  const { notifyError } = useNotify()

  const commentRef = useRef()
  const createCommentComposerRef = useRef()
  const [loading, setLoading] = useState(false)
  // const [gifAttachment, setGifAttachment] = useState(null)

  // const { handleUploadAttachments } = useUploadAttachments()
  const attachments = usePublicationStore((state) => state.commnetAttachments)
  const resetAttachments = usePublicationStore(
    (state) => state.resetCommentAttachments
  )
  const addAttachments = usePublicationStore(
    (state) => state.addCommentAttachments
  )
  const isUploading = usePublicationStore((state) => state.isUploading)

  const getMainContentFocus = () => {
    if (attachments.length > 0) {
      if (SUPPORTED_IMAGE_TYPE.includes(attachments[0]?.type)) {
        return PublicationMainFocus.Image
      } else if (SUPPORTED_VIDEO_TYPE.includes(attachments[0]?.type)) {
        return PublicationMainFocus.Video
      } else {
        return PublicationMainFocus.TextOnly
      }
    } else {
      return PublicationMainFocus.TextOnly
    }
  }

  const getAnimationUrl = () => {
    if (
      attachments.length > 0 &&
      SUPPORTED_VIDEO_TYPE.includes(attachments[0]?.type)
    ) {
      return attachments[0]?.item
    }
    return null
  }

  const getAttachmentImage = () => {
    // loop over attachments and return first attachmen with type image
    for (let i = 0; i < attachments.length; i++) {
      if (SUPPORTED_IMAGE_TYPE.includes(attachments[i]?.type)) {
        return attachments[i]?.item
      }
    }
    return null
  }

  const getAttachmentImageMimeType = () => {
    return attachments[0]?.type
  }

  // todo: add appreciate amoount using contract

  const { hasProfile, isSignedIn, data: lensProfile } = useLensUserContext()
  const { isMobile } = useDevice()

  const onSuccessCreateComment = async (tx, tempId, isDA) => {
    const comment = {
      id: isDA ? tempId : null,
      tempId: tempId,
      isDataAvailability: Boolean(isDA),
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
        content: commentRef.current.value,
        mainContentFocus: getMainContentFocus(),
        media: attachments.map((attachment) => ({
          original: {
            url: attachment.item,
            mimeType: attachment.type
          }
        }))
      },
      stats: {
        totalUpvotes: 1,
        totalDownvotes: 0
      },
      reaction: ReactionTypes.Upvote
    }
    setLoading(false)
    if (commentRef?.current) {
      // setContent('')
      // @ts-ignore
      commentRef.current.value = ''
      // @ts-ignore
      commentRef.current.style.height = 'auto'
      // @ts-ignore
      commentRef.current.style.height = commentRef.current.scrollHeight + 'px'
    }
    setFocused(false)
    if (isDA) {
      addComment(null, comment)
    } else {
      addComment(tx, comment)
    }
    setCurrentReplyComment(null)
    resetAttachments()
  }

  const createComment = async () => {
    if (!lensProfile?.defaultProfile?.id) return
    // @ts-ignore
    const content = commentRef.current.value
    if (!content?.trim()) return
    setLoading(true)

    const attachmentsInput: AttachmentType[] = attachments.map(
      (attachment) => ({
        type: attachment.type,
        altTag: attachment.altTag,
        item: attachment.item!
      })
    )

    try {
      const metadata_id = uuidv4()
      setTempId(tempId)
      const ipfsHash = await uploadToIpfsInfuraAndGetPath({
        version: '2.0.0',
        mainContentFocus: getMainContentFocus(),
        metadata_id: metadata_id,
        description: content,
        locale: 'en-US',
        content: content,
        external_url: 'https://diversehq.xyz',
        image: attachmentsInput.length > 0 ? getAttachmentImage() : null,
        imageMimeType:
          attachmentsInput.length > 0
            ? getAttachmentImageMimeType()
            : 'image/svg+xml',
        animation_url: getAnimationUrl(),
        name: 'Create with DiverseHQ',
        attributes: [],
        tags: [],
        appId: appId,
        media: attachmentsInput
      })

      if (postInfo?.isDataAvailability) {
        try {
          if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
            const createComment = (
              await createDACommentViaDispatcher({
                request: {
                  commentOn: postId,
                  contentURI: `ipfs://${ipfsHash}`,
                  from: lensProfile?.defaultProfile?.id
                }
              })
            ).createDataAvailabilityCommentViaDispatcher

            if (
              createComment.__typename === 'RelayError' ||
              !createComment.id
            ) {
              setLoading(false)
              notifyError(
                createComment.__typename === 'RelayError'
                  ? createComment.reason
                  : 'Something went wrong'
              )
            } else {
              onSuccessCreateComment(null, createComment.id, true)
            }
          } else {
            const typedData = (
              await createDACommentTypedData({
                request: {
                  commentOn: postId,
                  contentURI: `ipfs://${ipfsHash}`,
                  from: lensProfile?.defaultProfile?.id
                }
              })
            ).createDataAvailabilityCommentTypedData

            signDATypedDataAndBroadcast(typedData.typedData, {
              id: typedData.id,
              type: 'createDAComment'
            })
          }
        } catch (error) {
          setLoading(false)
          console.log('error')
          notifyError('Something Went Wrong')
        }
        return
      }

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
            onSuccessCreateComment(
              { txId: dispatcherResult.txId },
              metadata_id,
              false
            )
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
      onSuccessCreateComment({ txId: result.txId }, tempId, false)
    }
  }, [result, type])

  useEffect(() => {
    if (daResult && daType === 'createDAComment') {
      onSuccessCreateComment(null, daResult.id, false)
    }
  }, [daResult, daType])

  useEffect(() => {
    if (error || daError) {
      setLoading(false)
      notifyError(error || daError)
    }
  }, [error, daError])

  useEffect(() => {
    // if (postInfo) return
    if (isMainPost) return
    setFocused(Boolean(currentReplyComment))
    // @ts-ignore
    if (currentReplyComment) commentRef?.current?.focus()
  }, [currentReplyComment])

  const handleClickOutside = (e) => {
    // @ts-ignore
    if (createCommentComposerRef?.current?.contains(e.target)) {
      // inside click
      return
    }
    setFocused(false)
    // outside click
    // setCurrentReplyComment(null)
  }

  useEffect(() => {
    if (commentRef?.current) {
      const { value } = commentRef.current
      // @ts-ignore
      commentRef.current.selectionStart = value.length
      // @ts-ignore
      commentRef.current.selectionEnd = value.length
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

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
                disabled={loading || !canCommnet}
                rows={1}
                style={{ resize: 'none' }}
                onInput={(e) => {
                  // @ts-ignore
                  // setContent(e.target.value)
                  // @ts-ignore
                  e.target.style.height = 'auto'
                  // @ts-ignore
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
              />
              <Attachment
                className="w-full"
                attachments={attachments}
                isNew
                isComment
              />
              {/* {gifAttachment && (
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
              )} */}
            </div>
            <div className="w-full space-x-2 space-between-row px-8">
              {canCommnet ? (
                <div className="start-row">
                  <Giphy
                    setGifAttachment={(gif) => {
                      const attachment = {
                        id: uuid(),
                        item: gif.images.original.url,
                        type: 'image/gif',
                        title: gif.title
                      }
                      console.log('attachment', attachment)
                      addAttachments([attachment])
                    }}
                  />
                  <AttachmentRow isComment hideUploadAudio />
                </div>
              ) : (
                <div />
              )}
              <button
                disabled={loading || !canCommnet || isUploading}
                onClick={createComment}
                className={clsx(
                  'text-p-btn-text font-bold px-3 py-0.5 rounded-full text-sm mr-2',
                  canCommnet ? 'bg-p-btn' : 'bg-p-btn-disabled'
                )}
              >
                {loading ? 'Sending...' : canCommnet ? 'Send' : `Can't reply`}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          id="create-comment-card"
          onClick={() => {
            if (!focused) setFocused(true)
          }}
          ref={createCommentComposerRef}
        >
          <div
            className={clsx(
              'w-full bg-s-bg fixed z-30 bottom-0 left-0 right-0 flex flex-col items-center pt-3',
              focused ? 'pb-2' : 'pb-3'
            )}
          >
            {!postInfo && focused && (
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
            <div className="pb-2 px-4">
              <Attachment
                className="max-h-[300px] w-full rounded-lg"
                attachments={attachments}
                isNew
                isComment
              />
            </div>
            {/* {gifAttachment && isMobile && (
              <div className="flex items-center mx-4 mb-2">
                <div className="relative w-fit">
                  <img
                    src={gifAttachment.images.original.url}
                    className="max-h-80 rounded-xl object-cover"
                    alt={gifAttachment.title}
                  />

                  <AiOutlineClose
                    onClick={() => setGifAttachment(null)}
                    className="text-s-text w-7 h-7 bg-p-bg rounded-full p-1 absolute z-10 top-2 right-2"
                  />
                </div>
              </div>
            )} */}
            <div className="flex flex-row items-center w-full rounded-xl px-4">
              {!focused && (
                <ImageWithPulsingLoader
                  // @ts-ignore
                  src={getAvatar(lensProfile?.defaultProfile)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                />
              )}
              <div className="flex-1 relative">
                <textarea
                  ref={commentRef}
                  // value={content}
                  className={clsx(
                    'flex px-2 flex-row items-center w-full no-scrollbar outline-none text-base sm:text-[18px] py-2 border-p-border border-[1px] rounded-xl bg-s-bg font-medium max-h-[150px]',
                    loading ? 'text-s-text' : 'text-p-text',
                    focused ? 'mx-0' : 'mx-2'
                  )}
                  placeholder="What do you think?"
                  // defaultValue={content}
                  onInput={(e) => {
                    //@ts-ignore
                    // setContent(e.target.value)
                    // @ts-ignore
                    if (e.target.scrollHeight < 150) {
                      // @ts-ignore
                      e.target.style.height = 'auto'
                      // @ts-ignore
                      e.target.style.height = `${e.target.scrollHeight}px`
                    }
                  }}
                  disabled={loading || !canCommnet}
                  rows={1}
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
            {focused && (
              <div className="flex flex-row items-center justify-between w-full px-5 pt-2 pb-1">
                {canCommnet ? (
                  <div className="start-row">
                    <Giphy
                      setGifAttachment={(gif) => {
                        const attachment = {
                          id: uuid(),
                          item: gif.images.original.url,
                          type: 'image/gif',
                          title: gif.title
                        }
                        addAttachments([attachment])
                      }}
                    />
                    <div onClick={(e) => e.stopPropagation()} className="">
                      <AttachmentRow isComment hideUploadAudio />
                    </div>
                  </div>
                ) : (
                  <div />
                )}
                <button
                  disabled={loading || !canCommnet || isUploading}
                  onClick={createComment}
                  className={clsx(
                    'text-p-btn-text font-bold px-3 py-0.5 rounded-full text-sm',
                    canCommnet ? 'bg-p-btn' : 'bg-p-btn-disabled'
                  )}
                >
                  {loading ? 'Sending...' : canCommnet ? 'Send' : `Can't reply`}
                </button>
              </div>
            )}
            {/* </div> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default LensCreateComment
