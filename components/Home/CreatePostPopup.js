import React, { useState, useEffect, useCallback } from 'react'
import { useProfile } from '../Common/WalletContext'
import { useNotify } from '../Common/NotifyContext'
import { useRouter } from 'next/router'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import Image from 'next/image'
import { postCreatePost } from '../../api/post'
import PopUpWrapper from '../Common/PopUpWrapper'
import { AiOutlineCamera, AiOutlineClose, AiOutlineDown } from 'react-icons/ai'
import FormTextInput from '../Common/UI/FormTextInput'
import {
  uploadFileToFirebaseAndGetUrl,
  uploadFileToIpfsInfuraAndGetPath,
  uploadToIpfsInfuraAndGetPath
  // uploadFileToIpfs
} from '../../utils/utils'
import { getJoinedCommunitiesApi } from '../../api/community'
// import ToggleSwitch from '../Post/ToggleSwitch'
import { Switch } from '@mui/material'
import { supportedMimeTypes } from '../../lib/interfaces/publication'
import { useLensUserContext } from '../../lib/LensUserContext'
import { uuidv4 } from '@firebase/util'
import { pollUntilIndexed } from '../../lib/indexer/has-transaction-been-indexed'
import {
  PublicationMainFocus,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation
} from '../../graphql/generated'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'

const CreatePostPopup = () => {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [communityId, setCommunityId] = useState(null)
  const { user, address } = useProfile()
  const [loading, setLoading] = useState(false)
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [imageValue, setImageValue] = useState(null)
  const [showCommunityOptions, setShowCommunityOptions] = useState(false)
  const [communityOptionsCoord, setCommunityOptionsCoord] = useState({
    left: '0px',
    top: '0px'
  })
  const [isLensPost, setIsLensPost] = useState(false)
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()

  const { notifyError, notifySuccess, notifyInfo } = useNotify()
  const router = useRouter()
  const { hideModal } = usePopUpModal()
  const [showCommunity, setShowCommunity] = useState({ name: '', image: '' })

  const { mutateAsync: createPostViaDispatcher } =
    useCreatePostViaDispatcherMutation()
  const { mutateAsync: createPostViaSignedTx } =
    useCreatePostTypedDataMutation()
  const { error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()

  const closeModal = () => {
    setShowCommunity({ name: '', image: '' })
    hideModal()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (!communityId) {
      notifyError('Please select a community')
      setLoading(false)
      return
    }
    if (!title) {
      notifyError('Please enter a title')
      setLoading(false)
      return
    }

    if (file) {
      if (!supportedMimeTypes.includes(file.type)) {
        notifyError('File type not supported')
        setLoading(false)
        return
      }
      // file size should be less than 5mb
      if (file.size > 5000000) {
        notifyError('File size should be less than 5mb')
        setLoading(false)
        return
      }

      if (isLensPost) {
        // file should be less than 2mb
        const ipfsHash = await uploadFileToIpfsInfuraAndGetPath(file)
        const ipfsPath = `ipfs://${ipfsHash}`
        handleCreateLensPost(title, communityId, file.type, ipfsPath)
        return
      }

      const postUrl = await uploadFileToFirebaseAndGetUrl(file, address)
      handleCreatePost(file.type, postUrl.uploadedToUrl, postUrl.path)
    } else {
      if (isLensPost) {
        handleCreateLensPost(title, communityId, 'text', null)
        return
      }
      handleCreatePost('text')
    }
  }

  const handleCreateLensPost = async (title, communityId, mimeType, url) => {
    let mainContentFocus = null
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
    //todo map to community id, so that can be identified by community
    const metadata = {
      version: '2.0.0',
      mainContentFocus: mainContentFocus,
      metadata_id: uuidv4(),
      description: title,
      locale: 'en-US',
      content: title,
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
      tags: []
    }
    console.log('metadata', metadata)
    const ipfsHash = await uploadToIpfsInfuraAndGetPath(metadata)
    console.log('ipfsHash', ipfsHash)
    const createPostRequest = {
      profileId: lensProfile?.defaultProfile?.id,
      contentURI: `ipfs://${ipfsHash}`,
      collectModule: { freeCollectModule: { followerOnly: true } },
      referenceModule: {
        followerOnlyReferenceModule: false
      }
    }
    await post(createPostRequest)
  }

  const post = async (createPostRequest) => {
    try {
      if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
        //gasless using dispatcher
        const dispatcherResult = (
          await createPostViaDispatcher({
            request: createPostRequest
          })
        ).createPostViaDispatcher
        console.log(dispatcherResult)
        console.log('index started ....')
        const indexResult = await pollUntilIndexed({
          txId: dispatcherResult.txId
        })
        console.log('index result', indexResult)
        console.log('index ended ....')

        //invalidate query to update feed
        if (indexResult.indexed === true) {
          notifySuccess('Post created successfully')
          closeModal()
        }
      } else {
        //gasless using signed broadcast
        const postTypedResult = (
          await createPostViaSignedTx({
            request: createPostRequest
          })
        ).createPostTypedData
        console.log('postTypedResult', postTypedResult)
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
  }

  useEffect(() => {
    if (result && type === 'createPost') {
      setLoading(false)
      notifySuccess('Post created successfully')
      closeModal()
    }
  }, [result, type])

  useEffect(() => {
    if (error) {
      setLoading(false)
      notifyError(error)
    }
  }, [error])

  const handleCreatePost = async (mimeType, url, path) => {
    const postData = {
      communityId,
      title
    }
    //todo handle audio file types
    if (mimeType !== 'text') {
      postData[type === 'image' ? 'postImageUrl' : 'postVideoUrl'] = url
      postData.filePath = path
    }

    try {
      const resp = await postCreatePost(postData)
      const respData = await resp.json()
      if (resp.status !== 200) {
        notifyError(respData.msg)
        return
      }
      closeModal()
      router.push(`/p/${respData._id}`)
      console.log(respData)
      notifySuccess('Post created successfully')
    } catch (error) {
      console.log(error)
    }
  }

  const handleDropDown = (id, name, logoImageUrl) => {
    setShowCommunityOptions(false)
    setCommunityId(id)
    setShowCommunity({ name, image: logoImageUrl })
  }

  const getJoinedCommunities = async () => {
    if (!user?.walletAddress) {
      notifyError('I think you are not logged in')
      return
    }
    const response = await getJoinedCommunitiesApi(user.walletAddress)
    setJoinedCommunities(response)
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
            <div className="bg-s-bg rounded-2xl">
              {joinedCommunities.map((community) => {
                console.log(community)
                return (
                  <div
                    key={community._id}
                    onClick={() => {
                      handleDropDown(
                        community._id,
                        community.name,
                        community.logoImageUrl
                      )
                    }}
                    className="flex flex-row items-center cursor-pointer p-2 m-2 rounded-2xl hover:bg-p-btn"
                    id={community._id}
                    logoImageUrl={community.logoImageUrl}
                  >
                    <Image
                      src={
                        community.logoImageUrl
                          ? community.logoImageUrl
                          : '/gradient.jpg'
                      }
                      alt="community logo"
                      className="rounded-full"
                      width={30}
                      height={30}
                    />

                    <div
                      className="text-p-text ml-4 text-base "
                      id={community._id}
                      logoImageUrl={community.logoImageUrl}
                    >
                      {community.name}
                    </div>
                  </div>
                )
              })}
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
  const removeImage = () => {
    setFile(null)
    setImageValue(null)
  }

  const showAddedFile = () => {
    // check if the file is image or video and show it
    if (!file) return null
    const type = file.type.split('/')[0]
    return (
      <div className="flex items-center justify-center">
        <div className="relative w-fit">
          {type === 'image' && (
            <img
              src={imageValue}
              className="max-h-80 rounded-2xl"
              alt="Your amazing post"
            />
          )}

          {type === 'video' && (
            <video
              src={imageValue}
              className="max-h-80 rounded-2xl"
              controls
            ></video>
          )}
          <AiOutlineClose
            onClick={removeImage}
            className="text-s-text w-7 h-7 bg-p-bg rounded-full p-1 absolute z-10 top-2 right-2"
          />
        </div>
      </div>
    )
  }

  useEffect(() => {
    console.log(communityOptionsCoord)
  }, [communityOptionsCoord])

  const showJoinedCommunities = (e) => {
    if (joinedCommunities?.length === 0) {
      notifyInfo('Hey, you ! Yes you ! Join some communities first')
      return
    }
    setShowCommunityOptions(true)
    setCommunityOptionsCoord({
      top: e.currentTarget.getBoundingClientRect().bottom + 10 + 'px',
      left: e.currentTarget.getBoundingClientRect().left + 'px'
    })
  }

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value)
  }, [])

  const PopUpModal = () => {
    return (
      // simple modal
      <PopUpWrapper
        title="Create Post"
        onClick={handleSubmit}
        label="POST"
        loading={loading}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="border border-s-text rounded-full text-p-text ml-3 w-fit px-1">
            <button
              className="text-blue-500 p-1"
              onClick={showJoinedCommunities}
            >
              {showCommunity.name ? (
                <div className="flex justify-center items-center">
                  <Image
                    src={showCommunity.image}
                    className="rounded-full"
                    width={30}
                    height={30}
                  />
                  <h1 className="ml-2">{showCommunity.name}</h1>
                </div>
              ) : (
                <div className="flex flex-row items-center justify-center">
                  <div>Choose Community</div>
                  <AiOutlineDown className="w-4 h-4 mx-1" />
                </div>
              )}
            </button>
          </div>
          <div className="flex flex-row items-center jusitify-center mr-4">
            <img src="/lensLogo.svg" className="w-6 text-sm" />
            <Switch
              checked={isLensPost}
              onChange={() => {
                setIsLensPost(!isLensPost)
              }}
              disabled={!isSignedIn || !hasProfile}
              size="small"
            />
          </div>
        </div>

        {showCommunityOptions && customOptions()}
        {/* <!-- Modal body --> */}
        <div>
          <FormTextInput
            label="Title"
            placeholder="Here you go"
            value={title}
            onChange={onChangeTitle}
          />
          <div className="text-base leading-relaxed  m-4">
            {file ? (
              showAddedFile()
            ) : (
              <label htmlFor="upload-file">
                <div className="h-32 text-s-text flex flex-col justify-center items-center border border-s-text  rounded-xl">
                  <div>
                    <AiOutlineCamera className="h-8 w-8" />
                  </div>
                  <div>Add Image or Video</div>
                </div>
              </label>
            )}
          </div>
          <input
            type="file"
            id="upload-file"
            accept="image/*,video/*"
            hidden
            onChange={onImageChange}
          />
        </div>
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
