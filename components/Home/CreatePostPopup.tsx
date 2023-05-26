import React, { useState, useEffect } from 'react'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import PopUpWrapper from '../Common/PopUpWrapper'
import { AiOutlineDown } from 'react-icons/ai'
import { BsCollection } from 'react-icons/bs'
import { getJoinedCommunitiesApi } from '../../apiHelper/community'
import { Tooltip } from '@mui/material'
import { useLensUserContext } from '../../lib/LensUserContext'
import {
  MetadataAttributeInput,
  PublicationContentWarning,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  ReactionTypes,
  useAddReactionMutation,
  useCreateDataAvailabilityPostTypedDataMutation,
  useCreateDataAvailabilityPostViaDispatcherMutation,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation
} from '../../graphql/generated'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import FormTextInput from '../Common/UI/FormTextInput'
import FilterListWithSearch from '../Common/UI/FilterListWithSearch'
import CollectSettingsModel from '../Post/Collect/CollectSettingsModel'
import { usePostIndexing } from '../Post/IndexingContext/PostIndexingWrapper'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import {
  SUPPORTED_AUDIO_TYPE,
  SUPPORTED_IMAGE_TYPE,
  SUPPORTED_VIDEO_TYPE,
  appId,
  appLink
} from '../../utils/config'
import { IoIosArrowBack } from 'react-icons/io'
import PublicationEditor from '../Lexical/PublicationEditor'
import Giphy from '../Post/Giphy'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import OptionsWrapper from '../Common/OptionsWrapper'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'
import { submitPostForReview } from '../../apiHelper/reviewLensCommunityPost'
import { useDevice } from '../Common/DeviceWrapper'
import { useCommunityStore } from '../../store/community'
import { v4 as uuidv4 } from 'uuid'
import { AttachmentType, usePublicationStore } from '../../store/publication'
import useUploadAttachments from '../Post/Create/useUploadAttachments'
import Attachment from '../Post/Attachment'
import AttachmentRow from '../Post/Create/AttachmentRow'
import { useRouter } from 'next/router'
import useDASignTypedDataAndBroadcast from '../../lib/useDASignTypedDataAndBroadcast'
import PostPreferenceButton from './PostComposer/PostPreferenceButton'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical'
// import uploadToIPFS from '../../utils/uploadToIPFS'
import { uploadToIpfsInfuraAndGetPath } from '../../utils/utils'
import getIPFSLink from '../User/lib/getIPFSLink'
import { putAddLensPublication } from '../../apiHelper/lensPublication'

const CreatePostPopup = ({
  startingContent = ''
}: {
  startingContent?: string
}) => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState(startingContent)
  const { user, joinedLensCommunities, LensCommunity } = useProfile()
  const [loading, setLoading] = useState(false)
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [loadingJoinedCommunities, setLoadingJoinedCommunities] =
    useState(false)
  const [showCommunityOptions, setShowCommunityOptions] = useState(false)
  const [communityOptionsCoord, setCommunityOptionsCoord] = useState({
    left: '0px',
    top: '0px'
  })
  const { data: lensProfile } = useLensUserContext()
  const [showCollectSettings, setShowCollectSettings] = useState(false)
  const [collectSettings, setCollectSettings] = useState<any>(null)
  const [postMetadataForIndexing, setPostMetadataForIndexing] = useState(null)
  const { addPost } = usePostIndexing()
  const { notifyError, notifyInfo, notifySuccess } = useNotify()
  const { hideModal } = usePopUpModal()
  const { isMobile } = useDevice()
  const [flair, setFlair] = useState(null)
  const { handleUploadAttachments } = useUploadAttachments()

  const { mutateAsync: createPostViaDispatcher } =
    useCreatePostViaDispatcherMutation()
  const { mutateAsync: createPostViaSignedTx } =
    useCreatePostTypedDataMutation()
  const { error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast(false)
  const { mutateAsync: createPostDAViaDispatcher } =
    useCreateDataAvailabilityPostViaDispatcherMutation()
  const { mutateAsync: createDAPostTypedData } =
    useCreateDataAvailabilityPostTypedDataMutation()
  const { mutateAsync: addReaction } = useAddReactionMutation()
  const {
    loading: daLoading,
    type: daType,
    result: daResult,
    error: daError,
    signDATypedDataAndBroadcast
  } = useDASignTypedDataAndBroadcast()

  const [editor] = useLexicalComposerContext()

  const mostPostedCommunities =
    JSON.parse(window.localStorage.getItem('mostPostedCommunities')) || []
  const selectedCommunity = useCommunityStore(
    (state) => state.selectedCommunity
  )
  const selectCommunityForPost = useCommunityStore(
    (state) => state.selectCommunityForPost
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [flairDrawerOpen, setFlairDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)

  const attachments = usePublicationStore((state) => state.attachments)
  const resetAttachments = usePublicationStore(
    (state) => state.resetAttachments
  )
  const addAttachments = usePublicationStore((state) => state.addAttachments)
  const audioPublication = usePublicationStore(
    (state) => state.audioPublication
  )
  const isUploading = usePublicationStore((state) => state.isUploading)
  const isAudioPublication = SUPPORTED_AUDIO_TYPE.includes(attachments[0]?.type)

  const getMainContentFocus = () => {
    if (attachments.length > 0) {
      if (isAudioPublication) {
        return PublicationMainFocus.Audio
      } else if (SUPPORTED_IMAGE_TYPE.includes(attachments[0]?.type)) {
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
      (isAudioPublication ||
        SUPPORTED_VIDEO_TYPE.includes(attachments[0]?.type))
    ) {
      return attachments[0]?.item
    }
    return null
  }

  const getAttachmentImage = () => {
    if (isAudioPublication) {
      return audioPublication.cover
    }
    // loop over attachments and return first attachmen with type image
    for (let i = 0; i < attachments.length; i++) {
      if (SUPPORTED_IMAGE_TYPE.includes(attachments[i]?.type)) {
        return attachments[i]?.item
      }
    }
    return null
  }

  const getAttachmentImageMimeType = () => {
    return isAudioPublication
      ? audioPublication.coverMimeType
      : attachments[0]?.type
  }

  const storeMostPostedCommunities = () => {
    window.localStorage.setItem(
      'mostPostedCommunities',
      JSON.stringify([
        selectedCommunity,
        ...mostPostedCommunities.filter(
          (community) => community?._id !== selectedCommunity?._id
        )
      ])
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (!title || title?.trim() === '') {
      notifyError('Please enter a title')
      setLoading(false)
      return
    }
    if (
      collectSettings?.feeCollectModule &&
      Number(collectSettings?.feeCollectModule?.amount?.value) < 0.001
    ) {
      notifyError(`Price should be atleast 0.001`)
      setLoading(false)
      return
    }
    // }
    storeMostPostedCommunities()
    await handleCreateLensPost()
  }

  useEffect(() => {
    if (!editor) return
    if (startingContent) {
      console.log('startingContent', startingContent)

      editor?.update(() => {
        if ($getRoot().getTextContentSize() !== 0) return
        const paragraph = $createParagraphNode()
        const text = $createTextNode(startingContent)
        paragraph.append(text)
        $getRoot().append(paragraph)
      })
    }
  }, [])

  const handleCompletePost = () => {
    setLoading(false)
    resetAttachments()
    editor?.update(() => {
      $getRoot().clear()
    })
    hideModal()
  }

  const handleCreateLensPost = async () => {
    let contentWarning = null

    // textNftImage url if collectmodule

    const attributes: MetadataAttributeInput[] = [
      {
        traitType: 'type',
        displayType: PublicationMetadataDisplayTypes.String,
        value: getMainContentFocus()?.toLowerCase()
      }
    ]

    if (isAudioPublication) {
      attributes.push({
        traitType: 'author',
        displayType: PublicationMetadataDisplayTypes.String,
        value: audioPublication.author
      })

      attributes.push({
        traitType: 'title',
        displayType: PublicationMetadataDisplayTypes.String,
        value: audioPublication?.title || title
      })
    }

    const attachmentsInput: AttachmentType[] = attachments.map(
      (attachment) => ({
        type: attachment.type,
        altTag: attachment.altTag,
        item: attachment.item!
      })
    )

    //todo handle other file types and link content

    if (flair === 'SENSITIVE') {
      contentWarning = PublicationContentWarning.Sensitive
    } else if (flair === 'NSFW') {
      contentWarning = PublicationContentWarning.Nsfw
    } else if (flair === 'SPOILER') {
      contentWarning = PublicationContentWarning.Spoiler
    } else {
      contentWarning = null
    }

    //todo map to community id, so that can be identified by community
    const metadataId = uuidv4()
    const metadata = {
      version: '2.0.0',
      mainContentFocus: getMainContentFocus(),
      metadata_id: metadataId,
      contentWarning: contentWarning,
      description: 'Created with DiverseHQ',
      locale: 'en-US',
      content:
        `${
          selectedCommunity?.isLensCommunity &&
          selectedCommunity?._id !== LensCommunity?._id
            ? `Post by @${lensProfile.defaultProfile.handle} \n`
            : ``
        }` +
        `**${title}**` +
        '\n' +
        content?.trim() +
        `${
          !selectedCommunity?.isLensCommunity &&
          selectedCommunity?.name &&
          (user?.preferences?.appendLink ?? true)
            ? `\n ${appLink}/c/${selectedCommunity?.name}`
            : ``
        }${
          !selectedCommunity?.isLensCommunity &&
          selectedCommunity?.name &&
          (user?.preferences?.appendHashtags ?? true)
            ? `\n #${selectedCommunity?.name}`
            : ``
        }`,
      external_url: 'https://diversehq.xyz',
      image: attachmentsInput.length > 0 ? getAttachmentImage() : null,
      imageMimeType:
        attachmentsInput.length > 0
          ? getAttachmentImageMimeType()
          : 'image/svg+xml',
      name: isAudioPublication ? audioPublication.title : title,
      media: attachmentsInput,
      animation_url: getAnimationUrl(),
      attributes,
      tags: selectedCommunity?._id ? [selectedCommunity?._id] : [],
      appId: appId
    }

    console.log('content', content)

    // const jsonFile = new File([JSON.stringify(metadata)], 'metadata.json', {
    //   type: 'application/json'
    // })
    // const { url } = await uploadToIPFS(jsonFile)
    const ifpsHash = await uploadToIpfsInfuraAndGetPath(metadata)
    const url = `ipfs://${ifpsHash}`

    if (selectedCommunity?.isLensCommunity) {
      try {
        const res = await submitPostForReview(selectedCommunity?._id, url)
        if (res.status === 200) {
          notifySuccess('Post submitted for review')
          handleCompletePost()
        } else if (res.status === 400) {
          const resJson = await res.json()
          notifyError(resJson.msg)
        }
        return
      } catch (error) {
        notifyError('Error submitting post for review')
      } finally {
        setLoading(false)
      }
      return
    }

    const postForIndexing = {
      tempId: metadataId,
      communityInfo: selectedCommunity?._id
        ? {
            _id: selectedCommunity?._id,
            name: selectedCommunity?.name,
            image: getIPFSLink(selectedCommunity.logoImageUrl)
          }
        : null,
      createdAt: new Date().toISOString(),
      hasCollectedByMe: false,
      hidden: false,
      isGated: false,
      metadata: {
        ...metadata,
        media: attachmentsInput.map((attachment) => ({
          original: {
            url: attachment.item,
            mimeType: attachment.type
          }
        }))
      },
      profile: lensProfile?.defaultProfile,
      reaction: 'UPVOTE',
      stats: {
        totalUpvotes: 1,
        totalAmountOfCollects: 0,
        totalAmountOfComments: 0,
        totalDownvotes: 0
      }
    }

    if (!collectSettings) {
      // post as data availability post
      if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
        const dispatcherResult = (
          await createPostDAViaDispatcher({
            request: {
              contentURI: url,
              from: lensProfile?.defaultProfile?.id
            }
          })
        ).createDataAvailabilityPostViaDispatcher

        setLoading(false)
        if (
          dispatcherResult.__typename === 'RelayError' ||
          !dispatcherResult.id
        ) {
          notifyError(
            dispatcherResult.__typename === 'RelayError'
              ? dispatcherResult?.reason
              : 'Something went wrong'
          )
        } else {
          await addReaction({
            request: {
              profileId: lensProfile?.defaultProfile?.id,
              publicationId: dispatcherResult.id,
              reaction: ReactionTypes.Upvote
            }
          })

          if (selectedCommunity?._id) {
            console.log('adding lens publication')
            await putAddLensPublication(
              selectedCommunity._id,
              dispatcherResult.id
            )
          }

          // // addPost({ txId: dispatcherResult. }, postForIndexing)
          console.log(dispatcherResult)
          router.push(`/p/${dispatcherResult.id}`)
          handleCompletePost()
        }
      } else {
        const typedData = (
          await createDAPostTypedData({
            request: {
              contentURI: url,
              from: lensProfile?.defaultProfile?.id
            }
          })
        ).createDataAvailabilityPostTypedData

        signDATypedDataAndBroadcast(typedData.typedData, {
          id: typedData.id,
          type: 'createDAPost'
        })
      }
      return
    }

    const createPostRequest = {
      profileId: lensProfile?.defaultProfile?.id,
      contentURI: url,
      collectModule: collectSettings,
      referenceModule: {
        followerOnlyReferenceModule: false
      }
    }

    setPostMetadataForIndexing(postForIndexing)

    // dispatch or broadcast
    try {
      if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
        //gasless using dispatcher
        const dispatcherResult = (
          await createPostViaDispatcher({
            request: createPostRequest
          })
        ).createPostViaDispatcher

        setLoading(false)
        if (dispatcherResult?.__typename === 'RelayError') {
          notifyError(dispatcherResult.reason)
        } else {
          addPost({ txId: dispatcherResult.txId }, postForIndexing)
          handleCompletePost()
        }
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
      setLoading(false)
      console.log('error', e)
      notifyError('Error creating post, report to support')
      return
    }
    // await post(createPostRequest)
  }

  useEffect(() => {
    if (result && type === 'createPost') {
      addPost({ txId: result.txId }, postMetadataForIndexing)
      handleCompletePost()
    }
  }, [result, type])

  useEffect(() => {
    const foo = async () => {
      if (daResult && daType === 'createDAPost') {
        await addReaction({
          request: {
            profileId: lensProfile?.defaultProfile?.id,
            publicationId: daResult.id,
            reaction: ReactionTypes.Upvote
          }
        })
        setLoading(false)
        if (selectedCommunity?._id) {
          console.log('adding lens publication')
          await putAddLensPublication(selectedCommunity._id, daResult.id)
        }
        router.push(`/p/${daResult.id}`)
        handleCompletePost()
      }
    }

    foo()
  }, [daResult, daType])

  useEffect(() => {
    if (error || daError) {
      setLoading(false)
      notifyError(error || daError)
    }
  }, [error, daError])

  useEffect(() => {
    if (user) {
      getJoinedCommunities()
    }
  }, [user])

  const setGifAttachment = (gif) => {
    const attachment = {
      id: uuidv4(),
      item: gif.images.original.url,
      type: 'image/gif',
      altTag: gif.title
    }
    addAttachments([attachment])
  }

  const handleSelect = (community) => {
    setShowCommunityOptions(false)
    selectCommunityForPost(community)
  }

  const getJoinedCommunities = async () => {
    if (!user?.walletAddress) {
      notifyError('I think you are not logged in')
      return
    }
    setLoadingJoinedCommunities(true)
    const response = await getJoinedCommunitiesApi()
    // setting the joinedCommunitites with mostPostedCommunities from the localStorage at the top
    const myLensCommunity = []
    if (
      LensCommunity &&
      !mostPostedCommunities.some((c) => c?._id === LensCommunity?._id)
    ) {
      myLensCommunity.push({
        _id: LensCommunity?._id,
        name: formatHandle(LensCommunity?.Profile?.handle),
        logoImageUrl: getAvatar(LensCommunity?.Profile),
        isLensCommunity: true
      })
    }
    setJoinedCommunities([
      // ...mostPostedCommunities,
      ...joinedLensCommunities
        .map((community) => ({
          _id: community._id,
          name: formatHandle(community?.handle),
          // @ts-ignore
          logoImageUrl: getAvatar(community),
          isLensCommunity: true
        }))
        // .filter(
        //   (community) =>
        //     !mostPostedCommunities.some((c) => c?._id === community?._id)
        // )
        .filter(
          (community) => !myLensCommunity.some((c) => c?._id === community?._id)
        ),
      // removing the communities in the mostPostedCommunities from the joinedCommunities using communityId
      ...response
      // .filter(
      //   (community) =>
      //     !mostPostedCommunities.some((c) => c?._id === community?._id)
      // )
    ])
    setLoadingJoinedCommunities(false)
  }

  const customOptions = () => {
    return (
      <div className="fixed flex flex-row justify-center items-center z-50 top-0 left-0 no-scrollbar w-full h-full">
        <div className="flex justify-center items-center relative w-full h-full">
          <div
            className={`w-full h-full absolute z-0`}
            onClick={() => {
              setShowCommunityOptions(false)
            }}
          ></div>

          <div
            className={`flex flex-col h-fit absolute z-10 ${
              showCommunityOptions
                ? 'enter-fade-animation'
                : 'exit-fade-animation '
            }`}
            style={communityOptionsCoord}
          >
            <div className="bg-white/50 dark:bg-black/50 backdrop-blur-lg rounded-2xl max-h-[450px] overflow-auto">
              {loadingJoinedCommunities ? (
                <div className="rounded-2xl">
                  <div className="flex flex-row items-center justify-center p-2 m-2">
                    <div className="animate-pulse rounded-full bg-p-bg dark:bg-s-bg w-9 h-9" />
                    <div className="animate-pulse rounded-full bg-p-bg dark:bg-s-bg w-32 h-4 ml-4" />
                  </div>
                  <div className="flex flex-row items-center justify-center p-2 m-2">
                    <div className="animate-pulse rounded-full bg-p-bg dark:bg-s-bg w-9 h-9" />
                    <div className="animate-pulse rounded-full bg-p-bg dark:bg-s-bg w-32 h-4 ml-4" />
                  </div>
                  <div className="flex flex-row items-center justify-center p-2 m-2">
                    <div className="animate-pulse rounded-full bg-p-bg dark:bg-s-bg w-9 h-9" />
                    <div className="animate-pulse rounded-full bg-p-bg dark:bg-s-bg w-32 h-4 ml-4" />
                  </div>
                </div>
              ) : (
                <FilterListWithSearch
                  list={joinedCommunities}
                  type="community"
                  filterParam="name"
                  handleSelect={handleSelect}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const showJoinedCommunities = (e) => {
    if (loading) return
    if (joinedCommunities?.length === 0 && !loadingJoinedCommunities) {
      notifyInfo('Hey, you ! Yes you ! Join some communities first')
      return
    }
    setShowCommunityOptions(true)
    setCommunityOptionsCoord({
      top: e.currentTarget.getBoundingClientRect().bottom + 10 + 'px',
      left: e.currentTarget.getBoundingClientRect().left + 'px'
    })
  }

  const closePopUp = async () => {
    if (loading) return
    handleCompletePost()
  }

  const PopUpModal = () => {
    return (
      // simple modal
      <PopUpWrapper
        title="Create Post"
        onClick={handleSubmit}
        label="POST"
        loading={loading || daLoading}
        isDisabled={title.length === 0 || isUploading}
        hideTopBar={showCollectSettings}
        closePopup={closePopUp}
      >
        <div className="flex flex-row items-center justify-between px-4 z-50">
          {showCollectSettings ? (
            <button
              className="flex flex-row space-x-1 items-center justify-center  hover:bg-s-hover p-1 rounded-full"
              onClick={() => setShowCollectSettings(false)}
            >
              <IoIosArrowBack className="w-6 h-6" />
              <p className="text-p-text ml-4 text-xl">Back</p>
            </button>
          ) : (
            <div className="flex justify-center items-center border border-s-border rounded-full text-p-text w-fit h-[45px] bg-s-bg">
              <button className="" onClick={showJoinedCommunities}>
                {selectedCommunity?._id ? (
                  <div className="flex justify-center items-center p-2">
                    <img
                      src={getIPFSLink(selectedCommunity.logoImageUrl)}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                    <h1 className="ml-2">
                      {selectedCommunity?.isLensCommunity && 'l/'}
                      {selectedCommunity.name}
                    </h1>
                    <AiOutlineDown className="w-4 h-4 mx-1" />
                  </div>
                ) : (
                  <div className="flex flex-row items-center justify-center px-2">
                    <div>Select Community</div>
                    <AiOutlineDown className="w-4 h-4 mx-1" />
                  </div>
                )}
              </button>
            </div>
          )}

          <div
            className={`flex flex-row items-center jusitify-center  ${
              showCollectSettings ? 'hidden' : ''
            }`}
          >
            <OptionsWrapper
              OptionPopUpModal={() => (
                <MoreOptionsModal
                  className="z-50"
                  list={[
                    {
                      label: 'None',
                      onClick: () => {
                        setFlair('None')
                        setShowOptionsModal(false)
                        setFlairDrawerOpen(false)
                      }
                    },
                    {
                      label: 'NSFW',
                      onClick: () => {
                        setFlair('NSFW')
                        setShowOptionsModal(false)
                        setFlairDrawerOpen(false)
                      }
                    },
                    {
                      label: 'Sensitive',
                      onClick: () => {
                        setFlair('SENSITIVE')
                        setShowOptionsModal(false)
                        setFlairDrawerOpen(false)
                      }
                    },
                    {
                      label: 'Spoiler',
                      onClick: () => {
                        setFlair('SPOILER')
                        setShowOptionsModal(false)
                        setFlairDrawerOpen(false)
                      }
                    }
                  ]}
                />
              )}
              position="bottom"
              showOptionsModal={showOptionsModal}
              setShowOptionsModal={setShowOptionsModal}
              isDrawerOpen={flairDrawerOpen}
              setIsDrawerOpen={setFlairDrawerOpen}
            >
              <button className="flex items-center hover:cursor-pointer space-x-1 sm:space-x-2 py-1 px-2.5 sm:py-1 sm:px-2.5 rounded-full border border-s-border ">
                <p>{flair ? flair : 'Flair'}</p>
                <AiOutlineDown className="w-4 h-4 mx-1" />
              </button>
            </OptionsWrapper>
          </div>
        </div>

        {showCommunityOptions && customOptions()}
        {/* <!-- Modal body --> */}
        {!showCollectSettings && (
          <div>
            <FormTextInput
              label="Title"
              placeholder="gib me title"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
            {/* Rich text editor */}
            <PublicationEditor
              setContent={setContent}
              onPaste={(files) => {
                const file = files[0]
                if (!file) return
                handleUploadAttachments([file])
              }}
            />

            {/* <div className="text-base leading-relaxed m-4">
              {file || gifAttachment ? (
                showAddedFile()
              ) : (
                <label htmlFor="upload-file">
                  <div className="h-32 text-s-text flex flex-col justify-center items-center border border-s-border bg-s-bg rounded-xl">
                    <div>
                      <AiOutlineCamera className="h-8 w-8" />
                    </div>
                    <div>Add Image or Video</div>
                  </div>
                </label>
              )}
            </div> */}
            <div className="px-5">
              <Attachment
                className="w-full"
                publication={{
                  // @ts-ignore
                  metadata: {
                    content: content
                  }
                }}
                attachments={attachments}
                isNew
              />
            </div>
            <div className="ml-6 mt-2 flex items-center">
              <AttachmentRow />

              <Giphy setGifAttachment={(gif) => setGifAttachment(gif)} />
              {!selectedCommunity?.isLensCommunity && (
                <Tooltip
                  placement="bottom"
                  enterDelay={1000}
                  leaveDelay={200}
                  title="Collect Setting"
                  arrow
                >
                  <button
                    onClick={() => {
                      // if (!collectSettings) {
                      //   setCollectSettings({
                      //     freeCollectModule: { followerOnly: false }
                      //   })
                      // }
                      if (!isMobile) {
                        setShowCollectSettings(!showCollectSettings)
                        return
                      } else {
                        setIsDrawerOpen(true)
                      }
                    }}
                    disabled={loading}
                    className="rounded-full hover:bg-s-hover active:bg-s-hover p-2 cursor-pointer"
                  >
                    <BsCollection className="w-5 h-5" />
                  </button>
                </Tooltip>
              )}

              <PostPreferenceButton disabled={loading} />
            </div>
          </div>
        )}
        {showCollectSettings && !isMobile ? (
          <CollectSettingsModel
            collectSettings={collectSettings}
            setCollectSettings={setCollectSettings}
          />
        ) : (
          <BottomDrawerWrapper
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            showClose={false}
            position="bottom"
          >
            <CollectSettingsModel
              collectSettings={collectSettings}
              setCollectSettings={setCollectSettings}
            />
            <div className="px-4 w-full mb-3 mt-1">
              <button
                onClick={() => {
                  setIsDrawerOpen(false)
                }}
                className="bg-p-btn rounded-full text-center flex font-semibold text-p-text py-1 justify-center items-center w-full text-xl mb-6"
              >
                Save
              </button>
            </div>
          </BottomDrawerWrapper>
        )}
      </PopUpWrapper>
    )
  }

  return <div className="">{PopUpModal()}</div>
}

export default CreatePostPopup
