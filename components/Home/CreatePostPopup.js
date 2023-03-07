import React, { useState, useEffect } from 'react'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
// import { useRouter } from 'next/router'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
// import { postCreatePost } from '../../api/post'
import PopUpWrapper from '../Common/PopUpWrapper'
import { AiOutlineCamera, AiOutlineClose, AiOutlineDown } from 'react-icons/ai'
import { BsCollection } from 'react-icons/bs'
import {
  deleteFirebaseStorageFile,
  uploadFileToFirebaseAndGetUrl,
  uploadToIpfsInfuraAndGetPath
  // uploadFileToIpfs
} from '../../utils/utils'
import { getJoinedCommunitiesApi } from '../../api/community'
// import ToggleSwitch from '../Post/ToggleSwitch'
import { CircularProgress } from '@mui/material'

import { useLensUserContext } from '../../lib/LensUserContext'
import { uuidv4 } from '@firebase/util'
import {
  PublicationContentWarning,
  PublicationMainFocus,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation
} from '../../graphql/generated'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import FormTextInput from '../Common/UI/FormTextInput'
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
// import { $getRoot } from 'lexical'
import FilterListWithSearch from '../Common/UI/FilterListWithSearch'
import CollectSettingsModel from '../Post/Collect/CollectSettingsModel'
import { usePostIndexing } from '../Post/IndexingContext/PostIndexingWrapper'
import useDevice from '../Common/useDevice'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import { appId, supportedMimeTypes } from '../../utils/config'
import { IoIosArrowBack } from 'react-icons/io'
import PublicationEditor from '../Lexical/PublicationEditor'
import Giphy from '../Post/Giphy'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import OptionsWrapper from '../Common/OptionsWrapper'
// import { useTheme } from '../Common/ThemeProvider'

const CreatePostPopup = () => {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [content, setContent] = useState('')
  const [communityId, setCommunityId] = useState(null)
  const { user, address } = useProfile()
  const [loading, setLoading] = useState(false)
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [loadingJoinedCommunities, setLoadingJoinedCommunities] =
    useState(false)
  const [imageValue, setImageValue] = useState(null)
  const [showCommunityOptions, setShowCommunityOptions] = useState(false)
  const [communityOptionsCoord, setCommunityOptionsCoord] = useState({
    left: '0px',
    top: '0px'
  })
  const { data: lensProfile } = useLensUserContext()
  // const [isLensPost, setIsLensPost] = useState(
  //   (isSignedIn && hasProfile) || false
  // )
  // const [editor] = useLexicalComposerContext()
  const [showCollectSettings, setShowCollectSettings] = useState(false)
  const [collectSettings, setCollectSettings] = useState({
    freeCollectModule: { followerOnly: false }
  })
  const [postMetadataForIndexing, setPostMetadataForIndexing] = useState(null)
  const { addPost } = usePostIndexing()
  // const [IPFSHash, setIPFSHash] = useState(null)
  const [imageUpload, setImageUpload] = useState(false)
  // useEffect(() => {
  //   return () => {
  //     editor?.update(() => {
  //       $getRoot().clear()
  //     })
  //   }
  // }, [])

  const { notifyError, notifyInfo } = useNotify()
  // const router = useRouter()
  const { hideModal } = usePopUpModal()
  const [showCommunity, setShowCommunity] = useState({ name: '', image: '' })
  const { isMobile } = useDevice()
  const [flair, setFlair] = useState(null)
  const [firebaseUrl, setFirebaseUrl] = useState(null)

  const { mutateAsync: createPostViaDispatcher } =
    useCreatePostViaDispatcherMutation()
  const { mutateAsync: createPostViaSignedTx } =
    useCreatePostTypedDataMutation()
  const { error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast(false)

  const recentCommunities =
    JSON.parse(window.localStorage.getItem('recentCommunities')) || []
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [gifAttachment, setGifAttachment] = useState(null)
  const [showOptionsModal, setShowOptionsModal] = useState(false)

  useEffect(() => {
    console.log('gifAttachment', gifAttachment)
    console.log(
      'gifAttachment?.images?.original?.url',
      gifAttachment?.images?.original?.url
    )
    setImageValue(gifAttachment ? gifAttachment?.images?.original?.url : null)
  }, [gifAttachment])

  const storeRecentCommunities = () => {
    window.localStorage.setItem(
      'recentCommunities',
      JSON.stringify([
        selectedCommunity,
        ...recentCommunities.filter(
          (community) => community?._id !== selectedCommunity?._id
        )
      ])
    )
  }

  // const closeModal = async () => {
  //   setShowCommunity({ name: '', image: '' })
  //   hideModal()
  // }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (!communityId) {
      notifyError('Please select a community')
      setLoading(false)
      return
    }
    if (!title || title.trim() === '') {
      notifyError('Please enter a title')
      setLoading(false)
      return
    }
    // if (isLensPost) {
    // console.log('collectSettings', collectSettings)
    if (
      collectSettings?.feeCollectModule &&
      Number(collectSettings?.feeCollectModule?.amount?.value) < 0.01
    ) {
      notifyError(`Price should be atleast 0.01`)
      setLoading(false)
      return
    }
    // }
    storeRecentCommunities()
    if (gifAttachment) {
      handleCreateLensPost(title, communityId, 'image/gif', imageValue)
    }
    if (file) {
      if (!supportedMimeTypes.includes(file.type)) {
        notifyError('File type not supported')
        setLoading(false)
        return
      }
      // file size should be less than 8mb
      if (file.size > 8000000) {
        notifyError('File size should be less than 8mb')
        setLoading(false)
        return
      }

      // if (isLensPost) {
      // eslint-disable-next-line

      // const uploadedFile = await uploadFileToFirebaseAndGetUrl(file, address)
      // const ipfsHash = await uploadFileToIpfsInfuraAndGetPath(file)
      // const ipfsPath = `ipfs://${ipfsHash}`
      if (!firebaseUrl) {
        return
      }
      handleCreateLensPost(title, communityId, file.type, firebaseUrl)
      return
      // }

      // const uploadedFile = await uploadFileToFirebaseAndGetUrl(file, address)
      // handleCreatePost(
      //   title,
      //   file.type,
      //   uploadedFile.uploadedToUrl,
      //   uploadedFile.path
      // )
    } else {
      // if (isLensPost) {
      console.log('lenspost with media')
      handleCreateLensPost(title, communityId, 'text', null)
      return
      // }
      // handleCreatePost(title, 'text')
    }
  }

  const handleCreateLensPost = async (title, communityId, mimeType, url) => {
    let mainContentFocus = null
    let contentWarning = null
    //todo handle other file types and link content
    if (mimeType.startsWith('image')) {
      mainContentFocus = PublicationMainFocus.Image
    } else if (mimeType.startsWith('video')) {
      mainContentFocus = PublicationMainFocus.Video
    } else if (mimeType.startsWith('audio')) {
      mainContentFocus = PublicationMainFocus.Audio
    } else {
      mainContentFocus = PublicationMainFocus.TextOnly
    }

    if (flair === 'SENSITIVE') {
      contentWarning = PublicationContentWarning.Sensitive
    } else if (flair === 'NSFW') {
      contentWarning = PublicationContentWarning.Nsfw
    } else if (flair === 'SPOILER') {
      contentWarning = PublicationContentWarning.Spoiler
    } else {
      contentWarning = PublicationContentWarning.null
    }

    //todo map to community id, so that can be identified by community
    const metadataId = uuidv4()
    const metadata = {
      version: '2.0.0',
      mainContentFocus: mainContentFocus,
      metadata_id: metadataId,
      contentWarning: contentWarning,
      description: 'Created with DiverseHQ',
      locale: 'en-US',
      content: title + '\n' + content.trim(),
      external_url: 'https://diversehq.xyz',
      image: mimeType.startsWith('image') ? url : null,
      imageMimeType: mimeType.startsWith('image') ? mimeType : null,
      name: title,
      media:
        mimeType === 'text'
          ? null
          : [
              {
                item: url,
                type: mimeType
              }
            ],
      animation_url:
        mimeType !== 'text' && !mimeType.startsWith('image') ? url : null,
      attributes: [],
      tags: [communityId],
      appId: appId
    }
    const ipfsHash = await uploadToIpfsInfuraAndGetPath(metadata)
    const createPostRequest = {
      profileId: lensProfile?.defaultProfile?.id,
      contentURI: `ipfs://${ipfsHash}`,
      collectModule: collectSettings,
      referenceModule: {
        followerOnlyReferenceModule: false
      }
    }

    const postForIndexing = {
      tempId: metadataId,
      communityInfo: {
        _id: communityId,
        name: showCommunity.name,
        image: showCommunity.image
      },
      createdAt: new Date().toISOString(),
      hasCollectedByMe: false,
      hidden: false,
      isGated: false,
      metadata: {
        ...metadata,
        media: [{ original: { url: url, mimeType: mimeType } }]
      },
      profile: {
        _id: lensProfile?.defaultProfile?.id,
        handle: lensProfile?.defaultProfile?.handle,
        ownedBy: lensProfile?.defaultProfile?.ownedBy
      },
      reaction: 'UPVOTE',
      stats: {
        totalUpvotes: 1,
        totalAmountOfCollects: 0,
        totalAmountOfComments: 0,
        totalDownvotes: 0
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
        hideModal()
        addPost({ txId: dispatcherResult.txId }, postForIndexing)
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
      setLoading(false)
      hideModal()
      addPost({ txHash: result.txHash }, postMetadataForIndexing)
    }
  }, [result, type])

  useEffect(() => {
    if (error) {
      setLoading(false)
      notifyError(error)
    }
  }, [error])

  // const handleCreatePost = async (title, mimeType, url, path) => {
  //   const postData = {
  //     communityId,
  //     title,
  //     content
  //   }
  //   //todo handle audio file types
  //   const type = mimeType.split('/')[0]
  //   if (mimeType !== 'text') {
  //     postData[type === 'image' ? 'postImageUrl' : 'postVideoUrl'] = url
  //     postData.filePath = path
  //   }

  //   try {
  //     const resp = await postCreatePost(postData)
  //     const respData = await resp.json()
  //     if (resp.status !== 200) {
  //       notifyError(respData.msg)
  //       return
  //     }
  //     closeModal()
  //     router.push(`/p/${respData._id}`)
  //     notifySuccess('Post created successfully')
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const handleSelect = (community) => {
    const id = community._id
    const name = community.name
    const logoImageUrl = community.logoImageUrl
    setShowCommunityOptions(false)
    setCommunityId(id)
    setShowCommunity({ name, image: logoImageUrl })
    setSelectedCommunity(community)
  }

  const getJoinedCommunities = async () => {
    if (!user?.walletAddress) {
      notifyError('I think you are not logged in')
      return
    }
    setLoadingJoinedCommunities(true)
    const response = await getJoinedCommunitiesApi()
    // setting the joinedCommunitites with recentCommunitties from the localStorage at the top
    setJoinedCommunities([
      ...recentCommunities,
      // removing the communities in the recentCommunities from the joinedCommunities using communityId
      ...response.filter(
        (community) => !recentCommunities.some((c) => c?._id === community?._id)
      )
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
  const onImageChange = (event) => {
    const filePicked = event.target.files[0]
    if (!filePicked) return
    setFile(filePicked)
    setImageValue(URL.createObjectURL(filePicked))
  }
  const removeImage = async () => {
    if (loading) return
    setFile(null)
    setImageValue(null)
    setGifAttachment(null)
    if (firebaseUrl) {
      await deleteFirebaseStorageFile(firebaseUrl)
      setFirebaseUrl(null)
    }
  }

  const showAddedFile = () => {
    // check if the file is image or video and show it
    if (!file && !gifAttachment) return null
    let type = null
    if (file) type = file.type.split('/')[0]
    if (gifAttachment) type = 'image'
    return (
      <div className="flex items-center justify-center">
        <div className="relative w-fit">
          {type === 'image' && (
            <img
              src={imageValue}
              className="max-h-80 rounded-2xl object-cover"
              alt="Your amazing post"
            />
          )}

          {type === 'video' && (
            <video
              src={imageValue}
              className="max-h-80 rounded-2xl object-cover"
              controls
              muted
            ></video>
          )}

          {imageUpload ? (
            <CircularProgress
              size="30px"
              className="primary absolute z-10 top-2 right-2"
            />
          ) : (
            <AiOutlineClose
              onClick={removeImage}
              className="text-s-text w-7 h-7 bg-p-bg rounded-full p-1 absolute z-10 top-2 right-2"
            />
          )}
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

  const upLoadFile = async () => {
    try {
      setImageUpload(true)
      if (file) {
        if (!supportedMimeTypes.includes(file.type)) {
          notifyError('File type not supported')
          setImageUpload(false)
          return
        }
        // file size should be less than 8mb
        if (file.size > 8000000) {
          notifyError('File size should be less than 8mb')
          setImageUpload(false)
          return
        }

        // if (isLensPost) {
        // file should be less than 2mb
        const fileObj = await uploadFileToFirebaseAndGetUrl(file, address)
        setFirebaseUrl(fileObj.uploadedToUrl)
        // const ipfsHash = await uploadFileToIpfsInfuraAndGetPath(file)
        // setIPFSHash(ipfsHash)
        setImageUpload(false)
        // }
        // setImageUpload(false)
      }
    } catch (e) {
      console.log(e)
      setImageUpload(false)
    }
  }

  const closePopUp = async () => {
    if (loading) return
    if (firebaseUrl && !imageUpload && !result) {
      await deleteFirebaseStorageFile(firebaseUrl)
      console.log('File Deleted and the Popup has been closed')
      hideModal()
      return
    } else if (!loading && !imageUpload && !result) {
      console.log('Popup has been closed, No files detected')
      hideModal()
    }
  }

  useEffect(() => {
    if (!file) return
    if (file && !firebaseUrl) upLoadFile()
  }, [file])

  // console.log('gifAttachment', gifAttachment)

  const PopUpModal = () => {
    return (
      // simple modal
      <PopUpWrapper
        title="Create Post"
        onClick={handleSubmit}
        label="POST"
        loading={loading}
        isDisabled={!communityId || title.length === 0 || imageUpload}
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
                {showCommunity.name ? (
                  <div className="flex justify-center items-center p-2">
                    <img
                      src={showCommunity.image}
                      className="rounded-full w-10 h-10"
                    />
                    <h1 className="ml-2">{showCommunity.name}</h1>
                    <AiOutlineDown className="w-4 h-4 mx-1" />
                  </div>
                ) : (
                  <div className="flex flex-row items-center justify-center px-2">
                    <div>Choose Community</div>
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
                      }
                    },
                    {
                      label: 'NSFW',
                      onClick: () => {
                        setFlair('NSFW')
                        setShowOptionsModal(false)
                      }
                    },
                    {
                      label: 'Sensitive',
                      onClick: () => {
                        setFlair('SENSITIVE')
                        setShowOptionsModal(false)
                      }
                    },
                    {
                      label: 'Spoiler',
                      onClick: () => {
                        setFlair('SPOILER')
                        setShowOptionsModal(false)
                      }
                    }
                  ]}
                />
              )}
              position="bottom"
              showOptionsModal={showOptionsModal}
              setShowOptionsModal={setShowOptionsModal}
            >
              <button
                onClick={() => {
                  setShowOptionsModal(!showOptionsModal)
                }}
                className="flex items-center hover:cursor-pointer space-x-1 sm:space-x-2 py-1 px-2.5 sm:py-1 sm:px-2.5 rounded-full border border-s-border "
              >
                <p>{flair ? flair : 'Flair'}</p>
                <AiOutlineDown className="w-4 h-4 mx-1" />
              </button>
            </OptionsWrapper>

            <button
              onClick={() => {
                if (!isMobile) {
                  setShowCollectSettings(!showCollectSettings)
                  return
                } else {
                  setIsDrawerOpen(true)
                }
              }}
              disabled={loading}
              className="rounded-full hover:bg-s-hover p-2 cursor-pointer"
            >
              <BsCollection className="w-5 h-5" />
            </button>
            {/* )} */}
            {/* <img src="/lensLogoWithoutText.svg" className="w-5" /> */}
            {/* <Switch
              checked={isLensPost}
              onChange={() => {
                if (!isSignedIn || !hasProfile) {
                  notifyInfo('You need to be logged in lens to do that')
                  return
                }
                if (isLensPost) setShowCollectSettings(false)
                setIsLensPost(!isLensPost)
              }}
              disabled={loading}
              size="small"
              sx={{
                '& .MuiSwitch-track': {
                  backgroundColor: 'grey',
                  color: 'grey'
                }
              }}
            /> */}
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
                setFile(file)
                setImageValue(URL.createObjectURL(file))
              }}
            />

            <div className="text-base leading-relaxed m-4">
              {file || gifAttachment ? (
                showAddedFile()
              ) : (
                <label htmlFor="upload-file">
                  <div className="h-32 text-s-text flex flex-col justify-center items-center border border-s-border bg-s-bg rounded-xl">
                    <div>
                      <AiOutlineCamera className="h-8 w-8" />
                    </div>
                    <div>Add Image or Video</div>
                    <div className="text-sm">
                      (Leave Empty for only text post)
                    </div>
                  </div>
                </label>
              )}
            </div>
            <div
              className="ml-6"
              // onClick={(e) => {
              //   e.stopPropagation()
              // }}
            >
              <Giphy setGifAttachment={setGifAttachment} />
            </div>
            <input
              type="file"
              id="upload-file"
              accept="image/*,video/*"
              hidden
              onChange={onImageChange}
              disabled={loading}
            />
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
                className="bg-p-btn rounded-full text-center flex font-semibold text-p-text py-1 justify-center items-center text-p-text w-full text-xl mb-6"
              >
                Save
              </button>
            </div>
          </BottomDrawerWrapper>
        )}
      </PopUpWrapper>
    )
  }

  useEffect(() => {
    if (user) {
      getJoinedCommunities()
    }
  }, [user])

  return <div className="">{PopUpModal()}</div>
}

export default CreatePostPopup
