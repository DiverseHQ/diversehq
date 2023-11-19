import React, { useEffect, useRef, useState } from 'react'
import {
  Comment,
  LimitType,
  OnchainCommentRequest,
  Post,
  Profile,
  TriStateValue,
  useCommentOnMomokaMutation,
  useCommentOnchainMutation,
  useCreateMomokaCommentTypedDataMutation,
  useCreateOnchainCommentTypedDataMutation,
  useSearchProfilesQuery
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
import { usePublicationStore } from '../../../store/publication'
import { v4 as uuid } from 'uuid'
import Attachment from '../Attachment'
import { supportedMimeTypes } from '../../../utils/config'
import AttachmentRow from '../Create/AttachmentRow'
import { hasMentionAtEnd } from '../../../utils/helper'
import useUploadAttachments from '../Create/useUploadAttachments'
import checkDispatcherPermissions from '../../../lib/profile/checkPermission'
import useCommentMetadata from '../../Comment/useCommentMetadata'
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
  postInfo?: Post | Comment
  canCommnet?: boolean
  isMainPost?: boolean
}) => {
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState<Array<Record<string, string>>>([])

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
    useCreateOnchainCommentTypedDataMutation()
  const { mutateAsync: createCommentViaDispatcher } =
    useCommentOnchainMutation()
  const { mutateAsync: createDACommentViaDispatcher } =
    useCommentOnMomokaMutation()
  const { mutateAsync: createDACommentTypedData } =
    useCreateMomokaCommentTypedDataMutation()

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
  const { isMobile } = useDevice()

  const [popupStyle, setPopupStyle] = useState<any>({ display: 'none' })

  const [queryString, setQueryString] = useState<string | null>(null)
  const { handleUploadAttachments } = useUploadAttachments(true)

  const getMetadata = useCommentMetadata()

  const { data } = useSearchProfilesQuery(
    {
      request: {
        query: queryString ?? null,
        limit: LimitType.Ten
      }
    },
    {
      enabled: !!queryString && queryString.length > 0
    }
  )

  useEffect(() => {
    if (data?.searchProfiles?.items.length > 0) {
      const profilesResults = data?.searchProfiles?.items?.map(
        (user: Profile) =>
          ({
            name: user?.metadata?.displayName,
            handle: user?.handle?.fullHandle,
            picture: getAvatar(user)
          } as Record<string, string>)
      )
      setResults(profilesResults)
    }
  }, [data])

  const getAnimationUrl = () => {
    if (attachments.length > 0 && attachments[0]?.type === 'Video') {
      return attachments[0]?.item
    }
    return null
  }

  // todo: add appreciate amoount using contract

  const { hasProfile, isSignedIn, data: lensProfile } = useLensUserContext()

  const { canUseLensManager } = checkDispatcherPermissions(
    lensProfile?.defaultProfile
  )

  const onSuccessCreateComment = async (tx, tempId, isDA) => {
    const comment: Comment = {
      id: isDA ? tempId : null,
      tempId: tempId,
      momoka: {
        proof: 'proof'
      },
      isDataAvailability: Boolean(isDA),
      // @ts-ignore
      by: lensProfile?.defaultProfile,
      createdAt: new Date().toISOString(),
      // @ts-ignore
      metadata: {
        // @ts-ignore
        content: String(commentRef?.current?.value),
        asset: {
          image: {
            optimized: {
              uri:
                attachments[0]?.type === 'Image'
                  ? attachments[0]?.previewItem
                  : null
            }
          },
          // @ts-ignore
          video: {
            optimized: {
              uri:
                attachments[0]?.type === 'Video'
                  ? attachments[0]?.previewItem
                  : null
            }
          },
          audio: {
            optimized: {
              uri:
                attachments[0]?.type === 'Audio'
                  ? attachments[0]?.previewItem
                  : null
            }
          }
        },
        title: 'Comment with DiverseHQ',
        // @ts-ignore
        attachments: attachments.map((attachment) => {
          if (attachment.type === 'Image') {
            return {
              image: {
                optimized: {
                  uri: attachment.item
                }
              }
            }
          }
          if (attachment.type === 'Video') {
            return {
              video: {
                optimized: {
                  uri: attachment.item
                }
              }
            }
          }
          if (attachment.type === 'Audio') {
            return {
              audio: {
                uri: attachment.item
              }
            }
          }
        })
      },
      // @ts-ignore
      operations: {
        canComment: TriStateValue.Yes,
        canMirror: TriStateValue.Yes,
        hasReacted: true
      },
      // @ts-ignore
      stats: {
        reactions: 1,
        bookmarks: 0,
        comments: 0,
        countOpenActions: 0,
        id: uuid(),
        mirrors: 0,
        quotes: 0
      },
      reaction: 'Upvote'
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

    try {
      const metadata_id = uuid()
      setTempId(tempId)

      let animationUrl = getAnimationUrl()
      let marketplace = {
        name: 'Comment with DiverseHQ',
        description: content?.trim(),
        external_url: 'https://diversehq.xyz'
      }

      if (animationUrl) {
        marketplace['animation_url'] = animationUrl
      }

      const baseMetadata = {
        title: 'Comment with DiverseHQ',
        content: content.trim(),
        marketplace: marketplace
      }

      const metadata = getMetadata({ baseMetadata })

      console.log('metadata', metadata)
      const ipfsHash = await uploadToIpfsInfuraAndGetPath(metadata)

      if (postInfo?.momoka?.proof) {
        try {
          if (canUseLensManager) {
            const createComment = (
              await createDACommentViaDispatcher({
                request: {
                  commentOn: postId,
                  contentURI: `ipfs://${ipfsHash}`
                }
              })
            ).commentOnMomoka

            if (
              createComment.__typename === 'LensProfileManagerRelayError' ||
              !createComment.id
            ) {
              setLoading(false)
              notifyError(
                createComment.__typename === 'LensProfileManagerRelayError'
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
                  contentURI: `ipfs://${ipfsHash}`
                }
              })
            ).createMomokaCommentTypedData

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

      const createCommentRequest: OnchainCommentRequest = {
        contentURI: `ipfs://${ipfsHash}`,
        referenceModule: {
          followerOnlyReferenceModule: false
        },
        commentOn: postId
      }

      // await comment(createCommentRequest)
      try {
        if (canUseLensManager) {
          const dispatcherResult = (
            await createCommentViaDispatcher({
              request: createCommentRequest
            })
          ).commentOnchain
          if (dispatcherResult.__typename === 'LensProfileManagerRelayError') {
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
          ).createOnchainCommentTypedData
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

  const SingleResultItem = ({
    result,
    className
  }: {
    result: any
    className?: string
  }) => {
    return (
      <div
        className={clsx(
          'flex flex-row w-full px-3 py-2 hover:bg-s-hover cursor-pointer items-center justify-between',
          className
        )}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          // @ts-ignore
          const comment = commentRef.current.value
          // @ts-ignore
          const words = comment.split(' ')
          // @ts-ignore
          words.pop()
          // @ts-ignore
          words.push(`@${result.handle}`)
          // @ts-ignore
          commentRef.current.value = words.join(' ')
          // @ts-ignore
          commentRef.current.focus()
          setResults([])
        }}
      >
        <div className="flex flex-row items-center space-x-2">
          <ImageWithPulsingLoader
            // @ts-ignore
            src={result.picture}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
          />
          <div>
            <div className="font-bold text-base truncate">
              {stringToLength(result.name, 18)}
            </div>

            <div className="text-sm font-medium text-s-text">
              <span>u/{formatHandle(result.handle)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isTypeAllowed = (files: any) => {
    for (const file of files) {
      if (supportedMimeTypes.includes(file.type)) {
        return true
      }
    }

    return false
  }

  const handlePaste = async (
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const clipboardData = event.clipboardData
    if (clipboardData) {
      const items = clipboardData.items
      const files = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === 'file') {
          console.log('File pasted:', item.getAsFile())
          // Do something with the file
          files.push(item.getAsFile())
        }
      }

      if (files.length > 0 && isTypeAllowed(files)) {
        await handleUploadAttachments(files)
      }
    }
  }

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
                {lensProfile?.defaultProfile?.metadata?.displayName && (
                  <div className="font-bold text-base">
                    {stringToLength(
                      lensProfile?.defaultProfile?.metadata?.displayName,
                      20
                    )}
                  </div>
                )}
                <div className="text-sm font-medium text-s-text">
                  <span>
                    {/* @ts-ignore */}
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
                onPaste={handlePaste}
                onChange={(event) => {
                  // Get the cursor position
                  const cursorPosition = event.target.selectionStart
                  // Get the position and dimensions of the textarea element
                  const { left, top } =
                    // @ts-ignore
                    commentRef.current.getBoundingClientRect()
                  // Calculate the left and top positions of the pop-up component relative to the viewport
                  const leftPosition =
                    // @ts-ignore
                    left + commentRef.current.scrollLeft + cursorPosition * 5 // You can adjust the multiplier to suit your needs
                  const topPosition =
                    top +
                    // @ts-ignore

                    commentRef.current.scrollTop +
                    // @ts-ignore

                    commentRef.current.offsetHeight
                  // Set the style of the pop-up component to position it at the correct location
                  setPopupStyle({
                    left: `${leftPosition}px`,
                    top: `${topPosition}px`
                  })
                }}
                onInput={async (e) => {
                  // @ts-ignore
                  // setContent(e.target.value)
                  // @ts-ignore
                  e.target.style.height = 'auto'
                  // @ts-ignore
                  e.target.style.height = e.target.scrollHeight + 'px'
                  // @ts-ignore
                  if (hasMentionAtEnd(e.target.value)) {
                    // get the last word in the commeent without the @
                    // @ts-ignore
                    const lastWord = e.target.value
                      .split(' ')
                      .pop()
                      .replace('@', '')
                    // @ts-ignore
                    setQueryString(lastWord)
                  } else {
                    setQueryString('')
                  }
                }}
              />
              {results?.length > 0 && queryString?.length > 0 && (
                <div
                  style={{
                    ...popupStyle,
                    zIndex: 100,
                    position: 'fixed'
                  }}
                  className="border-s-border border rounded-xl shadow-sm w-52 text-p-text bg-s-bg overflow-hidden"
                >
                  {results.map((result, index) => (
                    <div className="" key={index}>
                      <SingleResultItem key={index} result={result} />
                    </div>
                  ))}
                </div>
              )}
              <Attachment
                className="w-full"
                // @ts-ignore
                newAttachments={attachments}
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
                        previewItem: gif.images.original.url,
                        type: 'Image',
                        mimeType: 'image/gif',
                        title: gif.title
                      }
                      // @ts-ignore
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
              'w-full bg-s-bg fixed z-30 bottom-0 left-0 right-0 flex flex-col items-start pt-3',
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
                toAvatarUrl={getAvatar(postInfo?.by)}
                toContent={postInfo?.metadata?.content}
                toHandle={postInfo?.by?.handle?.fullHandle}
              />
            )}
            <div className="pb-2 px-4">
              <Attachment
                className="max-h-[300px] w-full rounded-lg"
                // @ts-ignore
                newAttachments={attachments}
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
            {focused && results?.length > 0 && queryString?.length > 0 && (
              <div
                className="bg-s-bg w-full pl-2"
                style={{
                  zIndex: 100
                }}
              >
                {results.map((result, index) => (
                  <SingleResultItem key={index} result={result} />
                ))}
              </div>
            )}
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
                  onPaste={handlePaste}
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
                    // @ts-ignore
                    if (hasMentionAtEnd(e.target.value)) {
                      // get the last word in the commeent without the @
                      // @ts-ignore
                      const lastWord = e.target.value
                        .split(' ')
                        .pop()
                        .replace('@', '')
                      // @ts-ignore
                      setQueryString(lastWord)
                    } else {
                      setQueryString('')
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
                          previewItem: gif.images.original.url,
                          mimeType: 'image/gif',
                          type: 'Image',
                          title: gif.title
                        }
                        // @ts-ignore
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
